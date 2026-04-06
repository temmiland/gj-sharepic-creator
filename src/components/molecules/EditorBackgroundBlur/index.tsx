/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

type EditorBackgroundBlurProps = {
	blur: number;
	handleBlur: (value: number) => void;
};

export function EditorBackgroundBlur({ blur, handleBlur }: EditorBackgroundBlurProps) {
	return (
		<>
			<h2>Hintergrundbild – Unschärfe ({blur}px)</h2>
			<input
				type="range"
				min={0}
				max={20}
				step={0.5}
				value={blur}
				onChange={e => handleBlur(Number(e.target.value))}
				style={{ width: '100%' }}
			/>
		</>
	);
}
