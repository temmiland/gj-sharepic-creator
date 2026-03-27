import { useRef, useEffect } from 'react';
import type { ColorSet } from '@/types/design-tokens';
import { useSharePic } from '@/context/SharePicContext';
import { SharePicCanvas } from '@/components/organisms/SharePicCanvas';
import { SharePicHeading } from '@/components/molecules/SharePicHeading';
import { SharePicText } from '@/components/molecules/SharePicText';
import { SharePicLogo } from '@/components/atoms/SharePicLogo';
import { SharePicArrow } from '@/components/atoms/SharePicArrow';
import { pictograms } from '@/constants/pictograms';
import { getElementSize } from '@/utils/element-size';
import type { TemplateElement, HeadingElement, TextElement, LogoElement, ArrowElement, PictogramElement, ImageElement } from '@/types/template';
import './TemplateRenderer.scss';

export function TemplateRenderer() {
	const { state, dispatch } = useSharePic();

	useEffect(() => {
		const handler = (e: PointerEvent) => {
			const canvas = document.getElementById('sharepic-download');
			if (canvas && !canvas.contains(e.target as Node)) {
				dispatch({ type: 'SELECT_ELEMENT', payload: null });
			}
		};
		document.addEventListener('pointerdown', handler);
		return () => document.removeEventListener('pointerdown', handler);
	}, [dispatch]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key !== 'Delete' && e.key !== 'Backspace') return;
			if (!state.selectedElementId) return;
			const tag = (e.target as HTMLElement).tagName;
			if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
			dispatch({ type: 'REMOVE_ELEMENT', payload: state.selectedElementId });
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [state.selectedElementId, dispatch]);

	return (
		<SharePicCanvas
			backgroundImageUploaded={state.backgroundImageUploaded}
			backgroundImage={state.backgroundImage}
			backgroundPosition={state.backgroundPosition}
			backgroundBlur={state.backgroundBlur}
			backgroundBrightness={state.backgroundBrightness}
			colorSet={state.colorSet}
			handleColorSet={(colorSet: ColorSet) => dispatch({ type: 'SET_COLOR_SET', payload: colorSet })}
		>
			{state.elements.map(element => {
				if (!element.visible) return null;
				const isSelected = state.selectedElementId === element.id;
				return (
					<DraggableElement key={element.id} element={element} selected={isSelected}>
						<ElementRenderer element={element} />
					</DraggableElement>
				);
			})}
		</SharePicCanvas>
	);
}

function ResizeHandle({ onPointerDown }: { onPointerDown: (e: React.PointerEvent) => void }) {
	return (
		<div
			className="resize-handle"
			onPointerDown={onPointerDown}
		>
			<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
				<path d="M2 9L9 2" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
				<path d="M5 9L9 5" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
				<path d="M8 9L9 8" stroke="#555" strokeWidth="1.2" strokeLinecap="round"/>
			</svg>
		</div>
	);
}

function CenterButtons({ element }: { element: TemplateElement }) {
	const { dispatch, canvasConfig } = useSharePic();

	const centerH = (e: React.PointerEvent) => {
		e.stopPropagation();
		const { w } = getElementSize(element);
		dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, changes: { x: Math.round((canvasConfig.width - w) / 2) } } });
	};

	const centerV = (e: React.PointerEvent) => {
		e.stopPropagation();
		const { h } = getElementSize(element);
		dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, changes: { y: Math.round((canvasConfig.height - h) / 2) } } });
	};

	return (
		<>
			<div className="center-button center-button--h" onPointerDown={centerH} title="Horizontal zentrieren">↔</div>
			<div className="center-button center-button--v" onPointerDown={centerV} title="Vertikal zentrieren">↕</div>
		</>
	);
}

