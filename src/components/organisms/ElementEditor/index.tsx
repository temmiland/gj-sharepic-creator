import { useState, useRef, useEffect } from 'react';
import { useSharePic } from '@/context/SharePicContext';
import { centerElementHorizontally, centerElementVertically } from '@/utils/element-size';
import { getElementTypeLabel } from '@/utils/element-labels';
import { HeadingElementEditor } from '@/components/molecules/HeadingElementEditor';
import { TextElementEditor } from '@/components/molecules/TextElementEditor';
import { LogoElementEditor } from '@/components/molecules/LogoElementEditor';
import { ArrowElementEditor } from '@/components/molecules/ArrowElementEditor';
import { PictogramElementEditor } from '@/components/molecules/PictogramElementEditor';
import { ImageElementEditor } from '@/components/organisms/ImageElementEditor';
import type { TemplateElement } from '@/types/template';
import './ElementEditor.scss';

export function ElementEditor({ element }: { element: TemplateElement }) {
	const { dispatch } = useSharePic();

	const updateElement = (changes: Partial<TemplateElement>) => {
		dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, changes } });
	};

	const removeElement = () => {
		dispatch({ type: 'REMOVE_ELEMENT', payload: element.id });
	};

	const centerH = () => {
		updateElement({ x: centerElementHorizontally(element) });
	};

	const centerV = () => {
		updateElement({ y: centerElementVertically(element) });
	};

	const typeLabel = getElementTypeLabel(element.type);
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const handler = () => setOpen(true);
		el.addEventListener('hdg-details-open', handler);
		return () => el.removeEventListener('hdg-details-open', handler);
	}, []);

	return (
		<div
			ref={containerRef}
			className="element-editor"
			data-element-editor={element.id}
		>
			<div className="element-editor__header">
				<button
					type="button"
					className="element-editor__toggle"
					onClick={() => setOpen(v => !v)}
				>
					<svg
						className={`element-editor__chevron${open ? ' element-editor__chevron--open' : ''}`}
						width="12" height="12" viewBox="0 0 12 12" fill="none"
					>
						<path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
					</svg>
					{typeLabel}
				</button>
				<button
					type="button"
					className="element-editor__remove"
					onPointerDown={e => { e.stopPropagation(); removeElement(); }}
					onClick={e => e.stopPropagation()}
				>
					<svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
				</button>
			</div>
			<div className={`element-editor__body${open ? ' element-editor__body--open' : ''}`}>
				<div className="element-editor__position-grid">
					<label className="element-editor__label">
						X (px)
						<input
							type="number"
							className="element-editor__input"
							value={element.x}
							onChange={e => updateElement({ x: Number(e.target.value) })}
						/>
					</label>
					<label className="element-editor__label">
						Y (px)
						<input
							type="number"
							className="element-editor__input"
							value={element.y}
							onChange={e => updateElement({ y: Number(e.target.value) })}
						/>
					</label>
				</div>
				<div className="element-editor__center-buttons">
					<button
						type="button"
						className="element-editor__center-btn"
						onClick={centerH}
						title="Horizontal zentrieren"
					>
						⇔ Horizontal
					</button>
					<button
						type="button"
						className="element-editor__center-btn"
						onClick={centerV}
						title="Vertikal zentrieren"
					>
						⇕ Vertikal
					</button>
				</div>

				<label className="element-editor__visibility">
					<input
						type="checkbox"
						checked={element.visible}
						onChange={e => updateElement({ visible: e.target.checked })}
					/>
					Sichtbar
				</label>

				{element.type === 'heading' && <HeadingElementEditor element={element} />}
				{element.type === 'text' && <TextElementEditor element={element} />}
				{element.type === 'logo' && <LogoElementEditor element={element} />}
				{element.type === 'arrow' && <ArrowElementEditor element={element} />}
				{element.type === 'pictogram' && <PictogramElementEditor element={element} />}
				{element.type === 'image' && <ImageElementEditor element={element} />}
			</div>
		</div>
	);
}
