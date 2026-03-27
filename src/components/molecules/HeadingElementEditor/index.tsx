/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useSharePic } from '@/context/SharePicContext';
import { EditorHeading } from '@/components/molecules/EditorHeading';
import type { HeadingElement } from '@/types/template';

export function HeadingElementEditor({ element }: { element: HeadingElement }) {
	const { dispatch } = useSharePic();

	return (
		<>
			<label className="element-editor__field">
				Schriftgröße (rem)
				<input
					type="number"
					step={0.1}
					min={1}
					max={6}
					value={element.fontSize}
					onChange={e =>
						dispatch({
							type: 'UPDATE_ELEMENT',
							payload: { id: element.id, changes: { fontSize: Number(e.target.value) } },
						})
					}
					className="element-editor__control"
				/>
			</label>
			<label className="element-editor__field">
				Breite (px)
				<input
					type="number"
					min={50}
					max={360}
					value={element.width}
					onChange={e =>
						dispatch({
							type: 'UPDATE_ELEMENT',
							payload: { id: element.id, changes: { width: Number(e.target.value) } },
						})
					}
					className="element-editor__control"
				/>
			</label>
			<EditorHeading
				value={element.content.join('\n')}
				onChange={value =>
					dispatch({
						type: 'UPDATE_ELEMENT',
						payload: { id: element.id, changes: { content: value.split(/\r?\n/).slice(0, 5) } },
					})
				}
				maxCharsPerLine={20}
				maxLines={5}
			/>
		</>
	);
}
