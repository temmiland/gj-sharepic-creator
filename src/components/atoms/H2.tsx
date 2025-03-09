import './H2.scss';

type H2Props = {
	children: React.ReactNode;
};

function H2({ children }: H2Props) {
	return (
		<h2>{children}</h2>
	);
}

export default H2;
