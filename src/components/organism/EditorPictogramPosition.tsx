import Input from "../atoms/Input";

type EditorPictogramPositionProps = {
	pictogramPosition: PictogramPostion;
	handlePictogramPositionX: React.ChangeEventHandler<HTMLInputElement>;
	handlePictogramPositionY: React.ChangeEventHandler<HTMLInputElement>;
};

export function EditorPictogramPosition({ pictogramPosition, handlePictogramPositionX, handlePictogramPositionY }: EditorPictogramPositionProps) {
	return (
		<>
			<div>
				<Input
					type='number'
					value={pictogramPosition.x}
					onChange={handlePictogramPositionX}
				/>
				<Input
					type='number'
					value={pictogramPosition.y}
					onChange={handlePictogramPositionY}
				/>
			</div>
		</>
	);
}
