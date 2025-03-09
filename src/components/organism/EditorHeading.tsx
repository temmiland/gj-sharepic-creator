type EditorHeadingProps = {
	multiLineText: string[];
	handleHeading: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export function EditorHeading({ multiLineText, handleHeading }: EditorHeadingProps) {
	return (
		<>
			<h2>Überschrift</h2>
			<textarea
				cols={20}
				rows={5}
				wrap="hard"
				maxLength={100}
				value={multiLineText.join("\n")}
				onChange={handleHeading}
			/>
		</>
	);
}
