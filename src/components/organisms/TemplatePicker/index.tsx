/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { useSharePic } from '@/context/SharePicContext';
import { defaultTemplates } from '@/constants/default-templates';
import { loadCustomTemplatesFromStorage, removeCustomTemplateFromStorage, saveCustomTemplateToStorage, importTemplateFromFile, templateToState, exportTemplateAsJson, encodeTemplateForUrl } from '@/utils/template-io';
import { colorSets, highlightColors } from '@/constants/colors';
import { pictograms } from '@/constants/pictograms';
import type { SharePicTemplate, TemplateElement, HeadingElement, TextElement, LogoElement, ArrowElement, PictogramElement } from '@/types/template';
import './TemplatePicker.scss';

export function TemplatePicker({ builtinTemplates = defaultTemplates }: { builtinTemplates?: SharePicTemplate[] }) {
	const { state, dispatch, customTemplates, setCustomTemplates, canvasConfig } = useSharePic();
	const importRef = useRef<HTMLInputElement>(null);
	const [importError, setImportError] = useState<string | null>(null);
	const [copiedId, setCopiedId] = useState<string | null>(null);

	const currentType: 'sharepic' | 'overlay' = canvasConfig.transparentBackground ? 'overlay' : 'sharepic';

	const customIds = new Set(customTemplates.map(t => t.id));
	const relevantCustom = customTemplates.filter(t => t.templateType === currentType);
	const allTemplates = [...builtinTemplates.filter(t => !customIds.has(t.id)), ...relevantCustom];

	const handleSelect = (template: SharePicTemplate) => {
		const newState = templateToState(template);
		dispatch({ type: 'LOAD_TEMPLATE', payload: newState });
	};

	const handleDeleteCustom = (e: React.PointerEvent, templateId: string) => {
		e.stopPropagation();
		removeCustomTemplateFromStorage(templateId);
		setCustomTemplates(loadCustomTemplatesFromStorage());
		if (state.templateId === templateId) {
			handleSelect(builtinTemplates[0]);
		}
	};

	const handleDownloadCustom = (e: React.PointerEvent, template: SharePicTemplate) => {
		e.stopPropagation();
		exportTemplateAsJson(template);
	};

	const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setImportError(null);
		try {
			const template = await importTemplateFromFile(file, currentType);
			saveCustomTemplateToStorage(template);
			setCustomTemplates(loadCustomTemplatesFromStorage());
			const newState = templateToState(template);
			dispatch({ type: 'LOAD_TEMPLATE', payload: newState });
		} catch (err) {
			setImportError(err instanceof Error ? err.message : 'Import fehlgeschlagen');
			setTimeout(() => setImportError(null), 5000);
		}
		if (importRef.current) importRef.current.value = '';
	};

	const handleShareLink = (e: React.PointerEvent, template: SharePicTemplate) => {
		e.stopPropagation();
		const encoded = encodeTemplateForUrl(template);
		const url = `${window.location.origin}${window.location.pathname}?t=${encoded}`;
		navigator.clipboard.writeText(url).then(() => {
			setCopiedId(template.id);
			setTimeout(() => setCopiedId(null), 2000);
		});
	};

	const isCustom = (id: string) => customIds.has(id);

	return (
		<div className="template-picker">
			<div className="template-picker-header">
				<h2>Vorlage</h2>
				<div className="template-picker-actions">
					<Link to="/anleitung" className="template-picker-guide" title="Anleitung lesen">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
							<path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
						</svg>
						Hilfe
					</Link>
					<label className="template-picker-import" title="Template aus JSON importieren">
					<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M7 9V1M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
						<path d="M1 10v1.5A1.5 1.5 0 002.5 13h9a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
					</svg>
					JSON
					<input
						ref={importRef}
						type="file"
						accept=".json"
						onChange={handleImport}
						className="template-picker-file-input"
					/>
				</label>
				</div>
			</div>
			{importError && <p className="template-picker-error" role="alert">{importError}</p>}
			<div className="template-picker-grid">
				{allTemplates.map(template => (
					<button
						key={template.id}
						type="button"
						className={`template-card ${state.templateId === template.id ? 'template-card--active' : ''}`}
						onClick={() => handleSelect(template)}
					>
						<TemplatePreview template={template} />
						<span className="template-card-name">{template.name}</span>
						{isCustom(template.id) && (
							<>
								<span
									className="template-card-share"
									onPointerDown={e => { e.stopPropagation(); handleShareLink(e, template); }}
									onClick={e => e.stopPropagation()}
									title="Link kopieren"
								>
									{copiedId === template.id ? '✓' : (
										<svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M9 1h4v4M13 1l-6 6M6 3H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									)}
								</span>
								<span
									className="template-card-download"
									onPointerDown={e => { e.stopPropagation(); handleDownloadCustom(e, template); }}
									onClick={e => e.stopPropagation()}
									title="Template herunterladen"
								>
									<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 4 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 10v1.5A1.5 1.5 0 002.5 13h9a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
								</span>
								<span
									className="template-card-delete"
									onPointerDown={e => { e.stopPropagation(); handleDeleteCustom(e, template.id); }}
									onClick={e => e.stopPropagation()}
									title="Template löschen"
								>
									<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
								</span>
							</>
						)}
					</button>
				))}
			</div>
		</div>
	);
}

