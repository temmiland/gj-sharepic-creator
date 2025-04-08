/******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     https://gjshare.pics/license
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 *****************************************************************************/

import './Footer.scss';

export default function Footer() {
	return (
		<footer className="hdg-footer">
			<div className="hdg-footer__inner">
				<p>
					Made with ♥︎ by <a href="https://temmi.land">Temmi Pietsch</a>
					<br/>
					v0.9.0  ✦ <a href="https://github.com/temmiland/gj-sharepic-creator">GitHub</a> ✦ <a href="./kontakt">Kontakt</a> ✦ <a href="./datenschutz">Datenschutz</a> ✦ <a href="./impressum">Impressum</a>
				</p>
			</div>
		</footer>
	);
}
