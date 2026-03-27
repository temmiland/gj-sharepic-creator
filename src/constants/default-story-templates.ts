/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { SharePicTemplate } from '@/types/template';

export const defaultStoryTemplates: SharePicTemplate[] = [
	{
		id: 'story-top',
		name: 'Top Text',
		version: 1,
		templateType: 'overlay',
		canvas: {
			width: 360,
			height: 640,
			colorSetName: 'White',
			highlightColorName: 'Light Green',
			backgroundImage: null,
			backgroundPositionValue: 'top left',
			backgroundBlur: 0,
			backgroundBrightness: 100,
		},
		elements: [
			{
				id: 'logo-1',
				type: 'logo',
				x: 12,
				y: 595,
				visible: true,
				localGroup: 'Leipzig',
			},
			{
				id: 'heading-top',
				type: 'heading',
				x: 30,
				y: 50,
				visible: true,
				content: ['*Oben'],
				fontSize: 2.5,
				width: 297,
			},
		],
	},
	{
		id: 'story-bottom',
		name: 'Bottom Text',
		version: 1,
		templateType: 'overlay',
		canvas: {
			width: 360,
			height: 640,
			colorSetName: 'White',
			highlightColorName: 'Light Green',
			backgroundImage: null,
			backgroundPositionValue: 'top left',
			backgroundBlur: 0,
			backgroundBrightness: 100,
		},
		elements: [
			{
				id: 'logo-1',
				type: 'logo',
				x: 12,
				y: 595,
				visible: true,
				localGroup: 'Leipzig',
			},
			{
				id: 'heading-bottom',
				type: 'heading',
				x: 30,
				y: 480,
				visible: true,
				content: ['*Unten'],
				fontSize: 2.5,
				width: 297,
			},
		],
	},
];
