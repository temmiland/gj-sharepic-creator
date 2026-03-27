/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useRef, useEffect, useState } from 'react';
import { domToPng } from 'modern-screenshot';
import { Button } from '@/components/atoms/Button';
import { TemplateRenderer } from '@/components/organisms/TemplateRenderer';
import { TemplateEditor, AddElementButton } from '@/components/organisms/TemplateEditor';
import { TemplatePicker } from '@/components/organisms/TemplatePicker';
import { useSharePic } from '@/context/SharePicContext';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary';
import { defaultStoryTemplates } from '@/constants/default-story-templates';
import { templateToState, decodeTemplateFromUrl, saveCustomTemplateToStorage, loadCustomTemplatesFromStorage, stateToTemplate } from '@/utils/template-io';
import { useDefaultTemplates } from '@/hooks/useDefaultTemplates';
import { uploadTemplateImages } from '@/utils/image-upload';
import { saveTemplateToSupabase, loadTemplateFromSupabase } from '@/utils/template-share';
import { copyToClipboard } from '@/utils/clipboard';
import './StoryOverlayGenerator.scss';

function useCanvasScale(containerRef: React.RefObject<HTMLDivElement | null>, canvasWidth: number) {
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new ResizeObserver(([entry]) => {
			const availableWidth = entry.contentRect.width;
			setScale(Math.min(1, availableWidth / canvasWidth));
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [containerRef, canvasWidth]);

	return scale;
}

export function StoryOverlayGenerator() {
	const { canUndo, canRedo, undo, redo, canvasConfig, dispatch, setCustomTemplates, state } = useSharePic();
	const builtinTemplates = useDefaultTemplates('overlay', defaultStoryTemplates);
	const [originalName, setOriginalName] = useState(state.templateName);
	useEffect(() => { setOriginalName(state.templateName); }, [state.templateId]);
	const canShare = state.templateName.trim() !== '' && state.templateName !== originalName;

	// Load template from shared URL on first mount, otherwise load first story template
	useEffect(() => {
		async function loadFromUrl() {
			const params = new URLSearchParams(window.location.search);

			// New: load by Supabase ID
			const id = params.get('id');
			if (id) {
				const template = await loadTemplateFromSupabase(id);
				if (template && template.templateType === 'overlay') {
					const saved = saveCustomTemplateToStorage({ ...template, id });
					setCustomTemplates(loadCustomTemplatesFromStorage());
					dispatch({ type: 'LOAD_TEMPLATE', payload: templateToState(saved) });
					window.history.replaceState(null, '', window.location.pathname);
					return;
				}
			}

			// Legacy: load from ?t= encoded URL
			const urlTemplate = decodeTemplateFromUrl();
			if (urlTemplate && urlTemplate.templateType === 'overlay') {
				const saved = saveCustomTemplateToStorage(urlTemplate);
				setCustomTemplates(loadCustomTemplatesFromStorage());
				dispatch({ type: 'LOAD_TEMPLATE', payload: templateToState(saved) });
				window.history.replaceState(null, '', window.location.pathname);
				return;
			}

			// Default: load first story template
			if (defaultStoryTemplates.length > 0) {
				const initialState = templateToState(defaultStoryTemplates[0]);
				dispatch({ type: 'LOAD_TEMPLATE', payload: initialState });
			}
		}
		loadFromUrl();
	}, [dispatch, setCustomTemplates]);

	const canvasWrapRef = useRef<HTMLDivElement>(null);
	const scale = useCanvasScale(canvasWrapRef, canvasConfig.width);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [linkCopied, setLinkCopied] = useState(false);
	const [shareLoading, setShareLoading] = useState(false);
	const [shareError, setShareError] = useState<string | null>(null);
	const showDownload = previewSrc !== null;

	const handleDownload = async () => {
		if (!previewSrc) return;
		const link = document.createElement('a');
		link.download = `gj-story-overlay-${new Date().toISOString()}.png`;
		link.href = previewSrc;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleShare = async () => {
		setShareLoading(true);
		setShareError(null);
		try {
			const template = stateToTemplate(state, canvasConfig.width, canvasConfig.height, 'overlay');

			const urlPromise = uploadTemplateImages(template)
				.then(() => saveTemplateToSupabase(template))
				.then(id => `${window.location.origin}${window.location.pathname}?id=${id}`);

			if (typeof ClipboardItem !== 'undefined') {
				await navigator.clipboard.write([
					new ClipboardItem({ 'text/plain': urlPromise.then(url => new Blob([url], { type: 'text/plain' })) }),
				]);
			} else {
				await copyToClipboard(await urlPromise);
			}

			setLinkCopied(true);
			setTimeout(() => setLinkCopied(false), 2000);
		} catch {
			setShareError('Link konnte nicht erstellt werden.');
		} finally {
			setShareLoading(false);
		}
	};

	const handlePreview = async () => {
		setPreviewError(null);
		const node = document.getElementById('sharepic-download');
		if (!node) return;
		try {
			const exportScale = 3;
			const width = node.offsetWidth;
			const height = node.offsetHeight;

			const contentDataUrl = await domToPng(node, {
				width: width * exportScale,
				height: height * exportScale,
				style: {
					transform: `scale(${exportScale})`,
					transformOrigin: 'top left',
					width: `${width}px`,
					height: `${height}px`,
				}
			});

			setPreviewSrc(contentDataUrl);
		} catch (err) {
			setPreviewError(err instanceof Error ? err.message : 'Unbekannter Fehler');
		}
	};

	return (
		<>
			<div className="inner">
				<div className='container sticky'>
					<div ref={canvasWrapRef} className="canvas-wrap">
						<div className='sharepic-container' style={{ zoom: scale }}>
							<ErrorBoundary>
								<TemplateRenderer />
							</ErrorBoundary>
						</div>
					</div>
					<div className="undo-redo-bar">
						<button
							type="button"
							className="undo-redo-btn"
							onClick={undo}
							disabled={!canUndo}
							title="Rückgängig (Strg+Z)"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 14L4 9l5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 9h11a5 5 0 010 10h-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
							Rückgängig
						</button>
						<button
							type="button"
							className="undo-redo-btn"
							onClick={redo}
							disabled={!canRedo}
							title="Wiederholen (Strg+Y)"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 14l5-5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M20 9H9a5 5 0 000 10h1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
							Wiederholen
						</button>
					</div>
					<AddElementButton />
					<input
						type="text"
						className="template-name-input"
						value={state.templateName}
						onChange={e => dispatch({ type: 'SET_TEMPLATE_NAME', payload: e.target.value })}
						placeholder="Vorlagenname"
					/>
					<div className="action-bar">
						<Button onClick={handlePreview}>Story-Overlay erstellen</Button>
						<Button onClick={handleShare} disabled={shareLoading || !canShare}>
							{linkCopied ? '✓ Kopiert' : shareLoading ? 'Wird hochgeladen…' : 'Teilen'}
						</Button>
					</div>
					{shareError && (
						<p role="alert" className="preview-error">{shareError}</p>
					)}
					{previewError && (
						<p role="alert" className="preview-error">
							Fehler beim Erstellen: {previewError}
						</p>
					)}
					<img id='final-result' src={previewSrc ?? undefined} className={previewSrc ? 'final-result' : undefined} />
					<div id='final-download' className={`final-download${showDownload ? ' final-download--visible' : ''}`}>
						<Button onClick={handleDownload}>Herunterladen</Button>
					</div>
				</div>

				<div className='container'>
					<TemplatePicker builtinTemplates={builtinTemplates} />
					<TemplateEditor />
				</div>
			</div>
		</>
	);
}
