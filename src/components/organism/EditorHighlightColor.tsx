import H2 from "../atoms/H2";
import ColorPicker from "../molecules/ColorPicker";

type EditorHighlightColorProps = {
	highlightColors: HighlightColor[];
	highlightColor: HighlightColor;
	handleHighlightColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorHighlightColor({ highlightColors, highlightColor, handleHighlightColor }: EditorHighlightColorProps) {

	return (
		<>
			<H2>Highlight Farbe</H2>
			<ColorPicker
				colors={highlightColors}
				color={highlightColor}
				handleColor={handleHighlightColor}
			/>
		</>
	);
}
