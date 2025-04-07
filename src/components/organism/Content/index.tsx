import { useEffect, useRef } from 'react';
import './Content.scss';
import { useNavigate } from 'react-router';

type ContentProps = {

};

export function Content({}: ContentProps) {

	const innerRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	const scrollSpeed = 5;

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			if (innerRef.current) {
				innerRef.current.style.transform = `translateX(-${scrollPosition / scrollSpeed}px)`;
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
		window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div className="hdg-content">
			<div className="hdg-hero">
				<div className="__inner">
					<h1>Willkommen</h1>
					<p>Als <b>GRÜNE JUGEND Dresden</b> erstellen wir regelmäßig Beiträge für Instagram. Ob Stories oder SharePics – die Erstellung ist oft mühsam, und nicht jedes unserer Mitglieder ist fit im Umgang mit Bildbearbeitungsprogrammen. Deshalb haben wir die Standardvorlagen des Corporate Designs von 2024 in eine Webanwendung gegossen und ermöglichen so unseren Mitgliedern die einfache Erstellung von Inhalten für Instagram.</p>
					<div className="__buttons">
						<div className="__button">
							<button onClick={() => navigate("/sharepic")}>SharePics erstellen</button>
						</div>
						<div className="__button">
							<button disabled>Story-Overlay erstellen </button>
							<span style={{ fontFamily: "'Wix Madefor Display', sans-serif", fontSize: '1.5rem', color: '#a9a9a9', marginLeft: '1rem', fontWeight: '700', background: '#fff', borderRadius: 20, padding: '0.5rem 1rem', display: 'inline-block' }}>
								bald verfügbar
							</span>
						</div>
					</div>
				</div>
			</div>
			<div className="hdg-image-carousel" ref={innerRef}>
				<div className="__inner">
					<img src="./examples/gj-sharepic-4.png" style={{width: '32rem', height: '40rem'}} />
					<img src="./examples/gj-sharepic-2.png" style={{width: '32rem', height: '40rem'}} />
					<img src="./examples/gj-sharepic-3.png" style={{width: '32rem', height: '55rem', objectFit: 'cover'}} />
					<img src="./examples/gj-sharepic-5.png" style={{width: '32rem', height: '40rem'}} />
					<img src="./examples/gj-sharepic-1.png" style={{width: '32rem', height: '40rem'}} />
				</div>
			</div>
		</div>
	);
}
