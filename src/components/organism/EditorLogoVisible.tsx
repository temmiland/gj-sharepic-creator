import Input from "../atoms/Input";

type EditorLogoVisibleProps = {
	visible: boolean;
	handleVisibility: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorLogoVisible({ visible, handleVisibility }: EditorLogoVisibleProps) {
	return (
		<>
			<h2>Logo sichtbar?</h2>
			<Input
				type="checkbox"
				name="logo-visible"
				checked={visible}
				onChange={handleVisibility}
			/>
		</>
	);
}
