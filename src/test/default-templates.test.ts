import { describe, it, expect } from 'vitest';
import { defaultTemplates } from '@/constants/default-templates';

describe('defaultTemplates', () => {
	it('contains 5 templates', () => {
		expect(defaultTemplates).toHaveLength(5);
	});

	it('all templates have unique IDs', () => {
		const ids = defaultTemplates.map(t => t.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('all templates have required fields', () => {
		for (const template of defaultTemplates) {
			expect(template.id).toBeTruthy();
			expect(template.name).toBeTruthy();
			expect(template.version).toBe(1);
			expect(template.canvas).toBeDefined();
			expect(template.canvas.width).toBe(360);
			expect(template.canvas.height).toBe(450);
			expect(Array.isArray(template.elements)).toBe(true);
		}
	});

	it('all elements have required base fields', () => {
		for (const template of defaultTemplates) {
			for (const el of template.elements) {
				expect(el.id).toBeTruthy();
				expect(typeof el.x).toBe('number');
				expect(typeof el.y).toBe('number');
				expect(typeof el.visible).toBe('boolean');
				expect(['heading', 'text', 'logo', 'arrow', 'pictogram', 'image']).toContain(el.type);
			}
		}
	});

	it('heading elements have content, fontSize, and width', () => {
		for (const template of defaultTemplates) {
			for (const el of template.elements) {
				if (el.type === 'heading') {
					expect(Array.isArray(el.content)).toBe(true);
					expect(el.content.length).toBeGreaterThan(0);
					expect(typeof el.fontSize).toBe('number');
					expect(typeof el.width).toBe('number');
				}
			}
		}
	});

	it('text elements have content and width', () => {
		for (const template of defaultTemplates) {
			for (const el of template.elements) {
				if (el.type === 'text') {
					expect(Array.isArray(el.content)).toBe(true);
					expect(typeof el.width).toBe('number');
				}
			}
		}
	});
});
