import './Button.scss';

type ButtonProps = {
	onClick: () => void;
	children?: React.ReactNode;
};

function Button({ onClick, children = "Buttontext" }: ButtonProps) {
	return (
		<button className="hdg-button" onClick={onClick}>
			{children}
		</button>
	);
}

export default Button;
