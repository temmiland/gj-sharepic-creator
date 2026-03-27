/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { createContext, useCallback, useEffect, useContext, useState, ReactNode } from "react";
import type { ColorSet, HighlightColor, BackgroundPosition } from '@/types/design-tokens';
import { defaultTemplates } from "../constants/default-templates";
import { templateToState, loadCustomTemplatesFromStorage } from "../utils/template-io";
import type { TemplateElement } from "../types/template";
import type { SharePicTemplate } from "../types/template";
import { type CanvasConfig, SHAREPIC_CANVAS_CONFIG } from "../constants/canvas";

export interface SharePicState {
	templateId: string;
	templateName: string;
	colorSet: ColorSet;
	highlightColor: HighlightColor;
	backgroundImage: string | null;
	backgroundImageUploaded: boolean;
	backgroundPosition: BackgroundPosition;
	backgroundBlur: number;
	backgroundBrightness: number;
	elements: TemplateElement[];
	selectedElementId: string | null;
}

export type SharePicAction =
	| { type: "LOAD_TEMPLATE"; payload: SharePicState }
	| { type: "SET_TEMPLATE_NAME"; payload: string }
	| { type: "SET_COLOR_SET"; payload: ColorSet }
	| { type: "SET_HIGHLIGHT_COLOR"; payload: HighlightColor }
	| { type: "SET_BACKGROUND_IMAGE"; payload: string | null; uploaded?: boolean }
	| { type: "SET_BACKGROUND_POSITION"; payload: BackgroundPosition }
	| { type: "SET_BACKGROUND_BLUR"; payload: number }
	| { type: "SET_BACKGROUND_BRIGHTNESS"; payload: number }
	| { type: "UPDATE_ELEMENT"; payload: { id: string; changes: Partial<TemplateElement> } }
	| { type: "ADD_ELEMENT"; payload: TemplateElement }
	| { type: "REMOVE_ELEMENT"; payload: string }
	| { type: "SELECT_ELEMENT"; payload: string | null };

// eslint-disable-next-line react-refresh/only-export-components
export const sharePicReducer = (state: SharePicState, action: SharePicAction): SharePicState => {
	switch (action.type) {
		case "LOAD_TEMPLATE":
			return { ...action.payload };
		case "SET_TEMPLATE_NAME":
			return { ...state, templateName: action.payload };
		case "SET_COLOR_SET":
			return { ...state, colorSet: action.payload };
		case "SET_HIGHLIGHT_COLOR":
			return { ...state, highlightColor: action.payload };
		case "SET_BACKGROUND_IMAGE":
			return {
				...state,
				backgroundImage: action.payload,
				backgroundImageUploaded: !!action.uploaded
			};
		case "SET_BACKGROUND_POSITION":
			return { ...state, backgroundPosition: action.payload };
		case "SET_BACKGROUND_BLUR":
			return { ...state, backgroundBlur: action.payload };
		case "SET_BACKGROUND_BRIGHTNESS":
			return { ...state, backgroundBrightness: action.payload };
		case "UPDATE_ELEMENT":
			return {
				...state,
				elements: state.elements.map(el =>
					el.id === action.payload.id
						? { ...el, ...action.payload.changes } as TemplateElement
						: el
				),
			};
		case "ADD_ELEMENT":
			return { ...state, elements: [...state.elements, action.payload] };
		case "REMOVE_ELEMENT":
			return {
				...state,
				elements: state.elements.filter(el => el.id !== action.payload),
				selectedElementId: state.selectedElementId === action.payload ? null : state.selectedElementId,
			};
		case "SELECT_ELEMENT":
			return { ...state, selectedElementId: action.payload };
		default:
			return state;
	}
};

const initialState: SharePicState = templateToState(defaultTemplates[0]);

interface SharePicContextType {
	state: SharePicState;
	dispatch: (action: SharePicAction) => void;
	customTemplates: SharePicTemplate[];
	setCustomTemplates: React.Dispatch<React.SetStateAction<SharePicTemplate[]>>;
	canvasConfig: CanvasConfig;
	canUndo: boolean;
	canRedo: boolean;
	undo: () => void;
	redo: () => void;
}

