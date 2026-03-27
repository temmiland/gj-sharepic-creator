/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { TemplateElementType } from '@/types/template';

export function getElementTypeLabel(type: TemplateElementType): string {
	switch (type) {
		case 'heading': return 'Überschrift';
		case 'text': return 'Text';
		case 'logo': return 'Logo';
		case 'arrow': return 'Pfeil';
		case 'pictogram': return 'Piktogramm';
		case 'image': return 'Bild';
	}
}
