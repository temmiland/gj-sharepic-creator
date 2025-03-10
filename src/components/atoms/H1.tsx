import './H1.scss';

type H1Props = {
	fontSize: number;
	fontColor: string;
	backgroundColor: string;
	children: React.ReactNode;
};

function H1({ fontSize, fontColor, backgroundColor, children }: H1Props) {
	return (
		<h1
			style={{
				fontSize: fontSize + 'rem',
				color: fontColor,
				backgroundColor: backgroundColor
			}}
		>
			{children}
		</h1>
	);
}

export default H1;
