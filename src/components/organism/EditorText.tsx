type EditorTextProps = {
	multiLineText: string[];
	handleText: React.ChangeEventHandler<HTMLTextAreaElement>;
};

export function EditorText({ multiLineText, handleText }: EditorTextProps) {
	return (
		<>
			<h2>Text</h2>
			<textarea
				value={multiLineText.join("\n")}
				onChange={handleText}
			/>
		</>
	);
}
