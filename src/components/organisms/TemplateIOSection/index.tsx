/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useState, useRef, useEffect } from 'react';
import { useSharePic } from '@/context/SharePicContext';
import { generateUUID } from '@/utils/uuid';
import { defaultTemplates } from '@/constants/default-templates';
import { defaultStoryTemplates } from '@/constants/default-story-templates';
import {
	stateToTemplate,
	exportTemplateAsJson,
	importTemplateFromFile,
	saveCustomTemplateToStorage,
	loadCustomTemplatesFromStorage,
	templateToState,
} from '@/utils/template-io';
import { submitTemplateForReview } from '@/utils/template-share';
import { uploadTemplateImages } from '@/utils/image-upload';
import './TemplateIOSection.scss';

export function TemplateIOSection() {
	const { state, dispatch, setCustomTemplates, canvasConfig } = useSharePic();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [submitOpen, setSubmitOpen] = useState(false);

	useEffect(() => {
		if (!status) return;
		const timer = setTimeout(() => setStatus(null), 3000);
		return () => clearTimeout(timer);
	}, [status]);
	const [submitMessage, setSubmitMessage] = useState('');
	const [submitLoading, setSubmitLoading] = useState(false);

	const handleExport = () => {
		const template = stateToTemplate(state, canvasConfig.width, canvasConfig.height, canvasConfig.transparentBackground ? 'overlay' : 'sharepic');
		exportTemplateAsJson(template);
	};

	const handleSave = () => {
		const allDefaults = [...defaultTemplates, ...defaultStoryTemplates];
		const isDefault = allDefaults.some(t => t.id === state.templateId);
		const effectiveState = isDefault
			? { ...state, templateId: generateUUID() }
			: state;
		const template = stateToTemplate(effectiveState, canvasConfig.width, canvasConfig.height, canvasConfig.transparentBackground ? 'overlay' : 'sharepic');
		saveCustomTemplateToStorage(template);
		if (isDefault) {
			dispatch({ type: 'LOAD_TEMPLATE', payload: effectiveState });
		}
		setCustomTemplates(loadCustomTemplatesFromStorage());
		setStatus('Template gespeichert!');
	};

	const handleSubmit = async () => {
		setSubmitLoading(true);
		try {
			const template = stateToTemplate(state, canvasConfig.width, canvasConfig.height, canvasConfig.transparentBackground ? 'overlay' : 'sharepic');
			await uploadTemplateImages(template, 1200, 0.75);
			await submitTemplateForReview(template, submitMessage.trim() || undefined);
			setSubmitOpen(false);
			setSubmitMessage('');
			setStatus('Danke! Template eingereicht.');
		} catch {
			setStatus('Fehler: Einreichen fehlgeschlagen.');
		} finally {
			setSubmitLoading(false);
		}
	};

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			const template = await importTemplateFromFile(file);
			const newState = templateToState(template);
			dispatch({ type: 'LOAD_TEMPLATE', payload: newState });
			saveCustomTemplateToStorage(template);
			setCustomTemplates(loadCustomTemplatesFromStorage());
			setStatus('Template importiert!');
		} catch (err) {
			setStatus(`Fehler: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
		}
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	return (
		<div className="template-io">
			<label className="template-io__label">
				Template-Name
				<input
					type="text"
					value={state.templateName}
					onChange={e => dispatch({ type: 'SET_TEMPLATE_NAME', payload: e.target.value })}
					className="template-io__name-input"
				/>
			</label>
			<div className="template-io__actions">
				<button
					type="button"
					onClick={handleSave}
					className="template-io__btn template-io__btn--save"
				>
					Speichern
				</button>
				<button
					type="button"
					onClick={handleExport}
					className="template-io__btn template-io__btn--export"
				>
					Als JSON exportieren
				</button>
			</div>
			<label className="template-io__import-label">
				JSON importieren
				<input
					ref={fileInputRef}
					type="file"
					accept=".json"
					onChange={handleImport}
					className="template-io__import-input"
				/>
			</label>

			{!submitOpen ? (
				<button
					type="button"
					className="template-io__btn template-io__btn--submit"
					onClick={() => setSubmitOpen(true)}
				>
					Zur Aufnahme einreichen
				</button>
			) : (
				<div className="template-io__submit-form">
					<p className="template-io__submit-hint">
						Du kannst optional eine kurze Notiz hinterlassen, z.B. wofür das Template gedacht ist.
					</p>
					<textarea
						className="template-io__submit-message"
						placeholder="Notiz (optional)"
						value={submitMessage}
						onChange={e => setSubmitMessage(e.target.value)}
						rows={3}
					/>
					<div className="template-io__submit-actions">
						<button
							type="button"
							className="template-io__btn template-io__btn--submit"
							onClick={handleSubmit}
							disabled={submitLoading}
						>
							{submitLoading ? 'Wird eingereicht…' : 'Einreichen'}
						</button>
						<button
							type="button"
							className="template-io__btn template-io__btn--cancel"
							onClick={() => { setSubmitOpen(false); setSubmitMessage(''); }}
							disabled={submitLoading}
						>
							Abbrechen
						</button>
					</div>
				</div>
			)}

			{status && (
				<p className={`template-io__status ${status.startsWith('Fehler') ? 'template-io__status--error' : 'template-io__status--success'}`}>
					{status}
				</p>
			)}
		</div>
	);
}
