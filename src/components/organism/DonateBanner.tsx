/******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     https://gjsharepics.temmi.land/license
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

import { useState, useEffect } from 'react';
import './DonateBanner.scss';

export default function DonateBanner() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const dismissedAt = localStorage.getItem('donateBannerDismissed');
		if (!dismissedAt) {
			setIsVisible(true);
		} else {
			const dismissedTime = parseInt(dismissedAt, 10);
			const now = Date.now();
			const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 Tage in ms
			if (now - dismissedTime > threeDays) {
				setIsVisible(true);
				localStorage.removeItem('donateBannerDismissed');
			}
		}
	}, []);

	const handleClose = () => {
		setIsVisible(false);
		localStorage.setItem('donateBannerDismissed', Date.now().toString());
	};

	if (!isVisible) return null;

	return (
		<div className="donate-banner">
			<div className="donate-banner__content">
				<p className="donate-banner__text">
					gjshare.pics wird zu gjsharepics.temmi.land. Die Weiterleitung funktioniert noch einige Tage.
				</p>
				<a
					href="https://buymeacoffee.com/temmiland"
					target="_blank"
					rel="noopener noreferrer"
					className="donate-banner__link"
				>
					Jetzt spenden
				</a>
			</div>
			<button
				className="donate-banner__close"
				onClick={handleClose}
				aria-label="Banner schließen"
			>
				×
			</button>
		</div>
	);
}