const SharePicContext = createContext<SharePicContextType | undefined>(undefined);

interface History {
	past: SharePicState[];
	present: SharePicState;
	future: SharePicState[];
	lastUpdateKey: string | null;
}

export const SharePicProvider = ({ children, canvasConfig = SHAREPIC_CANVAS_CONFIG }: { children: ReactNode; canvasConfig?: CanvasConfig }) => {
	const [history, setHistory] = useState<History>({
		past: [],
		present: initialState,
		future: [],
		lastUpdateKey: null,
	});
	const [customTemplates, setCustomTemplates] = useState<SharePicTemplate[]>(() => loadCustomTemplatesFromStorage());

	const state = history.present;
	const canUndo = history.past.length > 0;
	const canRedo = history.future.length > 0;

	const dispatch = useCallback((action: SharePicAction) => {
		setHistory(h => {
			const newPresent = sharePicReducer(h.present, action);

			if (action.type === 'SELECT_ELEMENT') {
				return { ...h, present: newPresent };
			}

			if (action.type === 'LOAD_TEMPLATE') {
				return { past: [], present: newPresent, future: [], lastUpdateKey: null };
			}

			// Coalesce consecutive UPDATE_ELEMENT on the same element (drag)
			if (action.type === 'UPDATE_ELEMENT') {
				const key = `UPDATE_ELEMENT:${action.payload.id}`;
				if (key === h.lastUpdateKey) {
					return { ...h, present: newPresent, future: [] };
				}
				return {
					past: [...h.past.slice(-49), h.present],
					present: newPresent,
					future: [],
					lastUpdateKey: key,
				};
			}

			return {
				past: [...h.past.slice(-49), h.present],
				present: newPresent,
				future: [],
				lastUpdateKey: null,
			};
		});
	}, []);

	const undo = useCallback(() => {
		setHistory(h => {
			if (h.past.length === 0) return h;
			const past = h.past.slice(0, -1);
			const newPresent = h.past[h.past.length - 1];
			return { past, present: newPresent, future: [h.present, ...h.future], lastUpdateKey: null };
		});
	}, []);

	const redo = useCallback(() => {
		setHistory(h => {
			if (h.future.length === 0) return h;
			const [newPresent, ...future] = h.future;
			return { past: [...h.past, h.present], present: newPresent, future, lastUpdateKey: null };
		});
	}, []);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const tag = (e.target as HTMLElement).tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
			if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
				e.preventDefault();
				undo();
			}
			if ((e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
				(e.key === 'y' && (e.ctrlKey || e.metaKey))) {
				e.preventDefault();
				redo();
			}

			const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
			if (arrowKeys.includes(e.key)) {
				const selectedId = state.selectedElementId;
				if (!selectedId) return;
				const el = state.elements.find(el => el.id === selectedId);
				if (!el) return;
				e.preventDefault();
				const step = e.shiftKey ? 10 : 1;
				const dx = e.key === 'ArrowLeft' ? -step : e.key === 'ArrowRight' ? step : 0;
				const dy = e.key === 'ArrowUp' ? -step : e.key === 'ArrowDown' ? step : 0;
				dispatch({
					type: 'UPDATE_ELEMENT',
					payload: { id: selectedId, changes: { x: el.x + dx, y: el.y + dy } },
				});
			}
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [undo, redo, dispatch, state.selectedElementId, state.elements]);

	return (
		<SharePicContext.Provider value={{ state, dispatch, customTemplates, setCustomTemplates, canvasConfig, canUndo, canRedo, undo, redo }}>
			{children}
		</SharePicContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSharePic = (): SharePicContextType => {
	const context = useContext(SharePicContext);
	if (!context) {
		throw new Error("useSharePic must be used within a SharePicProvider");
	}
	return context;
};
