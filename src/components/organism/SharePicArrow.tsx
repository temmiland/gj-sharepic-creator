type SharePicArrowProps = {
	visible: boolean;
	color: string;
};

export function SharePicArrow({ visible, color }: SharePicArrowProps) {

	return visible && (
		<svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
		<polygon
			points="91.901 49.6605 87.777 54.3235 112.216 75.9385 35.955 75.9385 35.955 82.1635 112.335 82.1635 91.063 106.2145 95.727 110.3395 120.646 82.1635 120.976 82.1635 120.976 81.7925 124.045 78.3215 123.804 78.1085 123.919 77.9785 91.901 49.6605"
			style={{ fill: color }}
		/>
		</svg>
	);
}
