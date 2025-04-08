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

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import './Header.scss';

export default function Header() {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isShrunk, setIsShrunk] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsShrunk(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<header className={`hdg-header ${isMenuOpen ? "hdg-header__menu--open" : ""} ${isShrunk ? 'hdg-header--shrink' : ''}`}>
			<div className="hdg-header__inner">
				<div className="hdg-header__logo">
					<a onClick={() => {
						navigate("/");
						setIsMenuOpen(false);
					}}>
						<img src="./logo.svg" />
					</a>
				</div>
				<button
					onClick={toggleMenu}
					className={`hdg-header__menu-button ${isMenuOpen ? "hdg-header__menu--open" : ""}`}
				>
					<span className="hdg-header__menu-icon" />
				</button>
				{isMenuOpen && (
					<ul className="hdg-header__menu">
						<li className="hdg-header__menu-entry">
							<a onClick={() => {
								navigate("/sharepics");
								setIsMenuOpen(false);
							}}>
								SharePics
							</a>
						</li>
						<li className="hdg-header__menu-entry hdg-header__menu-entry--disabled">
							Story-Overlays
						</li>
						<li className="hdg-header__menu-entry">
							<a
								target="_blank"
								rel="noopener noreferrer"
								href="https://dresden.gj-sachsen.de"
							>
								Unsere Webseite
							</a>
						</li>
					</ul>
				)}
			</div>
		</header>
	);
}
