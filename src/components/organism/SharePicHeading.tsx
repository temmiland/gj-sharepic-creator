type SharePicHeadingProps = {
	multiLineText: string[];
	topOrBottom: boolean;
	colorSet: ColorSet;
	highlightColor: HighlightColor;
};

export function SharePicHeading({ multiLineText, topOrBottom, colorSet, highlightColor }: SharePicHeadingProps) {

	return (
		<div className={topOrBottom ? 'heading-top' : 'heading-bottom'}>
			{
				multiLineText.map((line) => (
					line !== "" ? (
						<h1
							key={line}
							className={
								topOrBottom
									? 'wix-madefor-display-800'
									: 'heading-top-reset wix-madefor-display-800'
								}
							style={
								line.startsWith('*')
									? {
										backgroundColor: highlightColor.backgroundColor,
										color: highlightColor.name === "Black"
											? '#ffffff'
											: '#000000'
									}
									: {
										backgroundColor: colorSet.name === "White"
											? '#000000'
											: '#ffffff',
										color: colorSet.name === "White"
											? '#ffffff'
											: '#000000',
							}}
						>
							{line.replace('*', '')}
						</h1>
					) : null
				))
			}
		</div>
	);
}