function EditButton({ elementId }: { elementId: string }) {
	const handleClick = (e: React.PointerEvent) => {
		e.stopPropagation();
		const editorEl = document.querySelector(`[data-element-editor="${elementId}"]`);
		if (editorEl) {
			// Open the element editor itself (now a React-controlled accordion)
			editorEl.dispatchEvent(new CustomEvent('hdg-details-open'));
			// Open any collapsed ancestor accordion panels (hdg-details or element-editor)
			let parent = editorEl.parentElement;
			while (parent) {
				if (parent.classList.contains('hdg-details') || parent.classList.contains('element-editor')) {
					parent.dispatchEvent(new CustomEvent('hdg-details-open'));
				}
				parent = parent.parentElement;
			}
			editorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
			const textarea = editorEl.querySelector('textarea');
			if (textarea) {
				setTimeout(() => textarea.focus(), 400);
			}
		}
	};

	return (
		<div
			className="edit-button"
			onPointerDown={handleClick}
		>
			<svg width="12" height="12" viewBox="0 0 16 16" fill="none">
				<path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" stroke="#555" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
			</svg>
		</div>
	);
}

function getContrastOutlineColor(bg: string): string {
	if (bg.startsWith('linear-gradient')) return 'rgba(255,255,255,0.9)';
	const hex = bg.replace('#', '');
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.6 ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.9)';
}

function getCanvasScale(canvasWidth: number): number {
	const canvas = document.getElementById('sharepic-download');
	if (!canvas) return 1;
	const rect = canvas.getBoundingClientRect();
	return rect.width / canvasWidth;
}

function DraggableElement({ element, children, selected }: { element: TemplateElement; children: React.ReactNode; selected: boolean }) {
	const { state, dispatch, canvasConfig } = useSharePic();
	const wrapperRef = useRef<HTMLDivElement>(null);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault();
		dispatch({ type: 'SELECT_ELEMENT', payload: element.id });

		const scale = getCanvasScale(canvasConfig.width);
		const startX = e.clientX;
		const startY = e.clientY;
		const startPosX = element.x;
		const startPosY = element.y;

		const onMove = (ev: PointerEvent) => {
			const dx = (ev.clientX - startX) / scale;
			const dy = (ev.clientY - startY) / scale;
			dispatch({
				type: 'UPDATE_ELEMENT',
				payload: {
					id: element.id,
					changes: { x: Math.round(startPosX + dx), y: Math.round(startPosY + dy) },
				},
			});
		};

		const onUp = () => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);
		};

		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	};

	const handleResizeDown = (e: React.PointerEvent) => {
		if (element.type !== 'pictogram' && element.type !== 'image') return;
		e.preventDefault();
		e.stopPropagation();

		const scale = getCanvasScale(canvasConfig.width);
		const startX = e.clientX;
		const startY = e.clientY;

		if (element.type === 'pictogram') {
			const startSize = (element as PictogramElement).size;
			const onMove = (ev: PointerEvent) => {
				const dx = (ev.clientX - startX) / scale;
				const dy = (ev.clientY - startY) / scale;
				const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
				dispatch({
					type: 'UPDATE_ELEMENT',
					payload: { id: element.id, changes: { size: Math.max(2, startSize + delta / 16) } },
				});
			};
			const onUp = () => {
				window.removeEventListener('pointermove', onMove);
				window.removeEventListener('pointerup', onUp);
			};
			window.addEventListener('pointermove', onMove);
			window.addEventListener('pointerup', onUp);
		} else {
			const img = element as ImageElement;
			const startW = img.width;
			const startH = img.height;
			const ratio = startH / startW;
			const onMove = (ev: PointerEvent) => {
				const dx = (ev.clientX - startX) / scale;
				const newW = Math.max(20, startW + dx);
				dispatch({
					type: 'UPDATE_ELEMENT',
					payload: { id: element.id, changes: { width: Math.round(newW), height: Math.round(newW * ratio) } },
				});
			};
			const onUp = () => {
				window.removeEventListener('pointermove', onMove);
				window.removeEventListener('pointerup', onUp);
			};
			window.addEventListener('pointermove', onMove);
			window.addEventListener('pointerup', onUp);
		}
	};

	const zIndex = getZIndex(element.type);
	const showResize = selected && (element.type === 'pictogram' || element.type === 'image');
	const showEdit = selected && (element.type === 'text' || element.type === 'heading');

	return (
		<div
			ref={wrapperRef}
			className={`template-element ${selected ? 'template-element--selected' : ''}`}
			style={{
				position: 'absolute',
				left: `${element.x}px`,
				top: `${element.y}px`,
				zIndex: selected ? zIndex + 5 : zIndex,
				cursor: 'grab',
				touchAction: 'none',
				userSelect: 'none',
				width: 'fit-content',
				...(element.type === 'logo' ? { transform: 'rotate(-13deg)', transformOrigin: 'top left' } : {}),
				...(selected ? { outline: `2px dashed ${getContrastOutlineColor(state.colorSet.backgroundColor)}` } : {}),
			}}
			onPointerDown={handlePointerDown}
		>
			{children}
			{showResize && <ResizeHandle onPointerDown={handleResizeDown} />}
			{selected && <CenterButtons element={element} />}
			{showEdit && <EditButton elementId={element.id} />}
		</div>
	);
}

