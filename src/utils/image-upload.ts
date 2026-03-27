/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { supabase } from '@/lib/supabase';
import type { SharePicTemplate } from '@/types/template';

/**
 * Converts any image data URL to a blob via canvas, with optional downscaling.
 * Tries WebP first; falls back to JPEG for browsers that don't support WebP encoding (e.g. Safari).
 */
function toImageBlob(dataUrl: string, maxDimension?: number, quality = 0.9): Promise<Blob> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			let { naturalWidth: w, naturalHeight: h } = img;
			if (maxDimension && (w > maxDimension || h > maxDimension)) {
				const ratio = Math.min(maxDimension / w, maxDimension / h);
				w = Math.round(w * ratio);
				h = Math.round(h * ratio);
			}
			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas context not available'));
				return;
			}
			ctx.drawImage(img, 0, 0, w, h);

			const toJpeg = () => {
				canvas.toBlob(blob => {
					if (blob) resolve(blob);
					else reject(new Error('Bildkonvertierung fehlgeschlagen'));
				}, 'image/jpeg', quality);
			};

			// Safari < 15 may return a PNG blob instead of null when WebP is unsupported.
			// Check the MIME type explicitly before accepting the WebP blob.
			canvas.toBlob(blob => {
				if (blob?.type === 'image/webp') resolve(blob);
				else toJpeg();
			}, 'image/webp', quality);
		};
		img.onerror = () => reject(new Error('Bild konnte nicht geladen werden'));
		img.src = dataUrl;
	});
}

/**
 * Uploads a data URL to Supabase Storage and returns the public URL.
 * Uses WebP where supported, JPEG as fallback (e.g. Safari).
 * Filename includes a timestamp so old uploads can be cleaned up later.
 */
export async function uploadImageToSupabase(dataUrl: string, maxDimension?: number, quality?: number): Promise<string> {
	const blob = await toImageBlob(dataUrl, maxDimension, quality);

	const timestamp = Date.now();
	const random = Math.random().toString(36).slice(2, 8);
	const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
	const filename = `${timestamp}-${random}.${ext}`;

	const { data, error } = await supabase.storage
		.from('images')
		.upload(filename, blob, { contentType: blob.type, upsert: false });

	if (error) throw error;

	const { data: { publicUrl } } = supabase.storage
		.from('images')
		.getPublicUrl(data.path);

	return publicUrl;
}

/**
 * Uploads all data-URL images in a template (background + image elements) to
 * Supabase Storage in parallel and replaces the data URLs with public URLs in place.
 * The template object is mutated directly (it should already be a clone).
 */
export async function uploadTemplateImages(template: SharePicTemplate, maxDimension?: number, quality?: number): Promise<void> {
	const uploads: Promise<void>[] = [];

	if (template.canvas.backgroundImage?.startsWith('data:')) {
		uploads.push(
			uploadImageToSupabase(template.canvas.backgroundImage, maxDimension, quality).then(url => {
				template.canvas.backgroundImage = url;
			})
		);
	}

	for (const el of template.elements) {
		if (el.type === 'image' && el.src.startsWith('data:')) {
			uploads.push(
				uploadImageToSupabase(el.src, maxDimension, quality).then(url => {
					el.src = url;
				})
			);
		}
	}

	await Promise.all(uploads);
}
