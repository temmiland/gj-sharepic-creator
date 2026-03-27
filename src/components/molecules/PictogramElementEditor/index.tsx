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
import { pictograms } from '@/constants/pictograms';
import type { PictogramElement } from '@/types/template';

export function PictogramElementEditor({ element }: { element: PictogramElement }) {
	const { dispatch } = useSharePic();

	return (
		<>
			<label className="element-editor__field">
				Piktogramm
				<select
					value={element.pictogramName}
					onChange={e =>
						dispatch({
							type: 'UPDATE_ELEMENT',
							payload: { id: element.id, changes: { pictogramName: e.target.value } },
						})
					}
					className="element-editor__control"
				>
					{pictograms.map(p => (
						<option key={p.name} value={p.name}>
							{p.name}
						</option>
					))}
				</select>
			</label>
			<label className="element-editor__field element-editor__field--no-margin">
				Größe (rem)
				<input
					type="number"
					step={1}
					min={2}
					max={30}
					value={element.size}
					onChange={e =>
						dispatch({
							type: 'UPDATE_ELEMENT',
							payload: { id: element.id, changes: { size: Number(e.target.value) } },
						})
					}
					className="element-editor__control"
				/>
			</label>
		</>
	);
}
