/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useState } from 'react';
import { useSharePic } from '@/context/SharePicContext';
import { generateUUID } from '@/utils/uuid';
import { scaleImageToDataUrl } from '@/utils/image-scale';
import { getElementTypeLabel } from '@/utils/element-labels';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/canvas';
import { ElementTypeIcon } from '@/components/atoms/ElementTypeIcon';
import type { TemplateElement, TemplateElementType } from '@/types/template';
import './AddElementButton.scss';

export function AddElementButton() {
	const { dispatch } = useSharePic();
	const [open, setOpen] = useState(false);

	const addElement = (type: TemplateElementType) => {
		const id = `${type}-${generateUUID().slice(0, 8)}`;
		let element: TemplateElement;

		switch (type) {
			case 'heading':
				element = { id, type, x: 29, y: 75, visible: true, content: ['Überschrift'], fontSize: 3.75, width: 297 };
				break;
			case 'text':
				element = { id, type, x: 29, y: 200, visible: true, content: ['Text hier eingeben...'], width: 297 };
				break;
			case 'logo':
				element = { id, type, x: 12, y: 405, visible: true, localGroup: '' };
				break;
			case 'arrow':
				element = { id, type, x: 308, y: 398, visible: true, size: 50 };
				break;
			case 'pictogram':
				element = { id, type, x: 100, y: 100, visible: true, pictogramName: 'Banner', size: 18 };
				break;
			default:
				return;
		}

		dispatch({ type: 'ADD_ELEMENT', payload: element });
		setOpen(false);
	};

	const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		e.target.value = '';
		setOpen(false);
		const { dataUrl, naturalWidth, naturalHeight } = await scaleImageToDataUrl(file, 1080, 1080);
		const displayScale = Math.min(1, 300 / naturalWidth, 300 / naturalHeight);
		const w = Math.round(naturalWidth * displayScale);
		const h = Math.round(naturalHeight * displayScale);
		const id = `image-${generateUUID().slice(0, 8)}`;
		dispatch({
			type: 'ADD_ELEMENT',
			payload: {
				id, type: 'image',
				x: Math.round((CANVAS_WIDTH - w) / 2), y: Math.round((CANVAS_HEIGHT - h) / 2),
				visible: true, src: dataUrl, width: w, height: h, opacity: 1, rotation: 0,
			},
		});
	};

	return (
		<div className="add-element">
			<button
				type="button"
				onClick={() => setOpen(v => !v)}
				className={`add-element__trigger${open ? ' add-element__trigger--open' : ''}`}
			>
				<span className="add-element__icon">
					{open
						? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
						: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
					}
				</span>
				{open ? 'Schließen' : 'Element hinzufügen'}
			</button>

			{open && (
				<div className="add-element__grid">
					{(['heading', 'text', 'logo', 'arrow', 'pictogram'] as TemplateElementType[]).map(type => (
						<button
							key={type}
							type="button"
							onClick={() => addElement(type)}
							className="add-element__card"
						>
							<ElementTypeIcon type={type} />
							<span>{getElementTypeLabel(type)}</span>
						</button>
					))}
					<label className="add-element__card add-element__card-label">
						<ElementTypeIcon type="image" />
						<span>{getElementTypeLabel('image')}</span>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageFile}
							className="add-element__file-input"
						/>
					</label>
				</div>
			)}
		</div>
	);
}
