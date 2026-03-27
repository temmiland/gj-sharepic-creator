/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import './SharePicLogo.scss';

type SharePicLogoProps = {
	localGroup: string;
	visible: boolean;
	color: string;
};

export function SharePicLogo({ localGroup, visible, color }: SharePicLogoProps) {

	return visible && (
		<div className="logo-wrapper">
			<p style={{ color }} className='gj-logo'>
				Grüne<br /><span>Jugend</span>
			</p>
			<p style={{ color }} className='ortsgruppe'>
				{localGroup || " "}
			</p>
		</div>
	);
}
