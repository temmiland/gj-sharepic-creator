import './Input.scss';

type InputProps = {
	type: React.HTMLInputTypeAttribute | undefined;
	name?: string;
	accept?: string;
	checked?: boolean;
	value?: string | number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Input({ type, name, accept, checked, value, onChange }: InputProps) {
	return type === "file"
		? (
			<>
				<label
					htmlFor="file-upload"
					className="custom-file-upload"
				>
					Datei auswählen
				</label>
				<input
					id="file-upload"
					type={type}
					name={name}
					accept={accept}
					checked={checked}
					value={value}
					onChange={onChange}
				/>
			</>
		)
		: (
			<input
				type={type}
				name={name}
				accept={accept}
				checked={checked}
				value={value}
				onChange={onChange}
			/>
		);
}

export default Input;
