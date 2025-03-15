type EditorLogoLocalGroupProps = {
	localGroup: string;
	handleLocalGroup: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorLogoLocalGroup({ localGroup, handleLocalGroup }: EditorLogoLocalGroupProps) {
	return (
		<>
			<h2>Logo – Ortsgruppe</h2>
			<input
				type="text"
				value={localGroup}
				onChange={handleLocalGroup}
			/>
		</>
	);
}
