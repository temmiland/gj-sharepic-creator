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
		// getBoundingClientRect / getClientRects return zoomed viewport coords.
		// offsetWidth is in CSS layout pixels (unzoomed). Divide all rect values by zoom.
		const zoom = pEl.getBoundingClientRect().width / pEl.offsetWidth || 1;

		setLineRects(lines.map(group => {
			const topVp = Math.min(...group.map(r => r.top)) - pRect.top;
			const contentHeightVp = Math.max(...group.map(r => r.bottom)) - Math.min(...group.map(r => r.top));
			const topCss = topVp / zoom;
			const contentHeightCss = contentHeightVp / zoom;
			const leading = (lineHeightPx - contentHeightCss) / 2;
			return {
				top: topCss - leading,
				left: (Math.min(...group.map(r => r.left)) - pRect.left) / zoom,
				width: (Math.max(...group.map(r => r.right)) - Math.min(...group.map(r => r.left))) / zoom,
				height: lineHeightPx,
			};
		}));
	}, []);

	useLayoutEffect(() => {
		measure();
		const ro = new ResizeObserver(measure);
		const pEl = spanRef.current?.closest('p');
		if (pEl) ro.observe(pEl);
		const canvas = document.getElementById('sharepic-download');
		if (canvas) ro.observe(canvas);
		return () => ro.disconnect();
	}, [measure, contentKey]);

	return (
		<>
			{lineRects.map((r, i) => {
				const n = lineRects.length;
				// getClientRects with box-decoration-break:slice includes padding-right only
				// on the last fragment. On continuation lines we add protrusion manually.
				const extendRight = i < n - 1 ? HIGHLIGHT_PAD_X : 0;
				return (
					<span
						key={i}
						aria-hidden
						style={{
							position: 'absolute',
							top: `${r.top}px`,
							left: `${r.left - HIGHLIGHT_PAD_X}px`,
							width: `${r.width + HIGHLIGHT_PAD_X + extendRight}px`,
							height: `${r.height}px`,
							backgroundColor: bgColor,
							zIndex: -1,
							pointerEvents: 'none',
						}}
					/>
				);
			})}
			<span ref={spanRef} style={{ color: textColor, paddingRight: `${HIGHLIGHT_PAD_X}px` }}>{children}</span>
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
