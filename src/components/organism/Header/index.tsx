import { useNavigate } from 'react-router';
import './Header.scss';
import { useState } from 'react';

type HeaderProps = {

};

export function Header({}: HeaderProps) {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	return (
		<header className={`${isMenuOpen && ("active")}`}>
			<div className="inner">
				<div className="logo">
					<a onClick={() => navigate("/")}>
						<img src="./logo.svg" />
					</a>
				</div>
				<button onClick={toggleMenu} className={ `menu ${isMenuOpen && ("active")}` }>
					<span className="icon" />
				</button>
				{isMenuOpen && (
					<ul className="overlay">
						<li><a>SharePics</a></li>
						<li><a>Story-Overlays</a></li>
						<li><a>Unsere Webseite</a></li>
					</ul>
				)}
			</div>
		</header>
	);
}
