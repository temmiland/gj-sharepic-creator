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

import { useNavigate } from 'react-router';
import './Imprint.scss';

export default function Imprint() {
	const navigate = useNavigate();
	return (
		<div className="hdg-imprint">
			<div className="hdg-imprint__inner">
				<h1>Impressum</h1>
				<h2>Anbieter</h2>
				<p>Temmi Pietsch<br/>c/o Postflex #7561<br/>Emsdettener Str. 10<br/>D-48268 Greven<br/>Keine Pakete oder Päckchen - Annahme wird verweigert!</p>
				<h2>Kontakt</h2>
				<p>E-Mail: welcome@temmi.land</p>
				<p>Wir sind weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren teilzunehmen.</p>
				<h2>Datenschutz</h2>
				<p>Wir wissen, dass Dir Datenschutz wichtig ist. Daher legen wir großen Wert auf den Schutz Deiner persönlichen Daten. Weitere Informationen findest Du in unserer <a onClick={ () => navigate("/datenschutz")}>Datenschutzerklärung</a>.</p>
				<h2>Haftung für Links</h2>
				<p>Unser Angebot enthält Links zu externen Webseiten Dritter, deren Inhalte wir nicht beeinflussen können. Aus diesem Grund übernehmen wir keine Haftung für diese fremden Inhalte. Verantwortlich für die Inhalte der verlinkten Seiten sind ausschließlich deren jeweilige Anbieter oder Betreiber. Zum Zeitpunkt der Verlinkung haben wir die verlinkten Seiten auf mögliche Rechtsverstöße überprüft und konnten keine rechtswidrigen Inhalte feststellen. Eine ständige inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Hinweise auf Rechtsverletzungen nicht zumutbar. Sollten uns Rechtsverletzungen bekannt werden, werden wir derartige Links umgehend entfernen.</p>
			</div>
		</div>
	);
}
