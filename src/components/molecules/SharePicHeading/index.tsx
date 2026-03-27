/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { ColorSet, HighlightColor } from '@/types/design-tokens';
import { colorSets } from '@/constants/colors';
import { H1 } from '@/components/atoms/H1';
import "./SharePicHeading.scss";

type SharePicHeadingProps = {
	multiLineText: string[];
	colorSet: ColorSet;
	highlightColor: HighlightColor;
	fontSize: number;
};

export function SharePicHeading({ multiLineText, colorSet, highlightColor, fontSize }: SharePicHeadingProps) {

	return (
		<div className="heading">
			{
				multiLineText.map((line) => (
					line !== "" ? (
						<H1
							key={line}
							fontSize={fontSize}
							fontColor={
								line.startsWith('*')
									? highlightColor.name === "Black"
											? colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
											: colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
									: colorSet.name === "White"
											? colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
											: colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
							}
							backgroundColor={
								line.startsWith('*')
									? highlightColor.backgroundColor
									: colorSet.name === "White"
											? colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
											: colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
							}
						>
							{line.replace('*', '')}
						</H1>
					) : null
				))
			}
		</div>
	);
}
