import type { HighlightColor } from '@/types/design-tokens';
import { ColorPicker } from '@/components/molecules/ColorPicker';

type EditorHighlightColorProps = {
	highlightColors: HighlightColor[];
	highlightColor: HighlightColor;
	handleHighlightColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorHighlightColor({ highlightColors, highlightColor, handleHighlightColor }: EditorHighlightColorProps) {

	return (
		<>
			<h2>Highlight Farbe</h2>
			<ColorPicker
				colors={highlightColors}
				color={highlightColor}
				handleColor={handleHighlightColor}
			/>
		</>
	);
}
