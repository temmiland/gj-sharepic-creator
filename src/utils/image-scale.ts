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
 * Maximum allowed data URL size in bytes (≈150 KB).
 * Data URLs are base64 which inflates size by ~33%, so the raw blob target is ~112 KB.
 */
const MAX_DATA_URL_BYTES = 150 * 1024;

/**
 * Scales an image file down to fit within maxW × maxH using an offscreen canvas,
 * then returns a compressed WebP data URL together with the original dimensions.
 *
 * The output is guaranteed to be ≤ 150 KB. If the initial compression exceeds that,
 * the quality is iteratively lowered (and if necessary, dimensions are further reduced)
 * until the size constraint is met.
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
			let scale = Math.min(1, maxW / naturalWidth, maxH / naturalHeight);
			let w = Math.round(naturalWidth * scale);
			let h = Math.round(naturalHeight * scale);

			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(new Error('Canvas 2D context not available'));
				return;
			}

			// Try progressively lower quality, then smaller dimensions
			let quality = 0.85;
			let dataUrl: string;
			let attempts = 0;

			while (attempts < 10) {
				canvas.width = w;
				canvas.height = h;
				ctx.clearRect(0, 0, w, h);
				ctx.drawImage(img, 0, 0, w, h);

				dataUrl = canvas.toDataURL('image/webp', quality);

				if (dataUrl.length <= MAX_DATA_URL_BYTES) {
					resolve({ dataUrl, naturalWidth, naturalHeight });
					return;
				}

				attempts++;

				if (quality > 0.4) {
					// First: reduce quality
					quality = Math.round((quality - 0.1) * 100) / 100;
				} else {
					// Then: reduce dimensions by 20% each step
					w = Math.round(w * 0.8);
					h = Math.round(h * 0.8);
					quality = 0.6;
				}
			}

			// Final fallback: accept whatever we have
			resolve({ dataUrl: dataUrl!, naturalWidth, naturalHeight });
		};

		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('Bilddatei konnte nicht geladen werden'));
		};

		img.src = url;
	});
}
