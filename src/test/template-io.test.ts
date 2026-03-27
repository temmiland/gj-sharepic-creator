import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateToState, stateToTemplate } from '@/utils/template-io';
import { defaultTemplates } from '@/constants/default-templates';

describe('templateToState', () => {
	it('converts default template to valid state', () => {
		const template = defaultTemplates[0];
		const state = templateToState(template);

		expect(state.templateId).toBe(template.id);
		expect(state.templateName).toBe(template.name);
		expect(state.colorSet.name).toBe(template.canvas.colorSetName);
		expect(state.highlightColor.name).toBe(template.canvas.highlightColorName);
		expect(state.backgroundImage).toBe(template.canvas.backgroundImage);
		expect(state.backgroundImageUploaded).toBe(false);
		expect(state.backgroundBlur).toBe(template.canvas.backgroundBlur);
		expect(state.backgroundBrightness).toBe(template.canvas.backgroundBrightness);
		expect(state.elements).toHaveLength(template.elements.length);
		expect(state.selectedElementId).toBeNull();
	});

	it('deep-clones elements so mutations do not affect original', () => {
		const template = defaultTemplates[0];
		const state = templateToState(template);

		// Mutate the state's element
		state.elements[0].x = 9999;

		// Original template should be unaffected
		expect(template.elements[0].x).not.toBe(9999);
	});

	it('handles all default templates without errors', () => {
		for (const template of defaultTemplates) {
			expect(() => templateToState(template)).not.toThrow();
		}
	});
});

describe('stateToTemplate', () => {
	it('round-trips: template → state → template preserves data', () => {
		const original = defaultTemplates[1];
		const state = templateToState(original);
		const result = stateToTemplate(state);

		expect(result.id).toBe(original.id);
		expect(result.name).toBe(original.name);
		expect(result.version).toBe(1);
		expect(result.canvas.colorSetName).toBe(original.canvas.colorSetName);
		expect(result.canvas.highlightColorName).toBe(original.canvas.highlightColorName);
		expect(result.canvas.backgroundBlur).toBe(original.canvas.backgroundBlur);
		expect(result.canvas.backgroundBrightness).toBe(original.canvas.backgroundBrightness);
		expect(result.elements).toHaveLength(original.elements.length);
	});

	it('sets canvas dimensions to 360x450', () => {
		const state = templateToState(defaultTemplates[0]);
		const template = stateToTemplate(state);

		expect(template.canvas.width).toBe(360);
		expect(template.canvas.height).toBe(450);
	});

	it('strips uploaded background images (not persisted)', () => {
		const state = {
			...templateToState(defaultTemplates[0]),
			backgroundImage: 'data:image/png;base64,abc',
			backgroundImageUploaded: true,
		};
		const template = stateToTemplate(state);

		expect(template.canvas.backgroundImage).toBeNull();
	});

	it('preserves non-uploaded background images', () => {
		const state = {
			...templateToState(defaultTemplates[2]), // event template has bg image
			backgroundImageUploaded: false,
		};
		const template = stateToTemplate(state);

		expect(template.canvas.backgroundImage).toBe(state.backgroundImage);
	});
});

describe('localStorage operations', () => {
	beforeEach(() => {
		const store: Record<string, string> = {};
		vi.stubGlobal('localStorage', {
			getItem(key: string) { return store[key] ?? null; },
			setItem(key: string, value: string) { store[key] = value; },
			removeItem(key: string) { delete store[key]; },
		});
	});

	it('saveCustomTemplateToStorage and loadCustomTemplatesFromStorage round-trip', async () => {
		const { saveCustomTemplateToStorage, loadCustomTemplatesFromStorage } = await import('../utils/template-io');

		const template = stateToTemplate({
			...templateToState(defaultTemplates[0]),
			templateId: 'custom-test-id',
			templateName: 'Test Template',
		});

		saveCustomTemplateToStorage(template);
		const loaded = loadCustomTemplatesFromStorage();

		expect(loaded).toHaveLength(1);
		expect(loaded[0].id).toBe('custom-test-id');
		expect(loaded[0].name).toBe('Test Template');
	});

	it('removeCustomTemplateFromStorage removes a template', async () => {
		const { saveCustomTemplateToStorage, removeCustomTemplateFromStorage, loadCustomTemplatesFromStorage } = await import('../utils/template-io');

		const template = stateToTemplate({
			...templateToState(defaultTemplates[0]),
			templateId: 'to-remove',
		});

		saveCustomTemplateToStorage(template);
		expect(loadCustomTemplatesFromStorage()).toHaveLength(1);

		removeCustomTemplateFromStorage('to-remove');
		expect(loadCustomTemplatesFromStorage()).toHaveLength(0);
	});
});
