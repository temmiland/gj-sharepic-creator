import './Details.scss';

type DetailsProps = {
	summary: string;
	children?: React.ReactNode;
};

function Button({ summary, children }: DetailsProps) {
	return (
		<details className="hdg-details">
			<summary className="hdg-details-summary">{ summary }</summary>
			{children}
		</details>
	);
}

export default Button;
