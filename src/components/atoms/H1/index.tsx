/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import './H1.scss';

type H1Props = {
	fontSize: number;
	fontColor: string;
	backgroundColor: string;
	children: React.ReactNode;
};

export function H1({ fontSize, fontColor, backgroundColor, children }: H1Props) {
	return (
		<h1
			style={{
				fontSize: fontSize * 10 + 'px',
				color: fontColor,
				backgroundColor: backgroundColor
			}}
		>
			{children}
		</h1>
	);
}
