/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import './Contact.scss';

export function Contact() {
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
					<li>
						<a href="https://github.com/temmiland/gj-sharepic-creator/labels/bug" target="_blank" rel="noopener noreferrer">
							<img className="hdg-contact__list-icon" src="./pictograms/Appell.svg" alt="" />
							<p>Fehler</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" alt="" />
						</a>
					</li>
					<li>
						<a href="https://github.com/temmiland/gj-sharepic-creator/labels/enhancement" target="_blank" rel="noopener noreferrer">
							<img className="hdg-contact__list-icon" src="./pictograms/Ackerpflanze.svg" alt="" />
							<p>Funktionswünsche</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" alt="" />
						</a>
					</li>
					<li>
						<a href="mailto:gj@temmi.land">
							<img className="hdg-contact__list-icon" src="./pictograms/Sprechblase.svg" alt="" />
							<p>Sonstiges</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" alt="" />
						</a>
					</li>
					<li>
						<a href="https://instagram.com/temmiland" target="_blank" rel="noopener noreferrer">
							<img className="hdg-contact__list-icon" src="./pictograms/Handy.svg" alt="" />
							<p>Instagram</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" alt="" />
						</a>
					</li>
					<li>
						<a href="https://temmi.land" target="_blank" rel="noopener noreferrer">
							<img className="hdg-contact__list-icon" src="./pictograms/Computer.svg" alt="" />
							<p>Webseite</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" alt="" />
						</a>
					</li>
					<li>
						<a href="https://instagram.com/gruenejugend_sachsen" target="_blank" rel="noopener noreferrer">
							<img className="hdg-contact__list-icon" src="./pictograms/Handy.svg" alt="" />
							<p>GJ Sachsen – Instagram</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" alt="" />
						</a>
					</li>
					<li>
						<a href="https://gj-sachsen.de" target="_blank" rel="noopener noreferrer">
							<img className="hdg-contact__list-icon" src="./pictograms/Computer.svg" alt="" />
							<p>GJ Sachsen – Webseite</p>
							<img className="hdg-contact__list-arrow" src="./arrow.svg" alt="" />
						</a>
					</li>
				</ol>
			</div>
		</div>
	);
}
