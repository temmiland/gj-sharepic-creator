/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { describe, it, expect } from 'vitest';
import { getElementSize, centerElementHorizontally, centerElementVertically } from '@/utils/element-size';
import type { HeadingElement, TextElement, LogoElement, ArrowElement, PictogramElement, ImageElement } from '@/types/template';

describe('getElementSize', () => {
	it('calculates heading size based on non-empty lines and fontSize', () => {
		const heading: HeadingElement = {
			id: 'h1', type: 'heading', x: 0, y: 0, visible: true,
			content: ['Zeile 1', '', 'Zeile 3'], fontSize: 3.75, width: 297,
		};
		const size = getElementSize(heading);
		expect(size.w).toBe(297);
		// 2 non-empty lines * 3.75 * 10 * 1.35 = 101.25 → rounded to 101
		expect(size.h).toBe(101);
	});

	it('returns minimum 1 line for empty heading', () => {
		const heading: HeadingElement = {
			id: 'h1', type: 'heading', x: 0, y: 0, visible: true,
			content: [], fontSize: 2, width: 200,
		};
		const size = getElementSize(heading);
		expect(size.h).toBe(Math.round(1 * 2 * 10 * 1.35));
	});

	it('calculates text size based on line count', () => {
		const text: TextElement = {
			id: 't1', type: 'text', x: 0, y: 0, visible: true,
			content: ['Zeile 1', 'Zeile 2', 'Zeile 3'], width: 297,
		};
		const size = getElementSize(text);
		expect(size.w).toBe(297);
		expect(size.h).toBe(54); // 3 * 18
	});

	it('returns fixed size for logo', () => {
		const logo: LogoElement = {
			id: 'l1', type: 'logo', x: 0, y: 0, visible: true,
			localGroup: 'Leipzig',
		};
		expect(getElementSize(logo)).toEqual({ w: 102, h: 52 });
	});

	it('returns arrow size as square', () => {
		const arrow: ArrowElement = {
			id: 'a1', type: 'arrow', x: 0, y: 0, visible: true,
			size: 50,
		};
		expect(getElementSize(arrow)).toEqual({ w: 50, h: 50 });
	});

	it('calculates pictogram size in pixels (size * 10)', () => {
		const pictogram: PictogramElement = {
			id: 'p1', type: 'pictogram', x: 0, y: 0, visible: true,
			pictogramName: 'Banner', size: 18,
		};
		expect(getElementSize(pictogram)).toEqual({ w: 180, h: 180 });
	});

	it('returns image dimensions as-is', () => {
		const image: ImageElement = {
			id: 'i1', type: 'image', x: 0, y: 0, visible: true,
			src: '', width: 200, height: 150, opacity: 1, rotation: 0,
		};
		expect(getElementSize(image)).toEqual({ w: 200, h: 150 });
	});
});

describe('centerElementHorizontally', () => {
	it('centers a 200px wide element in 360px canvas', () => {
		const el: ArrowElement = {
			id: 'a1', type: 'arrow', x: 0, y: 0, visible: true, size: 200,
		};
		expect(centerElementHorizontally(el)).toBe(80); // (360 - 200) / 2
	});
});

describe('centerElementVertically', () => {
	it('centers a 100px tall element in 450px canvas', () => {
		const el: ArrowElement = {
			id: 'a1', type: 'arrow', x: 0, y: 0, visible: true, size: 100,
		};
		expect(centerElementVertically(el)).toBe(175); // (450 - 100) / 2
	});
});
