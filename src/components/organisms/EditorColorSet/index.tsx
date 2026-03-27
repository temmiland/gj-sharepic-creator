import type { ColorSet } from '@/types/design-tokens';
import { ColorPicker } from '@/components/molecules/ColorPicker';

type EditorColorSetProps = {
	colorSets: ColorSet[];
	colorSet: ColorSet;
	handleColorSet: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function EditorColorSet({ colorSets, colorSet, handleColorSet }: EditorColorSetProps) {

	return (
		<>
			<h2>Farbschema</h2>
			<ColorPicker
				colors={colorSets}
				color={colorSet}
				handleColor={handleColorSet}
			/>
		</>
	);
}
