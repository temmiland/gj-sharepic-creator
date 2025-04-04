import React from "react";
import "./SharePicText.scss";
import { colorSets } from "../../constants/colors";

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

    const matches = text.matchAll(regex);

    for (const match of matches) {
      const [fullMatch] = match;
      const offset = match.index!;

      if (offset > lastIndex) {
        elements.push(text.slice(lastIndex, offset));
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
					? colorSets.find(cS => cS.name === "White")?.backgroundColor!!
					: colorSets.find(cS => cS.name === "Black")?.backgroundColor!!
				: colorSet.accentColor,
			  color: colorSet.backgroundColor === '#000000'
			  	? colorSets.find(cS => cS.name === "Black")?.backgroundColor!!
					: colorSets.find(cS => cS.name === "White")?.backgroundColor!!,
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
			  	? colorSets.find(cS => cS.name === "White")?.backgroundColor!!
				: colorSets.find(cS => cS.name === "Black")?.backgroundColor!!,
            }}
          >
            {parseMarkdown(spanContent)}
          </span>
        );
      }

      lastIndex = offset + fullMatch.length;
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
									? colorSets.find(cS => cS.name === "White")?.backgroundColor!!
									: colorSets.find(cS => cS.name === "Black")?.backgroundColor!!
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
