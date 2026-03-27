/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { Input } from '@/components/atoms/Input';

type EditorBackgroundBlurProps = {
	blur: number;
	handleBlur: React.ChangeEventHandler<HTMLInputElement>;
};

export function EditorBackgroundBlur({ blur, handleBlur }: EditorBackgroundBlurProps) {
	return (
		<>
			<h2>Hintergrundbild – Unschärfe</h2>
			<Input
				type="number"
				value={blur}
				onChange={handleBlur}
			/>
		</>
	);
}
