/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { TemplateElement } from '@/types/template';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/canvas';

export function getElementSize(element: TemplateElement): { w: number; h: number } {
	switch (element.type) {
		case 'heading': {
			const lines = element.content.filter(l => l !== '').length || 1;
			return { w: element.width, h: Math.round(lines * element.fontSize * 10 * 1.35) };
		}
		case 'text': {
			const lines = element.content.length || 1;
			return { w: element.width, h: Math.round(lines * 18) };
		}
		case 'logo':
			return { w: 102, h: 52 };
		case 'arrow':
			return { w: element.size, h: element.size };
		case 'pictogram':
			return { w: element.size * 10, h: element.size * 10 };
		case 'image':
			return { w: element.width, h: element.height };
	}
}

export function centerElementHorizontally(element: TemplateElement, canvasWidth = CANVAS_WIDTH): number {
	const { w } = getElementSize(element);
	return Math.round((canvasWidth - w) / 2);
}

export function centerElementVertically(element: TemplateElement, canvasHeight = CANVAS_HEIGHT): number {
	const { h } = getElementSize(element);
	return Math.round((canvasHeight - h) / 2);
}
