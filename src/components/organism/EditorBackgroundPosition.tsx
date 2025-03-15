import { backgroundPositions } from "../../constants/background-positions";

type EditorBackgroundPositionProps = {
	position: BackgroundPosition;
	handlePosition: React.ChangeEventHandler<HTMLSelectElement>;
};



export function EditorBackgroundPosition({ position, handlePosition }: EditorBackgroundPositionProps) {

	return (
		<>
			<h2>Hintergrundbild Position</h2>
			<select
				onChange={handlePosition}
				defaultValue={position.value}
			>
				{
					backgroundPositions.map(p => (
						<option
							key={p.value}
							value={p.value}
						>
							{p.displayName}
						</option>
					))
				}
			</select>
		</>
	);
}
