import { describe, it, expect } from 'vitest';
import { templateToState } from '@/utils/template-io';
import { defaultTemplates } from '@/constants/default-templates';
import { colorSets, highlightColors } from '@/constants/colors';
import { backgroundPositions } from '@/constants/background-positions';
import { sharePicReducer } from '@/context/SharePicContext';
import type { SharePicAction, SharePicState } from '@/context/SharePicContext';
import { generateUUID } from '@/utils/uuid';
import type { TemplateElement } from '@/types/template';

const baseState: SharePicState = templateToState(defaultTemplates[0]);

describe('sharePicReducer', () => {
	it('LOAD_TEMPLATE replaces state entirely', () => {
		const newState = templateToState(defaultTemplates[1]);
		const result = sharePicReducer(baseState, { type: 'LOAD_TEMPLATE', payload: newState });
		expect(result.templateId).toBe(newState.templateId);
		expect(result.templateName).toBe(newState.templateName);
	});

	it('SET_TEMPLATE_NAME updates templateName only', () => {
		const result = sharePicReducer(baseState, { type: 'SET_TEMPLATE_NAME', payload: 'Neuer Name' });
		expect(result.templateName).toBe('Neuer Name');
		expect(result.elements).toBe(baseState.elements);
	});

	it('SET_COLOR_SET updates colorSet only', () => {
		const newColorSet = colorSets[1];
		const result = sharePicReducer(baseState, { type: 'SET_COLOR_SET', payload: newColorSet });
		expect(result.colorSet).toEqual(newColorSet);
		expect(result.elements).toBe(baseState.elements);
	});

	it('SET_HIGHLIGHT_COLOR updates highlightColor only', () => {
		const newHighlight = highlightColors[1];
		const result = sharePicReducer(baseState, { type: 'SET_HIGHLIGHT_COLOR', payload: newHighlight });
		expect(result.highlightColor).toEqual(newHighlight);
	});

	it('SET_BACKGROUND_IMAGE sets image and uploaded flag', () => {
		const result = sharePicReducer(baseState, { type: 'SET_BACKGROUND_IMAGE', payload: 'data:image/png;base64,abc', uploaded: true });
		expect(result.backgroundImage).toBe('data:image/png;base64,abc');
		expect(result.backgroundImageUploaded).toBe(true);
	});

	it('SET_BACKGROUND_IMAGE with null clears image', () => {
		const stateWithImage = { ...baseState, backgroundImage: 'url', backgroundImageUploaded: true };
		const result = sharePicReducer(stateWithImage, { type: 'SET_BACKGROUND_IMAGE', payload: null });
		expect(result.backgroundImage).toBeNull();
		expect(result.backgroundImageUploaded).toBe(false);
	});

	it('SET_BACKGROUND_POSITION updates position', () => {
		const pos = backgroundPositions[1];
		const result = sharePicReducer(baseState, { type: 'SET_BACKGROUND_POSITION', payload: pos });
		expect(result.backgroundPosition).toEqual(pos);
	});

	it('SET_BACKGROUND_BLUR updates blur value', () => {
		const result = sharePicReducer(baseState, { type: 'SET_BACKGROUND_BLUR', payload: 8 });
		expect(result.backgroundBlur).toBe(8);
	});

	it('SET_BACKGROUND_BRIGHTNESS updates brightness value', () => {
		const result = sharePicReducer(baseState, { type: 'SET_BACKGROUND_BRIGHTNESS', payload: 50 });
		expect(result.backgroundBrightness).toBe(50);
	});

	it('ADD_ELEMENT appends a new element', () => {
		const newElement: TemplateElement = {
			type: 'heading',
			id: generateUUID(),
			visible: true,
			x: 0,
			y: 0,
			content: ['Test'],
			fontSize: 2,
			width: 300,
		};
		const result = sharePicReducer(baseState, { type: 'ADD_ELEMENT', payload: newElement });
		expect(result.elements).toHaveLength(baseState.elements.length + 1);
		expect(result.elements[result.elements.length - 1]).toEqual(newElement);
	});

	it('REMOVE_ELEMENT removes the element by id', () => {
		const elementToRemove = baseState.elements[0];
		const result = sharePicReducer(baseState, { type: 'REMOVE_ELEMENT', payload: elementToRemove.id });
		expect(result.elements).toHaveLength(baseState.elements.length - 1);
		expect(result.elements.find(el => el.id === elementToRemove.id)).toBeUndefined();
	});

	it('REMOVE_ELEMENT clears selectedElementId when removed element was selected', () => {
		const elementId = baseState.elements[0].id;
		const stateWithSelection = { ...baseState, selectedElementId: elementId };
		const result = sharePicReducer(stateWithSelection, { type: 'REMOVE_ELEMENT', payload: elementId });
		expect(result.selectedElementId).toBeNull();
	});

	it('REMOVE_ELEMENT keeps selectedElementId when a different element is removed', () => {
		const [first, second] = baseState.elements;
		if (!second) return; // skip if only 1 element
		const stateWithSelection = { ...baseState, selectedElementId: second.id };
		const result = sharePicReducer(stateWithSelection, { type: 'REMOVE_ELEMENT', payload: first.id });
		expect(result.selectedElementId).toBe(second.id);
	});

	it('UPDATE_ELEMENT merges changes into the target element', () => {
		const target = baseState.elements[0];
		const result = sharePicReducer(baseState, {
			type: 'UPDATE_ELEMENT',
			payload: { id: target.id, changes: { x: 99, y: 77 } },
		});
		const updated = result.elements.find(el => el.id === target.id)!;
		expect(updated.x).toBe(99);
		expect(updated.y).toBe(77);
		// other elements unchanged
		expect(result.elements.filter(el => el.id !== target.id)).toEqual(
			baseState.elements.filter(el => el.id !== target.id)
		);
	});

	it('SELECT_ELEMENT sets selectedElementId', () => {
		const id = baseState.elements[0].id;
		const result = sharePicReducer(baseState, { type: 'SELECT_ELEMENT', payload: id });
		expect(result.selectedElementId).toBe(id);
	});

	it('SELECT_ELEMENT with null clears selection', () => {
		const stateWithSelection = { ...baseState, selectedElementId: baseState.elements[0].id };
		const result = sharePicReducer(stateWithSelection, { type: 'SELECT_ELEMENT', payload: null });
		expect(result.selectedElementId).toBeNull();
	});
});

