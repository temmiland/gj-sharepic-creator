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

import './Contact.scss';

export default function Contact() {
	return (
		<div className="hdg-contact">
			<div className="hdg-contact__inner">
				<h1>Kontakt</h1>
				<p>
					Wenn du Fragen, Anregungen oder Feedback hast, kannst du mich gerne kontaktieren.
					<br />
					Ich freue mich über jede Nachricht!
				</p>
				<ol className="hdg-contact__list">
					<a href="https://github.com/temmiland/gj-sharepic-creator/labels/bug" target="_blank" rel="noopener noreferrer">
						<li>
							<img className="hdg-contact__list-icon" src="./pictograms/Appell.svg" />
							<p>Fehler</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" />
						</li>
					</a>
					<a href="https://github.com/temmiland/gj-sharepic-creator/labels/enhancement" target="_blank" rel="noopener noreferrer">
						<li>
							<img className="hdg-contact__list-icon" src="./pictograms/Ackerpflanze.svg" />
							<p>Funktionswünsche</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" />
						</li>
					</a>
					<a href="mailto:gj@temmi.land">
						<li>
							<img className="hdg-contact__list-icon" src="./pictograms/Sprechblase.svg" />
							<p>Sonstiges</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" />
						</li>
					</a>
					<a href="https://instagram.com/temmiland" target="_blank" rel="noopener noreferrer">
						<li>
							<img className="hdg-contact__list-icon" src="./pictograms/Handy.svg" />
							<p>Instagram</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" />
						</li>
					</a>
					<a href="https://temmi.land" target="_blank" rel="noopener noreferrer">
						<li>
							<img className="hdg-contact__list-icon" src="./pictograms/Computer.svg" />
							<p>Webseite</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" />
						</li>
					</a>
					<a href="https://instagram.com/gruenejugend_dresden" target="_blank" rel="noopener noreferrer">
						<li>
							<img className="hdg-contact__list-icon" src="./pictograms/Handy.svg" />
							<p>GJ Dresden – Instagram</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" />
						</li>
					</a>
					<a href="https://dresden.gj-sachsen.de" target="_blank" rel="noopener noreferrer">
						<li>
							<img className="hdg-contact__list-icon" src="./pictograms/Computer.svg" />
							<p>GJ Dresden – Webseite</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" />
						</li>
					</a>
				</ol>
			</div>
		</div>
	);
}
