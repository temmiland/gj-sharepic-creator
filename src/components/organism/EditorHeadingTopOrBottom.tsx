type EditorHeadingTopOrBottomProps = {
	topOrBottom: boolean;
	handleTopOrBottom: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorHeadingTopOrBottom({ topOrBottom, handleTopOrBottom }: EditorHeadingTopOrBottomProps) {
	return (
		<>
			<h2>Überschrift oben anheften?</h2>
			<input
				type="checkbox"
				checked={topOrBottom}
				onChange={handleTopOrBottom}
			/>
		</>
	);
}
