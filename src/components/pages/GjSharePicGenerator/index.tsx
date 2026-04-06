/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useRef, useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { domToPng } from 'modern-screenshot';
import { Button } from '@/components/atoms/Button';
import { TemplateRenderer } from '@/components/organisms/TemplateRenderer';
import { TemplateEditor, AddElementButton } from '@/components/organisms/TemplateEditor';
import { TemplatePicker } from '@/components/organisms/TemplatePicker';
import { useSharePic } from '@/context/SharePicContext';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary';
import { templateToState, decodeTemplateFromUrl, saveCustomTemplateToStorage, loadCustomTemplatesFromStorage, stateToTemplate } from '@/utils/template-io';
import { uploadTemplateImages } from '@/utils/image-upload';
import { saveTemplateToSupabase, loadTemplateFromSupabase } from '@/utils/template-share';
import { copyToClipboard } from '@/utils/clipboard';
import { useDefaultTemplates } from '@/hooks/useDefaultTemplates';
import { defaultTemplates } from '@/constants/default-templates';
import './GjSharePicGenerator.scss';

function useCanvasScale(containerRef: React.RefObject<HTMLDivElement | null>) {
	const [scale, setScale] = useState(1);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const observer = new ResizeObserver(([entry]) => {
			const availableWidth = entry.contentRect.width;
			setScale(Math.min(1, availableWidth / 360));
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, [containerRef]);

	return scale;
}

export function GjSharePicGenerator() {
	const { canUndo, canRedo, undo, redo, dispatch, setCustomTemplates, state, canvasConfig } = useSharePic();
	const builtinTemplates = useDefaultTemplates('sharepic', defaultTemplates);
	const canvasWrapRef = useRef<HTMLDivElement>(null);
	const scale = useCanvasScale(canvasWrapRef);
	const [originalName, setOriginalName] = useState(state.templateName);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => { setOriginalName(state.templateName); }, [state.templateId]);
	const canShare = state.templateName.trim() !== '' && state.templateName !== originalName;
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [previewSrc, setPreviewSrc] = useState<string | null>(null);
	const [linkCopied, setLinkCopied] = useState(false);
	const [shareLoading, setShareLoading] = useState(false);
	const [shareError, setShareError] = useState<string | null>(null);
	const showDownload = previewSrc !== null;
	const [isPopup, setIsPopup] = useState(false);
	const [popupEditing, setPopupEditing] = useState(false);
	const [popupScale, setPopupScale] = useState(1);

	const togglePopup = useCallback(() => {
		setIsPopup(v => !v);
		setPopupEditing(false);
	}, []);

	const computePopupScale = useCallback(() => {
		const maxW = window.innerWidth * 0.9;
		const maxH = window.innerHeight * 0.9;
		setPopupScale(Math.min(maxW / canvasConfig.width, maxH / canvasConfig.height));
	}, [canvasConfig.width, canvasConfig.height]);

	useEffect(() => {
		if (!isPopup) return;
		computePopupScale();
		const keyHandler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsPopup(false); };
		document.addEventListener('keydown', keyHandler);
		window.addEventListener('resize', computePopupScale);
		return () => {
			document.removeEventListener('keydown', keyHandler);
			window.removeEventListener('resize', computePopupScale);
		};
	}, [isPopup, computePopupScale]);

	// Load template from shared URL on first mount
	useEffect(() => {
		async function loadFromUrl() {
			const params = new URLSearchParams(window.location.search);

			// New: load by Supabase ID
			const id = params.get('id');
			if (id) {
				const template = await loadTemplateFromSupabase(id);
				if (template && template.templateType === 'sharepic') {
					const saved = saveCustomTemplateToStorage({ ...template, id });
					setCustomTemplates(loadCustomTemplatesFromStorage());
					dispatch({ type: 'LOAD_TEMPLATE', payload: templateToState(saved) });
					window.history.replaceState(null, '', window.location.pathname);
					return;
				}
			}

			// Legacy: load from ?t= encoded URL
			const template = decodeTemplateFromUrl();
			if (template && template.templateType === 'sharepic') {
				const saved = saveCustomTemplateToStorage(template);
				setCustomTemplates(loadCustomTemplatesFromStorage());
				dispatch({ type: 'LOAD_TEMPLATE', payload: templateToState(saved) });
				window.history.replaceState(null, '', window.location.pathname);
			}
		}
		loadFromUrl();
	}, [dispatch, setCustomTemplates]);

	const handleDownload = async () => {
		if (!previewSrc) return;
		const link = document.createElement('a');
		link.download = `gj-sharepic-${new Date().toISOString()}.png`;
		link.href = previewSrc;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleShare = async () => {
		setShareLoading(true);
		setShareError(null);
		try {
			const template = stateToTemplate(state, canvasConfig.width, canvasConfig.height, 'sharepic');

			// Build the URL asynchronously, but kick off the clipboard write synchronously
			// so Safari's user-gesture context is still active.
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
			const scale = 3;
			const width = node.offsetWidth;
			const height = node.offsetHeight;

			const contentDataUrl = await domToPng(node, {
				width: width * scale,
				height: height * scale,
				style: {
					transform: `scale(${scale})`,
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
					{/* Outer div fills parent width so ResizeObserver can measure available space */}
					<div ref={canvasWrapRef} className="canvas-wrap">
						<div className="sharepic-popup-trigger">
							{/* CSS zoom shrinks the layout box together with the visual size — unlike transform:scale
							    which keeps the full layout box, causing the canvas hit area to extend over buttons
							    below it on iOS Safari and swallowing their taps. */}
							<div className='sharepic-container' style={{ zoom: scale }}>
								<ErrorBoundary>
									<TemplateRenderer />
								</ErrorBoundary>
							</div>
							<button
								type="button"
								className="fullscreen-btn"
								onClick={togglePopup}
								title="Vergrößern"
							>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 3H5a2 2 0 00-2 2v3M21 8V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3M16 21h3a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
							</button>
						</div>
						{isPopup && createPortal(
							<div className="canvas-popup-overlay" onPointerDown={togglePopup}>
								<div className="canvas-popup-inner" onPointerDown={e => e.stopPropagation()}>
									<div style={{ position: 'relative' }}>
										<div className='sharepic-container' style={{ zoom: popupScale }}>
											<ErrorBoundary>
												<TemplateRenderer />
											</ErrorBoundary>
										</div>
										{!popupEditing && (
											<div
												style={{ position: 'absolute', inset: 0, cursor: 'default' }}
												onPointerDown={e => e.stopPropagation()}
											/>
										)}
									</div>
									<div className="canvas-popup-toolbar">
										<button
											type="button"
											className={`canvas-popup-edit-btn${popupEditing ? ' canvas-popup-edit-btn--active' : ''}`}
											onClick={() => {
												setPopupEditing(v => {
													if (v) dispatch({ type: 'SELECT_ELEMENT', payload: null });
													return !v;
												});
											}}
											title={popupEditing ? 'Bearbeitung deaktivieren' : 'Bearbeitung aktivieren'}
										>
											<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/></svg>
											{popupEditing ? 'Bearbeitung aktiv' : 'Bearbeiten'}
										</button>
										<button
											type="button"
											className="fullscreen-btn"
											onClick={togglePopup}
											title="Schließen"
										>
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
										</button>
									</div>
								</div>
							</div>,
							document.body
						)}
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
					<br></br>
					<input
						type="text"
						className="template-name-input"
						value={state.templateName}
						onChange={e => dispatch({ type: 'SET_TEMPLATE_NAME', payload: e.target.value })}
						placeholder="Vorlagenname"
					/>
					<div className="action-bar">
						<Button onClick={handlePreview}>SharePic erstellen</Button>
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
