type EditorPictogramProps = {
	pictograms: Pictogram[];
	pictogram: Pictogram | null;
	handlePictogram: React.ChangeEventHandler<HTMLSelectElement>;
};

export function EditorPictogram({ pictograms, pictogram, handlePictogram }: EditorPictogramProps) {
	return (
		<>
			<h2>Piktogramm</h2>
			<select
				onChange={handlePictogram}
				value={pictogram?.name}
			>
				<option
					value=""
				>
					Wählen Sie ein Piktogramm
				</option>
				{
					pictograms.map(p => (
						<option
							key={p.name}
							value={p.name}
						>
							{p.name}
						</option>
					))
				}
			</select>
		</>
	);
}
