type EditorHeadingProps = {
	multiLineText: string[];
	maxCharsPerLine: number;
	maxLines: number;
	handleHeading: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export function EditorHeading({ multiLineText, maxCharsPerLine, maxLines, handleHeading }: EditorHeadingProps) {
	return (
		<>
			<h2>Überschrift</h2>
			<textarea
				cols={maxCharsPerLine}
				rows={maxLines}
				wrap="hard"
				maxLength={100}
				value={multiLineText.join("\n")}
				onChange={handleHeading}
			/>
		</>
	);
}