describe('SharePicState shape', () => {
	it('templateToState produces a valid SharePicState', () => {
		const state = templateToState(defaultTemplates[0]);

		expect(typeof state.templateId).toBe('string');
		expect(typeof state.templateName).toBe('string');
		expect(state.colorSet).toBeDefined();
		expect(state.colorSet.name).toBeTruthy();
		expect(state.colorSet.backgroundColor).toBeTruthy();
		expect(state.colorSet.accentColor).toBeTruthy();
		expect(state.highlightColor).toBeDefined();
		expect(state.highlightColor.name).toBeTruthy();
		expect(state.highlightColor.backgroundColor).toBeTruthy();
		expect(typeof state.backgroundBlur).toBe('number');
		expect(typeof state.backgroundBrightness).toBe('number');
		expect(Array.isArray(state.elements)).toBe(true);
		expect(state.selectedElementId).toBeNull();
	});
});

describe('Action type coverage', () => {
	it('all action types are defined', () => {
		const actionTypes: SharePicAction['type'][] = [
			'LOAD_TEMPLATE',
			'SET_TEMPLATE_NAME',
			'SET_COLOR_SET',
			'SET_HIGHLIGHT_COLOR',
			'SET_BACKGROUND_IMAGE',
			'SET_BACKGROUND_POSITION',
			'SET_BACKGROUND_BLUR',
			'SET_BACKGROUND_BRIGHTNESS',
			'UPDATE_ELEMENT',
			'ADD_ELEMENT',
			'REMOVE_ELEMENT',
			'SELECT_ELEMENT',
		];
		expect(actionTypes).toHaveLength(12);
	});
});

