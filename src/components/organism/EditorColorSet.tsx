import H2 from "../atoms/H2";
import ColorPicker from "../molecules/ColorPicker";

type EditorBackgroundColorProps = {
	colorSets: ColorSet[];
	colorSet: ColorSet;
	handleColorSet: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorColorSet({ colorSets, colorSet, handleColorSet }: EditorBackgroundColorProps) {

	return (
		<>
			<H2>Farbschema</H2>
			<ColorPicker
				colors={colorSets}
				color={colorSet}
				handleColor={handleColorSet}
			/>
		</>
	);
}
