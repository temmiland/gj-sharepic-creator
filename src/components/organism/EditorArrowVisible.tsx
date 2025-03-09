import H2 from "../atoms/H2";
import Input from "../atoms/Input";

type EditorArrowVisibleProps = {
	visible: boolean;
	handleVisibility: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorArrowVisible({ visible, handleVisibility }: EditorArrowVisibleProps) {
	return (
		<>
			<H2>Pfeil sichtbar?</H2>
			<Input
				type="checkbox"
				checked={visible}
				onChange={handleVisibility}
			/>
		</>
	);
}
