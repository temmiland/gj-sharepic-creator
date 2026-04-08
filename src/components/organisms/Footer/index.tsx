/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useNavigate } from 'react-router';
import './Footer.scss';

export function Footer() {
	const navigate = useNavigate();
	return (
		<footer className="hdg-footer">
			<div className="hdg-footer__inner">
				<p>
					Made with ♥︎ by <a target="_blank" rel="noopener noreferrer" href="https://temmi.land">Temmi Pietsch</a>
					<br/>
					v1.0.6  ✦ <a target="_blank" rel="noopener noreferrer" href="https://github.com/temmiland/gj-sharepic-creator">GitHub</a> ✦ <a href="/source-code.zip" download="gj-sharepic-creator-source.zip">Quellcode</a> ✦ <a onClick={() => navigate("/kontakt")}>Kontakt</a> ✦ <a onClick={() => navigate("/datenschutz")}>Datenschutz</a> ✦ <a onClick={() => navigate("/impressum")}>Impressum</a>
				</p>
			</div>
		</footer>
	);
}
