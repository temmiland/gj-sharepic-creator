type EditorPictogramPositionProps = {
	pictogramPosition: PictogramPostion;
	handlePictogramPositionX: React.ChangeEventHandler<HTMLInputElement>;
	handlePictogramPositionY: React.ChangeEventHandler<HTMLInputElement>;
};

export function EditorPictogramPosition({ pictogramPosition, handlePictogramPositionX, handlePictogramPositionY }: EditorPictogramPositionProps) {
	return (
		<>
			<div>
				<input
					type='number'
					value={pictogramPosition.x}
					onChange={handlePictogramPositionX}
				/>
				<input
					type='number'
					value={pictogramPosition.y}
					onChange={handlePictogramPositionY}
				/>
			</div>
		</>
	);
}
