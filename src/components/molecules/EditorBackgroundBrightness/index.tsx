import { Input } from '@/components/atoms/Input';

type EditorBackgroundBrightnessProps = {
	brightness: number;
	handleBrightness: React.ChangeEventHandler<HTMLInputElement>;
};

export function EditorBackgroundBrightness({ brightness, handleBrightness }: EditorBackgroundBrightnessProps) {
	return (
		<>
			<h2>Hintergrundbild – Helligkeit</h2>
			<Input
				type="number"
				value={brightness}
				onChange={handleBrightness}
			/>
		</>
	);
}
