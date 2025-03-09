type EditorLogoLocalGroupProps = {
	localGroup: string;
	handleLocalGroup: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorLogoLocalGroup({ localGroup, handleLocalGroup }: EditorLogoLocalGroupProps) {
	return (
		<>
			<h2>Ortsgruppe</h2>
			<input
				type="text"
				value={localGroup}
				onChange={handleLocalGroup}
			/>
		</>
	);
}
