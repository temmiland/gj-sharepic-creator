import "./SharePicContent.scss";

type SharePicContentProps = {
	positionValue: number;
	topOrBottom: boolean;
	children: React.ReactNode;
};

export function SharePicContent({ positionValue, topOrBottom, children }: SharePicContentProps) {
	const style = topOrBottom ? { top: `${positionValue}rem` } : { bottom: `${positionValue}rem` };
	return (
		<div className="content">
			<div className="content-inner" style={style}>
				{children}
			</div>
		</div>
	);
}