function getZIndex(type: TemplateElement['type']): number {
	switch (type) {
		case 'logo': return 20;
		case 'arrow': return 20;
		case 'heading': return 15;
		case 'text': return 15;
		case 'pictogram': return 10;
		case 'image': return 8;
		default: return 10;
	}
}

function ElementRenderer({ element }: { element: TemplateElement }) {
	switch (element.type) {
		case 'heading':
			return <HeadingRenderer element={element} />;
		case 'text':
			return <TextRenderer element={element} />;
		case 'logo':
			return <LogoRenderer element={element} />;
		case 'arrow':
			return <ArrowRenderer element={element} />;
		case 'pictogram':
			return <PictogramRenderer element={element} />;
		case 'image':
			return <ImageRenderer element={element} />;
		default:
			return null;
	}
}

function ImageRenderer({ element }: { element: ImageElement }) {
	return (
		<img
			src={element.src}
			alt=""
			style={{
				width: `${element.width}px`,
				height: `${element.height}px`,
				display: 'block',
				pointerEvents: 'none',
				opacity: element.opacity,
			}}
			draggable={false}
		/>
	);
}

function HeadingRenderer({ element }: { element: HeadingElement }) {
	const { state } = useSharePic();
	return (
		<div style={{ width: `${element.width}px`, pointerEvents: 'none' }}>
			<SharePicHeading
				multiLineText={element.content}
				colorSet={state.colorSet}
				highlightColor={state.highlightColor}
				fontSize={element.fontSize}
			/>
		</div>
	);
}

function TextRenderer({ element }: { element: TextElement }) {
	const { state } = useSharePic();
	return (
		<div style={{ width: `${element.width}px`, pointerEvents: 'none' }}>
			<SharePicText
				multiLineText={element.content}
				colorSet={state.colorSet}
				highlightColor={state.highlightColor}
			/>
		</div>
	);
}

function LogoRenderer({ element }: { element: LogoElement }) {
	const { state } = useSharePic();
	return (
		<SharePicLogo
			localGroup={element.localGroup}
			visible={true}
			color={state.colorSet.accentColor}
		/>
	);
}

function ArrowRenderer({ element }: { element: ArrowElement }) {
	const { state } = useSharePic();
	return (
		<SharePicArrow
			visible={true}
			color={state.colorSet.accentColor}
			size={element.size}
		/>
	);
}

function PictogramRenderer({ element }: { element: PictogramElement }) {
	const { state } = useSharePic();
	const pictogram = pictograms.find(p => p.name === element.pictogramName);
	if (!pictogram) return null;

	return (
		<img
			src={pictogram.path}
			alt={pictogram.name}
			style={{
				width: `${element.size}rem`,
				height: `${element.size}rem`,
				display: 'block',
				pointerEvents: 'none',
				filter: state.colorSet.name === 'Black' ? 'invert()' : '',
			}}
			draggable={false}
		/>
	);
}
