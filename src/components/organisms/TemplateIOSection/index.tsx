import { useState, useRef } from 'react';
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
import './TemplateIOSection.scss';

export function TemplateIOSection() {
	const { state, dispatch, setCustomTemplates, canvasConfig } = useSharePic();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [status, setStatus] = useState<string | null>(null);

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
		setTimeout(() => setStatus(null), 2000);
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
		setTimeout(() => setStatus(null), 3000);
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
			{status && (
				<p className={`template-io__status ${status.startsWith('Fehler') ? 'template-io__status--error' : 'template-io__status--success'}`}>
					{status}
				</p>
			)}
		</div>
	);
}
