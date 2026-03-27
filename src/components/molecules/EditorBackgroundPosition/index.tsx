/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { BackgroundPosition } from '@/types/design-tokens';
import { backgroundPositions } from '@/constants/background-positions';

type EditorBackgroundPositionProps = {
	position: BackgroundPosition;
	handlePosition: React.ChangeEventHandler<HTMLSelectElement>;
};



export function EditorBackgroundPosition({ position, handlePosition }: EditorBackgroundPositionProps) {

	return (
		<>
			<h2>Hintergrundbild – Position</h2>
			<select
				onChange={handlePosition}
				defaultValue={position.value}
			>
				{
					backgroundPositions.map(p => (
						<option
							key={p.value}
							value={p.value}
						>
							{p.displayName}
						</option>
					))
				}
			</select>
		</>
	);
}