function TemplatePreview({ template }: { template: SharePicTemplate }) {
	const canvasW = template.canvas.width;
	const canvasH = template.canvas.height;

	const bgColorSet = colorSets.find(c => c.name === template.canvas.colorSetName);
	const bg = bgColorSet?.backgroundColor ?? '#ffffff';
	const accentColor = bgColorSet?.accentColor ?? '#000000';
	const hlColor = highlightColors.find(c => c.name === template.canvas.highlightColorName);
	const isDark = bg === '#000000';
	const textColor = isDark || bg.startsWith('linear-gradient') ? '#ffffff' : '#000000';
	const headingBg = hlColor?.backgroundColor ?? '#c7ff7a';
	// Non-highlighted heading lines match SharePicHeading: white bg unless colorSet is White
	const plainLineBg = template.canvas.colorSetName === 'White' ? '#000000' : '#ffffff';

	return (
		<div className="template-preview" style={{ background: bg, aspectRatio: `${canvasW} / ${canvasH}` }}>
			{template.canvas.backgroundImage && (
				<img
					src={template.canvas.backgroundImage}
					alt=""
					className="template-preview-bg"
					style={{
						objectPosition: template.canvas.backgroundPositionValue,
						filter: `blur(${template.canvas.backgroundBlur * 0.3}px) brightness(${template.canvas.backgroundBrightness}%)`,
					}}
					draggable={false}
				/>
			)}
			{template.elements.filter(e => e.visible).map(el => (
				<PreviewElement
					key={el.id}
					element={el}
					canvasW={canvasW}
					canvasH={canvasH}
					accentColor={accentColor}
					textColor={textColor}
					headingBg={headingBg}
					plainLineBg={plainLineBg}
					isDark={isDark}
				/>
			))}
		</div>
	);
}

function PreviewElement({ element, canvasW, canvasH, accentColor, textColor, headingBg, plainLineBg, isDark }: {
	element: TemplateElement;
	canvasW: number;
	canvasH: number;
	accentColor: string;
	textColor: string;
	headingBg: string;
	plainLineBg: string;
	isDark: boolean;
}) {
	const pctX = (element.x / canvasW) * 100;
	const pctY = (element.y / canvasH) * 100;

	switch (element.type) {
		case 'heading':
			return <PreviewHeading el={element} pctX={pctX} pctY={pctY} canvasW={canvasW} headingBg={headingBg} plainLineBg={plainLineBg} />;
		case 'text':
			return <PreviewText el={element} pctX={pctX} pctY={pctY} canvasW={canvasW} textColor={textColor} />;
		case 'logo':
			return <PreviewLogo el={element} pctX={pctX} pctY={pctY} accentColor={accentColor} />;
		case 'arrow':
			return <PreviewArrow el={element} pctX={pctX} pctY={pctY} canvasW={canvasW} accentColor={accentColor} />;
		case 'pictogram':
			return <PreviewPictogram el={element} pctX={pctX} pctY={pctY} canvasW={canvasW} isDark={isDark} />;
		default:
			return null;
	}
}