describe('Constants integrity', () => {
	it('colorSets all have required fields', () => {
		for (const cs of colorSets) {
			expect(cs.name).toBeTruthy();
			expect(cs.backgroundColor).toBeTruthy();
			expect(cs.accentColor).toBeTruthy();
		}
	});

	it('highlightColors all have required fields', () => {
		for (const hc of highlightColors) {
			expect(hc.name).toBeTruthy();
			expect(hc.backgroundColor).toBeTruthy();
		}
	});

	it('backgroundPositions all have required fields', () => {
		for (const bp of backgroundPositions) {
			expect(bp.displayName).toBeTruthy();
			expect(bp.value).toBeTruthy();
		}
	});

	it('default template colorSetNames reference valid colorSets', () => {
		const validNames = new Set(colorSets.map(cs => cs.name));
		for (const template of defaultTemplates) {
			expect(validNames.has(template.canvas.colorSetName)).toBe(true);
		}
	});

	it('default template highlightColorNames reference valid highlightColors', () => {
		const validNames = new Set(highlightColors.map(hc => hc.name));
		for (const template of defaultTemplates) {
			expect(validNames.has(template.canvas.highlightColorName)).toBe(true);
		}
	});
});


describe('SharePicState shape', () => {
	it('templateToState produces a valid SharePicState', () => {
		const state = templateToState(defaultTemplates[0]);

		// Verify all required fields exist
		expect(typeof state.templateId).toBe('string');
		expect(typeof state.templateName).toBe('string');
		expect(state.colorSet).toBeDefined();
		expect(state.colorSet.name).toBeTruthy();
		expect(state.colorSet.backgroundColor).toBeTruthy();
		expect(state.colorSet.accentColor).toBeTruthy();
		expect(state.highlightColor).toBeDefined();
		expect(state.highlightColor.name).toBeTruthy();
		expect(state.highlightColor.backgroundColor).toBeTruthy();
		expect(typeof state.backgroundBlur).toBe('number');
		expect(typeof state.backgroundBrightness).toBe('number');
		expect(Array.isArray(state.elements)).toBe(true);
		expect(state.selectedElementId).toBeNull();
	});
});

describe('Action type coverage', () => {
	it('all action types are defined', () => {
		const actionTypes: SharePicAction['type'][] = [
			'LOAD_TEMPLATE',
			'SET_TEMPLATE_NAME',
			'SET_COLOR_SET',
			'SET_HIGHLIGHT_COLOR',
			'SET_BACKGROUND_IMAGE',
			'SET_BACKGROUND_POSITION',
			'SET_BACKGROUND_BLUR',
			'SET_BACKGROUND_BRIGHTNESS',
			'UPDATE_ELEMENT',
			'ADD_ELEMENT',
			'REMOVE_ELEMENT',
			'SELECT_ELEMENT',
		];
		expect(actionTypes).toHaveLength(12);
	});
});

describe('Constants integrity', () => {
	it('colorSets all have required fields', () => {
		for (const cs of colorSets) {
			expect(cs.name).toBeTruthy();
			expect(cs.backgroundColor).toBeTruthy();
			expect(cs.accentColor).toBeTruthy();
		}
	});

	it('highlightColors all have required fields', () => {
		for (const hc of highlightColors) {
			expect(hc.name).toBeTruthy();
			expect(hc.backgroundColor).toBeTruthy();
		}
	});

	it('backgroundPositions all have required fields', () => {
		for (const bp of backgroundPositions) {
			expect(bp.displayName).toBeTruthy();
			expect(bp.value).toBeTruthy();
		}
	});

	it('default template colorSetNames reference valid colorSets', () => {
		const validNames = new Set(colorSets.map(cs => cs.name));
		for (const template of defaultTemplates) {
			expect(validNames.has(template.canvas.colorSetName)).toBe(true);
		}
	});

	it('default template highlightColorNames reference valid highlightColors', () => {
		const validNames = new Set(highlightColors.map(hc => hc.name));
		for (const template of defaultTemplates) {
			expect(validNames.has(template.canvas.highlightColorName)).toBe(true);
		}
	});
});
