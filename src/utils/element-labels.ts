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
