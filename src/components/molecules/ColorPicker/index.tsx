import type { ColorSet, HighlightColor } from '@/types/design-tokens';
import { Input } from '@/components/atoms/Input';
import './ColorPicker.scss';

type ColorPickerProps = {
	colors: HighlightColor[] | ColorSet[];
	color: HighlightColor | ColorSet;
	handleColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ColorPicker({ colors, color, handleColor }: ColorPickerProps) {
	return (
		<div className="color-picker-grid">
			{colors.map((c, i) => (
				<div
					key={`cp-${colors.length}-${i}`}
					className={`color-picker-wrapper${color.name === c.name ? ' active' : ''}`}
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
			))}
		</div>
	);
}
