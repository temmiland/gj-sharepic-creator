import React from 'react';
import Input from '../atoms/Input';
import './ColorPicker.scss';

type ColorPickerProps = {
	colors: HighlightColor[] | ColorSet[];
	color: HighlightColor | ColorSet;
	handleColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function ColorPicker({ colors, color, handleColor }: ColorPickerProps) {
	return colors.map((c, i) => (
		<React.Fragment key={`cp-${colors.length}-${i}`}>
				<div
					className="color-picker-wrapper"
					style={{ background: c.backgroundColor }}
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
				{ i === 6 ? <br /> : ''}
			</React.Fragment>
	));
}

export default ColorPicker;
