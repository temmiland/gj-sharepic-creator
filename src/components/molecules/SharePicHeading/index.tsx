/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import React from 'react';
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

function getColors(colorSet: ColorSet, highlightColor: HighlightColor) {
	const baseFontColor = colorSet.name === 'White'
		? colorSets.find(cS => cS.name === 'White')?.backgroundColor ?? '#ffffff'
		: colorSets.find(cS => cS.name === 'Black')?.backgroundColor ?? '#000000';

	const baseBg = colorSet.name === 'White'
		? colorSets.find(cS => cS.name === 'Black')?.backgroundColor ?? '#000000'
		: colorSets.find(cS => cS.name === 'White')?.backgroundColor ?? '#ffffff';

	const highlightFontColor = highlightColor.name === 'Black'
		? colorSets.find(cS => cS.name === 'White')?.backgroundColor ?? '#ffffff'
		: colorSets.find(cS => cS.name === 'Black')?.backgroundColor ?? '#000000';

	return { baseFontColor, baseBg, highlightFontColor };
}

/**
 * Parse inline #text# highlight markers within a heading line.
 * Works like text: plain text stays as-is, highlighted parts become <span>s
 * with their own background. The parent h1 provides the base background.
 */
function parseInlineHighlight(
	text: string,
	highlightColor: HighlightColor,
	highlightFontColor: string,
): React.ReactNode {
	const regex = /(#[^#]+#)/g;
	let lastIndex = 0;
	const elements: React.ReactNode[] = [];
	const matches = text.matchAll(regex);

	for (const match of matches) {
		const [fullMatch] = match;
		const offset = match.index!;

		if (offset > lastIndex) {
			elements.push(text.slice(lastIndex, offset));
		}

		const spanContent = fullMatch.slice(1, -1);
		elements.push(
			<span
				key={offset}
				style={{
					backgroundColor: highlightColor.backgroundColor,
					color: highlightFontColor,
					padding: '0.01em 0.2em',
					boxDecorationBreak: 'clone',
					WebkitBoxDecorationBreak: 'clone',
				}}
			>
				{spanContent}
			</span>
		);

		lastIndex = offset + fullMatch.length;
	}

	if (elements.length === 0) {
		return text;
	}

	if (lastIndex < text.length) {
		elements.push(text.slice(lastIndex));
	}

	return elements;
}

export function SharePicHeading({ multiLineText, colorSet, highlightColor, fontSize }: SharePicHeadingProps) {
	const { baseFontColor, baseBg, highlightFontColor } = getColors(colorSet, highlightColor);

	return (
		<div className="heading">
			{multiLineText.map((line, index) => {
				if (line === '') return null;

				const isFullLineHighlight = line.startsWith('*');
				const displayText = isFullLineHighlight ? line.substring(1) : line;

				return (
					<H1
						key={index}
						fontSize={fontSize}
						fontColor={isFullLineHighlight ? highlightFontColor : baseFontColor}
						backgroundColor={isFullLineHighlight ? highlightColor.backgroundColor : baseBg}
					>
						{isFullLineHighlight
							? displayText
							: parseInlineHighlight(displayText, highlightColor, highlightFontColor)
						}
					</H1>
				);
			})}
		</div>
	);
}
