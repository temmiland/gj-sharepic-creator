import Input from '../atoms/Input';
import './ColorPicker.scss';

type ColorPickerProps = {
	colors: HighlightColor[] | ColorSet[];
	color: HighlightColor | ColorSet;
	handleColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ColorPicker({ colors, color, handleColor }: ColorPickerProps) {
	return colors.map((c) => (
				<div
					key={'highlightColor' + c.name}
					className="color-picker-wrapper"
					style={{ backgroundColor: c.backgroundColor }}
				>
					<label>
						<Input
							type="radio"
							value={c.name}
							checked={color.name === c.name}
							onChange={handleColor}
						/>
					</label>
				</div>
	));
}

export default ColorPicker;
