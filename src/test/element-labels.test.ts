import { describe, it, expect } from 'vitest';
import { getElementTypeLabel } from '@/utils/element-labels';

describe('getElementTypeLabel', () => {
	it('returns correct German labels for all element types', () => {
		expect(getElementTypeLabel('heading')).toBe('Überschrift');
		expect(getElementTypeLabel('text')).toBe('Text');
		expect(getElementTypeLabel('logo')).toBe('Logo');
		expect(getElementTypeLabel('arrow')).toBe('Pfeil');
		expect(getElementTypeLabel('pictogram')).toBe('Piktogramm');
		expect(getElementTypeLabel('image')).toBe('Bild');
	});
});
