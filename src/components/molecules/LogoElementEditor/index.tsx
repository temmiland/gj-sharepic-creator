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
import type { LogoElement } from '@/types/template';

export function LogoElementEditor({ element }: { element: LogoElement }) {
	const { dispatch } = useSharePic();

	return (
		<label className="element-editor__field element-editor__field--no-margin">
			Ortsgruppe
			<input
				type="text"
				value={element.localGroup}
				onChange={e =>
					dispatch({
						type: 'UPDATE_ELEMENT',
						payload: { id: element.id, changes: { localGroup: e.target.value } },
					})
				}
				className="element-editor__control"
				placeholder="z.B. Leipzig"
			/>
		</label>
	);
}
