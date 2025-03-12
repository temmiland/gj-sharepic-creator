import './Input.scss';

type InputProps = {
	type: React.HTMLInputTypeAttribute | undefined;
	name?: string;
	checked?: boolean;
	value?: string | number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ type, name, checked, value, onChange }: InputProps) {
	return (
		<input
			type={type}
			name={name}
			checked={checked}
			value={value}
			onChange={onChange}
		/>
	);
}

export default Input;
