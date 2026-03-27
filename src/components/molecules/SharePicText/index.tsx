/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import React from "react";
import type { ColorSet, HighlightColor } from '@/types/design-tokens';
import './SharePicText.scss';
import { colorSets } from '@/constants/colors';

type SharePicTextProps = {
	multiLineText: string[];
	colorSet: ColorSet;
	highlightColor: HighlightColor;
};

export function SharePicText({ multiLineText, colorSet, highlightColor }: SharePicTextProps) {

	function parseMarkdown(text: string): React.ReactNode {
    const regex = /(\*[^*]+\*|_[^_]+_|~[^~]+~|#[^#]+#|%[^%]+%)/g;

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];
    let lastWasColoredSpan = false;

    const matches = text.matchAll(regex);

    for (const match of matches) {
      const [fullMatch] = match;
      const offset = match.index!;
      const isColoredSpan = (fullMatch.startsWith('%') && fullMatch.endsWith('%'))
        || (fullMatch.startsWith('#') && fullMatch.endsWith('#'));

      if (offset > lastIndex) {
        const interstitial = text.slice(lastIndex, offset);
        if (lastWasColoredSpan && isColoredSpan && interstitial.trim() === '') {
          // skip whitespace between two adjacent colored spans to avoid visual gaps
        } else {
          elements.push(interstitial);
        }
      }

      if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
        const boldContent = fullMatch.slice(1, -1);
        elements.push(<strong key={offset}>{parseMarkdown(boldContent)}</strong>);
      } else if (fullMatch.startsWith('_') && fullMatch.endsWith('_')) {
        const italicContent = fullMatch.slice(1, -1);
        elements.push(<em key={offset}>{parseMarkdown(italicContent)}</em>);
      } else if (fullMatch.startsWith('~') && fullMatch.endsWith('~')) {
        const strikeContent = fullMatch.slice(1, -1);
        elements.push(<del key={offset}>{parseMarkdown(strikeContent)}</del>);
	  } else if (fullMatch.startsWith('%') && fullMatch.endsWith('%')) {
		const spanContent = fullMatch.slice(1, -1);
        elements.push(
          <span
            key={offset}
            style={{
              backgroundColor: colorSet.accentColor === '#c7ff7a'
			  	? colorSet.backgroundColor === '#000000'
					? colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
					: colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
				: colorSet.accentColor,
			  color: colorSet.backgroundColor === '#000000'
			  	? colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
					: colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff',
			  boxDecorationBreak: 'clone',
			  WebkitBoxDecorationBreak: 'clone',
            }}
          >
            {parseMarkdown(spanContent)}
          </span>
        );
	  } else if (fullMatch.startsWith('#') && fullMatch.endsWith('#')) {
        const spanContent = fullMatch.slice(1, -1);
        elements.push(
          <span
            key={offset}
            style={{
              backgroundColor: highlightColor.backgroundColor,
			  boxDecorationBreak: 'clone',
			  WebkitBoxDecorationBreak: 'clone',
			  color: highlightColor.backgroundColor === '#000000'
			  	? colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
				: colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000',
            }}
          >
            {parseMarkdown(spanContent)}
          </span>
        );
      }

      lastIndex = offset + fullMatch.length;
      lastWasColoredSpan = isColoredSpan;
    }

    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }

    return elements;
	}

	return (
		<div className="text">
			{
				multiLineText.map((line) => (
					line !== "" ? (
						<p
							key={line}
							style={{
								color: colorSet.name === "Black"
									? colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
									: colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
							}}
						>
							{parseMarkdown(line)}
						</p>
					) : null
				))
			}
		</div>
	);
}
