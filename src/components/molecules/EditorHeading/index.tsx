/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { WysiwygEditor } from '@/components/molecules/WysiwygEditor';
import type { FormatAction } from '@/components/molecules/WysiwygEditor';

type EditorHeadingProps = {
	value: string;
	onChange: (value: string) => void;
	maxCharsPerLine?: number;
	maxLines?: number;
};

const headingActions: FormatAction[] = [
	{
		label: 'Hervorheben',
		icon: <span>★</span>,
		wrapper: ['*', ''],
		lineLevel: true,
	},
];

export function EditorHeading({ value, onChange, maxCharsPerLine, maxLines }: EditorHeadingProps) {
	return (
		<>
			<h2>Überschrift</h2>
			<WysiwygEditor
				value={value}
				onChange={onChange}
				actions={headingActions}
				cols={maxCharsPerLine}
				rows={maxLines}
				wrap="hard"
				maxLength={100}
				placeholder="Zeile mit ★ hervorheben"
			/>
		</>
	);
}
