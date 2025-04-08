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

import Header from '../../organism/Header';
import Footer from '../../organism/Footer';
import './Route.scss';

type RouteProps =  {
	children: React.ReactNode
	| React.ReactElement<any, string | React.JSXElementConstructor<any>>
	| React.ReactPortal
	| boolean
	| null
	| undefined
};

export default function Route({children}: RouteProps) {
	return (
		<>
			<Header />
			<div className="hdg-route">
				{children}
			</div>
			<Footer />
		</>
	);
}
