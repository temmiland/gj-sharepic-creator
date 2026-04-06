/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { templateToState, stateToTemplate, encodeTemplateForUrl, decodeTemplateFromUrl } from '@/utils/template-io';
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

describe('templateToState blur migration', () => {
	it('migrates old rem-based blur (≤ 2) to px by multiplying by 16', () => {
		const template = { ...defaultTemplates[0], canvas: { ...defaultTemplates[0].canvas, backgroundBlur: 1 } };
		const state = templateToState(template);
		expect(state.backgroundBlur).toBe(16);
	});

	it('does not migrate blur values already in px range (> 2)', () => {
		const template = { ...defaultTemplates[0], canvas: { ...defaultTemplates[0].canvas, backgroundBlur: 20 } };
		const state = templateToState(template);
		expect(state.backgroundBlur).toBe(20);
	});

	it('does not migrate zero blur', () => {
		const template = { ...defaultTemplates[0], canvas: { ...defaultTemplates[0].canvas, backgroundBlur: 0 } };
		const state = templateToState(template);
		expect(state.backgroundBlur).toBe(0);
	});
});

describe('encodeTemplateForUrl', () => {
	it('strips data: backgroundImage', () => {
		const state = {
			...templateToState(defaultTemplates[0]),
			backgroundImage: 'data:image/png;base64,abc',
		};
		const template = stateToTemplate(state);
		template.canvas.backgroundImage = 'data:image/png;base64,abc'; // force it in for test
		const encoded = encodeTemplateForUrl(template);
		const decoded = JSON.parse(decodeURIComponent(encoded));
		expect(decoded.canvas.backgroundImage).toBeNull();
	});

	it('preserves non-data backgroundImage', () => {
		const state = templateToState(defaultTemplates[2]);
		const template = stateToTemplate(state);
		const bgImage = template.canvas.backgroundImage;
		const encoded = encodeTemplateForUrl(template);
		const decoded = JSON.parse(decodeURIComponent(encoded));
		expect(decoded.canvas.backgroundImage).toBe(bgImage);
	});

	it('strips data: src from image elements', () => {
		const state = templateToState(defaultTemplates[0]);
		const template = stateToTemplate(state);
		template.elements.push({
			id: 'img1', type: 'image', x: 0, y: 0, visible: true,
			src: 'data:image/png;base64,xyz', width: 100, height: 100, opacity: 1, rotation: 0,
		});
		const encoded = encodeTemplateForUrl(template);
		const decoded = JSON.parse(decodeURIComponent(encoded));
		const imgEl = decoded.elements.find((e: { type: string }) => e.type === 'image');
		expect(imgEl.src).toBe('');
	});

	it('preserves non-data image src', () => {
		const state = templateToState(defaultTemplates[0]);
		const template = stateToTemplate(state);
		template.elements.push({
			id: 'img2', type: 'image', x: 0, y: 0, visible: true,
			src: 'https://example.com/img.png', width: 100, height: 100, opacity: 1, rotation: 0,
		});
		const encoded = encodeTemplateForUrl(template);
		const decoded = JSON.parse(decodeURIComponent(encoded));
		const imgEl = decoded.elements.find((e: { type: string }) => e.type === 'image');
		expect(imgEl.src).toBe('https://example.com/img.png');
	});
});

describe('decodeTemplateFromUrl', () => {
	it('returns null when no ?t= param present', () => {
		vi.stubGlobal('window', { location: { search: '' } });
		expect(decodeTemplateFromUrl()).toBeNull();
	});

	it('returns null for invalid JSON', () => {
		vi.stubGlobal('window', { location: { search: '?t=notjson' } });
		expect(decodeTemplateFromUrl()).toBeNull();
	});

	it('returns null for structurally invalid template', () => {
		const bad = encodeURIComponent(JSON.stringify({ foo: 'bar' }));
		vi.stubGlobal('window', { location: { search: `?t=${bad}` } });
		expect(decodeTemplateFromUrl()).toBeNull();
	});

	it('round-trips a valid template through URL encoding', () => {
		const template = stateToTemplate(templateToState(defaultTemplates[0]));
		const encoded = encodeTemplateForUrl(template);
		vi.stubGlobal('window', { location: { search: `?t=${encoded}` } });
		const result = decodeTemplateFromUrl();
		expect(result).not.toBeNull();
		expect(result!.id).toBe(template.id);
		expect(result!.name).toBe(template.name);
	});

	it('infers templateType from canvas height when missing', () => {
		const template = stateToTemplate(templateToState(defaultTemplates[0]));
		const raw = JSON.parse(decodeURIComponent(encodeTemplateForUrl(template)));
		delete raw.templateType;
		const encoded = encodeURIComponent(JSON.stringify(raw));
		vi.stubGlobal('window', { location: { search: `?t=${encoded}` } });
		const result = decodeTemplateFromUrl();
		// canvas height 450 < 600 → sharepic
		expect(result!.templateType).toBe('sharepic');
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
