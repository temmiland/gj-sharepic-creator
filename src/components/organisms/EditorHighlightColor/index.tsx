/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { HighlightColor } from '@/types/design-tokens';
import { ColorPicker } from '@/components/molecules/ColorPicker';

type EditorHighlightColorProps = {
	highlightColors: HighlightColor[];
	highlightColor: HighlightColor;
	handleHighlightColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorHighlightColor({ highlightColors, highlightColor, handleHighlightColor }: EditorHighlightColorProps) {

	return (
		<>
			<h2>Highlight Farbe</h2>
			<ColorPicker
				colors={highlightColors}
				color={highlightColor}
				handleColor={handleHighlightColor}
			/>
		</>
	);
}
