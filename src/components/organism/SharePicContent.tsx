import "./SharePicContent.scss";

type SharePicContentProps = {
	topOrBottom: boolean;
	children: React.ReactNode;
};

export function SharePicContent({ topOrBottom, children }: SharePicContentProps) {

	return (
		<div className="content">
			<div className={`content-inner ${topOrBottom ? "content-inner-top" : "content-inner-bottom"}`}>
				{children}
			</div>
		</div>
	);
}
