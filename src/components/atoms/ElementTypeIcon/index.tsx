/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import type { TemplateElementType } from '@/types/template';

export function ElementTypeIcon({ type }: { type: TemplateElementType }) {
	switch (type) {
		case 'heading':
			return (
				<svg width="28" height="22" viewBox="0 0 28 22" fill="none" aria-hidden="true">
					<rect x="0" y="0" width="28" height="6" rx="1.5" fill="currentColor"/>
					<rect x="0" y="9" width="20" height="4" rx="1.5" fill="currentColor" opacity=".6"/>
					<rect x="0" y="16" width="14" height="3" rx="1.5" fill="currentColor" opacity=".35"/>
				</svg>
			);
		case 'text':
			return (
				<svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
					<rect x="0" y="0" width="28" height="3.5" rx="1.5" fill="currentColor"/>
					<rect x="0" y="6.5" width="28" height="3.5" rx="1.5" fill="currentColor"/>
					<rect x="0" y="13" width="22" height="3.5" rx="1.5" fill="currentColor"/>
				</svg>
			);
		case 'logo':
			return (
				<svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
					<circle cx="14" cy="14" r="12.5" stroke="currentColor" strokeWidth="2"/>
					<path d="M8 14h3.5v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
					<path d="M15 10v8M18 10v3.5c0 2.5-1.3 4.5-3 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			);
		case 'arrow':
			return (
				<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
					<path d="M5 21L21 5M21 5H10M21 5V16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
				</svg>
			);
		case 'pictogram':
			return (
				<svg width="22" height="26" viewBox="0 0 22 26" fill="none" aria-hidden="true">
					<circle cx="11" cy="6" r="5" stroke="currentColor" strokeWidth="2"/>
					<path d="M1 24c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
				</svg>
			);
		case 'image':
			return (
				<svg width="28" height="24" viewBox="0 0 28 24" fill="none" aria-hidden="true">
					<rect x="1" y="1" width="26" height="22" rx="2" stroke="currentColor" strokeWidth="2"/>
					<circle cx="20" cy="7" r="2.5" fill="currentColor"/>
					<path d="M1 17l6-7 5 6 4-4.5 11 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
				</svg>
			);
	}
}