function PreviewHeading({ el, pctX, pctY, canvasW, headingBg, plainLineBg }: { el: HeadingElement; pctX: number; pctY: number; canvasW: number; headingBg: string; plainLineBg: string }) {
	const widthPct = (el.width / canvasW) * 100;
	// padding-top % is relative to the containing block's WIDTH.
	// .prev-heading width = (el.width / canvasW) * preview_width.
	// We want visual height = (fontSize * 10 / CANVAS_H) * preview_height
	//   = (fontSize * 10 / CANVAS_H) * (CANVAS_H / canvasW) * preview_width
	//   = (fontSize * 10 / canvasW) * preview_width.
	// So: padding-top % = (fontSize * 10 / canvasW) / (el.width / canvasW) * 100
	//                    = (fontSize * 10 / el.width) * 100
	const lineHeightPct = el.width > 0 ? (el.fontSize * 10 / el.width) * 100 : 0;

	return (
		<div
			className="prev-heading"
			style={{ left: `${pctX}%`, top: `${pctY}%`, width: `${widthPct}%` }}
		>
			{el.content.filter(l => l !== '').map((line, i) => {
				const isHighlight = line.startsWith('*');
				const text = line.replace('*', '');
				const charRatio = Math.min(1, text.length / 18);
				return (
					<div
						key={`${i}-${line}`}
						className="prev-heading-line"
						style={{
							height: 0,
							paddingTop: `${lineHeightPct}%`,
							width: `${35 + charRatio * 65}%`,
							backgroundColor: isHighlight ? headingBg : plainLineBg,
						}}
					/>
				);
			})}
		</div>
	);
}

function PreviewText({ el, pctX, pctY, canvasW, textColor }: { el: TextElement; pctX: number; pctY: number; canvasW: number; textColor: string }) {
	const widthPct = (el.width / canvasW) * 100;
	const totalChars = el.content.join(' ').length;
	const lineCount = Math.min(6, Math.max(2, Math.ceil(totalChars / 50)));

	return (
		<div
			className="prev-text"
			style={{ left: `${pctX}%`, top: `${pctY}%`, width: `${widthPct}%` }}
		>
			{Array.from({ length: lineCount }, (_, i) => (
				<div
					key={i}
					className="prev-text-line"
					style={{
						backgroundColor: textColor,
						width: i === lineCount - 1 ? '55%' : '100%',
					}}
				/>
			))}
		</div>
	);
}

function PreviewLogo({ el, pctX, pctY, accentColor }: { el: LogoElement; pctX: number; pctY: number; accentColor: string }) {
	return (
		<div
			className="prev-logo"
			style={{ left: `${pctX}%`, top: `${pctY}%`, color: accentColor, transform: 'rotate(-13deg)', transformOrigin: 'top left' }}
		>
			<span className="prev-logo-gj">GJ</span>
			{el.localGroup && <span className="prev-logo-og">{el.localGroup}</span>}
		</div>
	);
}

function PreviewArrow({ el, pctX, pctY, canvasW, accentColor }: { el: ArrowElement; pctX: number; pctY: number; canvasW: number; accentColor: string }) {
	const sizePct = (el.size / canvasW) * 100;
	return (
		<svg
			className="prev-arrow"
			style={{ left: `${pctX}%`, top: `${pctY}%`, width: `${sizePct}%` }}
			viewBox="0 0 160 160"
		>
			<polygon
				points="91.901 49.6605 87.777 54.3235 112.216 75.9385 35.955 75.9385 35.955 82.1635 112.335 82.1635 91.063 106.2145 95.727 110.3395 120.646 82.1635 120.976 82.1635 120.976 81.7925 124.045 78.3215 123.804 78.1085 123.919 77.9785 91.901 49.6605"
				fill={accentColor}
			/>
		</svg>
	);
}

function PreviewPictogram({ el, pctX, pctY, canvasW, isDark }: { el: PictogramElement; pctX: number; pctY: number; canvasW: number; isDark: boolean }) {
	const pict = pictograms.find(p => p.name === el.pictogramName);
	if (!pict) return null;
	const sizePct = (el.size * 10 / canvasW) * 100;

	return (
		<img
			className="prev-pictogram"
			src={pict.path}
			alt={pict.name}
			style={{
				left: `${pctX}%`,
				top: `${pctY}%`,
				width: `${sizePct}%`,
				filter: isDark ? 'invert()' : '',
			}}
			draggable={false}
		/>
	);
}
