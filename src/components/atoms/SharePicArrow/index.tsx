/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import './SharePicArrow.scss';

type SharePicArrowProps = {
	visible: boolean;
	color: string;
	size?: number;
};

export function SharePicArrow({ visible, color, size = 50 }: SharePicArrowProps) {

	return visible && (
		<svg className="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" style={{ width: `${size}px` }}>
		<polygon
			points="91.901 49.6605 87.777 54.3235 112.216 75.9385 35.955 75.9385 35.955 82.1635 112.335 82.1635 91.063 106.2145 95.727 110.3395 120.646 82.1635 120.976 82.1635 120.976 81.7925 124.045 78.3215 123.804 78.1085 123.919 77.9785 91.901 49.6605"
			style={{ fill: color }}
		/>
		</svg>
	);
}
