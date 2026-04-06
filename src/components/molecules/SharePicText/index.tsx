/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import React, { useRef, useLayoutEffect, useState, useCallback } from "react";
import type { ColorSet, HighlightColor } from '@/types/design-tokens';
import './SharePicText.scss';
import { colorSets } from '@/constants/colors';

type SharePicTextProps = {
	multiLineText: string[];
	colorSet: ColorSet;
	highlightColor: HighlightColor;
};

type LineRect = { top: number; left: number; width: number; height: number };
const HIGHLIGHT_PAD_X = 4;

function HighlightSpan({ bgColor, textColor, contentKey, children }: {
	bgColor: string;
	textColor: string;
	contentKey: string;
	children: React.ReactNode;
}) {
	const spanRef = useRef<HTMLSpanElement>(null);
	const [lineRects, setLineRects] = useState<LineRect[]>([]);

	const measure = useCallback(() => {
		const el = spanRef.current;
		if (!el) return;
		const pEl = el.closest('p');
		if (!pEl) return;
		const pRect = pEl.getBoundingClientRect();
		const rawRects = Array.from(el.getClientRects()).filter(r => r.width > 0);
		if (rawRects.length === 0) return;

		const lines: DOMRect[][] = [];
		for (const rect of rawRects) {
			const existing = lines.find(l => Math.abs(l[0].top - rect.top) < rect.height * 0.5);
			if (existing) existing.push(rect);
			else lines.push([rect]);
		}

		const lineHeightPx = parseFloat(window.getComputedStyle(pEl).lineHeight);

		setLineRects(lines.map(group => {
			const top = Math.min(...group.map(r => r.top)) - pRect.top;
			const contentHeight = Math.max(...group.map(r => r.bottom)) - Math.min(...group.map(r => r.top));
			const leading = (lineHeightPx - contentHeight) / 2;
			return {
				top: top - leading,
				left: Math.min(...group.map(r => r.left)) - pRect.left,
				width: Math.max(...group.map(r => r.right)) - Math.min(...group.map(r => r.left)),
				height: lineHeightPx,
			};
		}));
	}, []);

	useLayoutEffect(() => {
		measure();
		const ro = new ResizeObserver(measure);
		if (spanRef.current) ro.observe(spanRef.current);
		const canvas = document.getElementById('sharepic-download');
		if (canvas) ro.observe(canvas);
		return () => ro.disconnect();
	}, [measure, contentKey]);

	return (
		<>
			{lineRects.map((r, i) => {
				const n = lineRects.length;
				// CSS padding covers: left side of first rect, right side of last rect.
				// At line-break edges those sides are missing — extend them manually.
				const extendLeft = i > 0 ? HIGHLIGHT_PAD_X : 0;
				const extendRight = i < n - 1 ? HIGHLIGHT_PAD_X : 0;
				return (
					<span
						key={i}
						aria-hidden
						style={{
							position: 'absolute',
							top: `${r.top}px`,
							left: `${r.left - extendLeft}px`,
							width: `${r.width + extendLeft + extendRight}px`,
							height: `${r.height}px`,
							backgroundColor: bgColor,
							zIndex: -1,
							pointerEvents: 'none',
						}}
					/>
				);
			})}
			<span ref={spanRef} style={{ color: textColor, padding: `0 ${HIGHLIGHT_PAD_X}px` }}>{children}</span>
		</>
	);
}

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
		const bgColor = colorSet.accentColor === '#c7ff7a'
			? colorSet.backgroundColor === '#000000'
				? colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
				: colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
			: colorSet.accentColor;
		const textColor = colorSet.backgroundColor === '#000000'
			? colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000'
			: colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff';
        elements.push(
          <HighlightSpan key={offset} bgColor={bgColor} textColor={textColor} contentKey={spanContent}>
            {parseMarkdown(spanContent)}
          </HighlightSpan>
        );
	  } else if (fullMatch.startsWith('#') && fullMatch.endsWith('#')) {
        const spanContent = fullMatch.slice(1, -1);
		const textColor = highlightColor.backgroundColor === '#000000'
			? colorSets.find(cS => cS.name === "White")?.backgroundColor ?? '#ffffff'
			: colorSets.find(cS => cS.name === "Black")?.backgroundColor ?? '#000000';
        elements.push(
          <HighlightSpan key={offset} bgColor={highlightColor.backgroundColor} textColor={textColor} contentKey={spanContent}>
            {parseMarkdown(spanContent)}
          </HighlightSpan>
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
				multiLineText.map((line, index) => (
					line !== "" ? (
						<p
							key={index}
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
