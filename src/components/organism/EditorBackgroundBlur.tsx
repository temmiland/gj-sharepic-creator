import Input from "../atoms/Input";

type EditorBackgroundBlurProps = {
	blur: number;
	handleBlur: React.ChangeEventHandler<HTMLInputElement>;
};

export function EditorBackgroundBlur({ blur, handleBlur }: EditorBackgroundBlurProps) {
	return (
		<>
			<h2>Hintergrundbild – Unschärfe</h2>
			<Input
				type="number"
				value={blur}
				onChange={handleBlur}
			/>
		</>
	);
}
