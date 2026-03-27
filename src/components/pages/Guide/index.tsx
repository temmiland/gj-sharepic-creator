/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { Link } from 'react-router';
import './Guide.scss';

const sections = [
	{
		icon: '🖼️',
		title: 'Vorlage wählen',
		text: 'Wähle unten im Editor eine der Vorlagen aus. Jede Vorlage enthält fertig platzierte Elemente, die du danach beliebig anpassen kannst.',
	},
	{
		icon: '🎨',
		title: 'Farben & Stil',
		text: 'Im Reiter „Hintergrund & Farben" wählst du einen Farbsatz und eine Akzentfarbe. Alle Elemente passen sich automatisch an das Farbschema an.',
	},
	{
		icon: '🖼',
		title: 'Hintergrundbild',
		text: 'Lade ein eigenes Bild hoch. Du kannst Helligkeit, Unschärfe und Position des Bilds steuern – ideal für Fotos aus der Ortsgruppe.',
	},
	{
		icon: '✏️',
		title: 'Elemente bearbeiten',
		text: 'Klicke auf ein Element im Canvas, um es auszuwählen. Dann kannst du es per Drag & Drop verschieben oder im Bereich rechts die Einstellungen ändern.',
	},
	{
		icon: '⌨️',
		title: 'Tastatur-Shortcuts',
		text: (
			<>
				<p>Ausgewählte Elemente lassen sich präzise mit den Pfeiltasten verschieben:</p>
				<ul>
					<li><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> — 1 px</li>
					<li><kbd>Shift</kbd> + Pfeiltaste — 10 px</li>
					<li><kbd>Strg/⌘</kbd> + <kbd>Z</kbd> — Rückgängig</li>
					<li><kbd>Strg/⌘</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd> — Wiederholen</li>
				</ul>
			</>
		),
	},
	{
		icon: '➕',
		title: 'Elemente hinzufügen',
		text: 'Über den Button „Element hinzufügen" kannst du neue Überschriften, Texte, Logos, Pfeile, Piktogramme oder Bilder ergänzen.',
	},
	{
		icon: '👁️',
		title: 'Elemente aus-/einblenden',
		text: 'Jedes Element hat ein Augen-Symbol. Damit kannst du es temporär ausblenden, ohne es zu löschen.',
	},
	{
		icon: '💾',
		title: 'Vorlage speichern & laden',
		text: 'Deine Vorlage lässt sich als JSON exportieren und später wieder importieren. So kannst du verschiedene Varianten behalten oder mit anderen teilen.',
	},
	{
		icon: '📥',
		title: 'SharePic exportieren',
		text: 'Klicke auf „SharePic erstellen", um die Vorschau zu rendern. Mit „Herunterladen" speicherst du das fertige Bild in dreifacher Auflösung (1080 × 1350 px).',
	},
];

export function Guide() {
	return (
		<div className="hdg-guide">
			<div className="hdg-guide__inner">
				<h1>So funktioniert der Editor</h1>
				<p className="hdg-guide__intro">
					Hier findest du einen schnellen Überblick über alle Funktionen des SharePic-Editors.
				</p>

				<ol className="hdg-guide__list">
					{sections.map(({ icon, title, text }) => (
						<li key={title} className="hdg-guide__item">
							<span className="hdg-guide__icon" aria-hidden="true">{icon}</span>
							<div className="hdg-guide__content">
								<h2>{title}</h2>
								{typeof text === 'string' ? <p>{text}</p> : text}
							</div>
						</li>
					))}
				</ol>

				<Link to="/sharepics" className="hdg-guide__cta">
					Zum Editor →
				</Link>
			</div>
		</div>
	);
}
