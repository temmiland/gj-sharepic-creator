/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { SharePicTemplate, TemplateElement } from '@/types/template';
import type { ColorSet, HighlightColor, BackgroundPosition } from '@/types/design-tokens';
import { colorSets, highlightColors } from '@/constants/colors';
import { backgroundPositions } from '@/constants/background-positions';
const STORAGE_KEY = 'gj-sharepic-custom-templates';

export function templateToState(template: SharePicTemplate) {
	const colorSet = colorSets.find(c => c.name === template.canvas.colorSetName) ?? colorSets[0];
	const highlightColor = highlightColors.find(c => c.name === template.canvas.highlightColorName) ?? highlightColors[0];
	const backgroundPosition = backgroundPositions.find(bp => bp.value === template.canvas.backgroundPositionValue) ?? backgroundPositions[0];

	return {
		templateId: template.id,
		templateName: template.name,
		colorSet,
		highlightColor,
		backgroundImage: template.canvas.backgroundImage,
		backgroundImageUploaded: false,
		backgroundPosition,
		// Migrate old rem-based blur values (0 < v ≤ 2) to px (multiply by 16)
		backgroundBlur: template.canvas.backgroundBlur > 0 && template.canvas.backgroundBlur <= 2
			? Math.round(template.canvas.backgroundBlur * 16)
			: template.canvas.backgroundBlur,
		backgroundBrightness: template.canvas.backgroundBrightness,
		elements: structuredClone(template.elements),
		selectedElementId: null,
	};
}

export function stateToTemplate(state: {
	templateId: string;
	templateName: string;
	colorSet: ColorSet;
	highlightColor: HighlightColor;
	backgroundImage: string | null;
	backgroundImageUploaded?: boolean;
	backgroundPosition: BackgroundPosition;
	backgroundBlur: number;
	backgroundBrightness: number;
	elements: TemplateElement[];
}, canvasWidth = 360, canvasHeight = 450, templateType: 'sharepic' | 'overlay' = 'sharepic'): SharePicTemplate {
	return {
		id: state.templateId,
		name: state.templateName,
		version: 1,
		templateType,
		canvas: {
			width: canvasWidth,
			height: canvasHeight,
			colorSetName: state.colorSet.name,
			highlightColorName: state.highlightColor.name,
			backgroundImage: state.backgroundImage,
			backgroundPositionValue: state.backgroundPosition.value,
			backgroundBlur: state.backgroundBlur,
			backgroundBrightness: state.backgroundBrightness,
		},
		elements: structuredClone(state.elements),
	};
}

export function encodeTemplateForUrl(template: SharePicTemplate): string {
	// All images should already be Supabase URLs at this point.
	// Strip any remaining data URLs as a safety fallback so they never end up in the URL.
	const shareable: SharePicTemplate = {
		...template,
		canvas: {
			...template.canvas,
			backgroundImage: template.canvas.backgroundImage?.startsWith('data:')
				? null
				: template.canvas.backgroundImage,
		},
		elements: template.elements.map(el =>
			el.type === 'image' && el.src.startsWith('data:')
				? { ...el, src: '' }
				: el
		),
	};
	return encodeURIComponent(JSON.stringify(shareable));
}

export function decodeTemplateFromUrl(): SharePicTemplate | null {
	try {
		const params = new URLSearchParams(window.location.search);
		const raw = params.get('t');
		if (!raw) return null;
		const parsed = JSON.parse(decodeURIComponent(raw));
		if (!validateTemplate(parsed)) return null;
		const template = parsed as SharePicTemplate;
		if (!template.templateType) {
			template.templateType = template.canvas.height >= 600 ? 'overlay' : 'sharepic';
		}
		return template;
	} catch {
		return null;
	}
}


export function exportTemplateAsJson(template: SharePicTemplate): void {
	const json = JSON.stringify(template, null, 2);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.download = `template-${template.id}.json`;
	link.href = url;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export function importTemplateFromFile(file: File, expectedType?: 'sharepic' | 'overlay'): Promise<SharePicTemplate> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const parsed = JSON.parse(reader.result as string);
				if (!validateTemplate(parsed)) {
					reject(new Error('Ungültiges Template-Format'));
					return;
				}
				const template = parsed as SharePicTemplate;
				// Migrate old templates without templateType: derive from canvas height
				if (!template.templateType) {
					template.templateType = template.canvas.height >= 600 ? 'overlay' : 'sharepic';
				}
				if (expectedType && template.templateType !== expectedType) {
					const label = expectedType === 'overlay' ? 'Story-Overlay' : 'SharePic';
					reject(new Error(`Falscher Template-Typ. Hier können nur ${label}-Vorlagen importiert werden.`));
					return;
				}
				resolve(template);
			} catch {
				reject(new Error('JSON konnte nicht gelesen werden'));
			}
		};
		reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden'));
		reader.readAsText(file);
	});
}

function validateTemplate(obj: unknown): boolean {
	if (!obj || typeof obj !== 'object') return false;
	const t = obj as Record<string, unknown>;
	if (typeof t.id !== 'string') return false;
	if (typeof t.name !== 'string') return false;
	if (typeof t.version !== 'number') return false;
	if (!t.canvas || typeof t.canvas !== 'object') return false;
	if (!Array.isArray(t.elements)) return false;

	const canvas = t.canvas as Record<string, unknown>;
	if (typeof canvas.colorSetName !== 'string') return false;
	if (typeof canvas.highlightColorName !== 'string') return false;

	for (const el of t.elements as unknown[]) {
		if (!el || typeof el !== 'object') return false;
		const e = el as Record<string, unknown>;
		if (typeof e.id !== 'string') return false;
		if (!['heading', 'text', 'logo', 'arrow', 'pictogram', 'image'].includes(e.type as string)) return false;
		if (typeof e.x !== 'number' || typeof e.y !== 'number') return false;
		if (typeof e.visible !== 'boolean') return false;
	}

	return true;
}

export function saveCustomTemplateToStorage(template: SharePicTemplate): SharePicTemplate {
	const existing = loadCustomTemplatesFromStorage();
	const idx = existing.findIndex(t => t.id === template.id);
	if (idx >= 0) {
		existing[idx] = template;
	} else {
		existing.push(template);
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
	return template;
}

export function loadCustomTemplatesFromStorage(): SharePicTemplate[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		const valid = parsed.filter(validateTemplate) as SharePicTemplate[];
		// Migrate old templates without templateType
		let needsSave = false;
		for (const t of valid) {
			if (!t.templateType) {
				t.templateType = t.canvas.height >= 600 ? 'overlay' : 'sharepic';
				needsSave = true;
			}
		}
		if (needsSave) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
		}
		return valid;
	} catch {
		return [];
	}
}

export function removeCustomTemplateFromStorage(templateId: string): void {
	const existing = loadCustomTemplatesFromStorage();
	const filtered = existing.filter(t => t.id !== templateId);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
