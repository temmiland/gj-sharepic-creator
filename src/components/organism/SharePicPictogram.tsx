type SharePicPictogramProps = {
	pictogram: Pictogram | null;
	position: PictogramPostion;
	colorSet: ColorSet;
};

export function SharePicPictogram({ pictogram, position, colorSet }: SharePicPictogramProps) {
	return pictogram && (
			<div
				style={{
					filter: colorSet.name === "Black" ? 'invert()' : '',
					maxWidth: 'max-content',
					position: 'absolute',
					top: `${position.y}px`,
					left: `${position.x}px`,
					zIndex: 10
				}}
			>
				<img
					src={pictogram.path}
					alt={pictogram.name}
					style={{ width: '18rem', height: '18rem' }}
				/>
			</div>
		);
}
