/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

/**
 * Scales an image file down to fit within maxW × maxH using an offscreen canvas,
 * then returns a compressed WebP data URL together with the original dimensions.
 *
 * Using URL.createObjectURL avoids loading the entire file into memory as base64
 * before we even start processing it, which is what makes large uploads hang.
 */
export async function scaleImageToDataUrl(
	file: File,
	maxW: number,
	maxH: number,
): Promise<{ dataUrl: string; naturalWidth: number; naturalHeight: number }> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();

		img.onload = () => {
			URL.revokeObjectURL(url);

			const { naturalWidth, naturalHeight } = img;
			const scale = Math.min(1, maxW / naturalWidth, maxH / naturalHeight);
			const w = Math.round(naturalWidth * scale);
			const h = Math.round(naturalHeight * scale);

			const canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;

			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas 2D context not available'));
				return;
			}

			ctx.drawImage(img, 0, 0, w, h);

			// WebP with q=0.85 gives excellent quality at a fraction of the file size.
			// All modern browsers support WebP. Falls back gracefully to PNG on export.
			const dataUrl = canvas.toDataURL('image/webp', 0.85);
			resolve({ dataUrl, naturalWidth, naturalHeight });
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Bilddatei konnte nicht geladen werden'));
		};

		img.src = url;
	});
}
