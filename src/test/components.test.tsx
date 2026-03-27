/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/atoms/Button';
import { Accordion } from '@/components/molecules/Accordion';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary';

// ── Button ────────────────────────────────────────────────────────────────────

describe('Button', () => {
	it('renders children', () => {
		render(<Button onClick={() => {}}>Klick mich</Button>);
		expect(screen.getByRole('button', { name: 'Klick mich' })).toBeInTheDocument();
	});

	it('calls onClick when clicked', () => {
		const handler = vi.fn();
		render(<Button onClick={handler}>Test</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('renders default children when none provided', () => {
		render(<Button onClick={() => {}}>Buttontext</Button>);
		expect(screen.getByRole('button')).toHaveTextContent('Buttontext');
	});
});

// ── Accordion ─────────────────────────────────────────────────────────────────

describe('Accordion', () => {
	it('renders summary text', () => {
		render(<Accordion summary="Abschnitt"><p>Inhalt</p></Accordion>);
		expect(screen.getByRole('button', { name: 'Abschnitt' })).toBeInTheDocument();
	});

	it('starts closed (aria-expanded=false)', () => {
		render(<Accordion summary="Test"><p>Content</p></Accordion>);
		expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens when summary button is clicked', () => {
		render(<Accordion summary="Test"><p>Content</p></Accordion>);
		const btn = screen.getByRole('button');
		fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-expanded', 'true');
	});

	it('closes again on second click (toggle)', () => {
		render(<Accordion summary="Test"><p>Content</p></Accordion>);
		const btn = screen.getByRole('button');
		fireEvent.click(btn);
		fireEvent.click(btn);
		expect(btn).toHaveAttribute('aria-expanded', 'false');
	});

	it('renders children content', () => {
		render(<Accordion summary="Test"><p>Inhalt hier</p></Accordion>);
		expect(screen.getByText('Inhalt hier')).toBeInTheDocument();
	});
});

// ── ErrorBoundary ─────────────────────────────────────────────────────────────

function BrokenComponent(): never {
	throw new Error('Test-Fehler');
}

describe('ErrorBoundary', () => {
	it('renders children when there is no error', () => {
		render(
			<ErrorBoundary>
				<p>Alles gut</p>
			</ErrorBoundary>
		);
		expect(screen.getByText('Alles gut')).toBeInTheDocument();
	});

	it('renders default fallback UI when a child throws', () => {
		// Suppress the expected console.error from React's error boundary
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<ErrorBoundary>
				<BrokenComponent />
			</ErrorBoundary>
		);
		expect(screen.getByRole('alert')).toBeInTheDocument();
		expect(screen.getByText('Etwas ist schiefgelaufen.')).toBeInTheDocument();
		spy.mockRestore();
	});

	it('renders custom fallback when provided and a child throws', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<ErrorBoundary fallback={<p>Eigene Fehlermeldung</p>}>
				<BrokenComponent />
			</ErrorBoundary>
		);
		expect(screen.getByText('Eigene Fehlermeldung')).toBeInTheDocument();
		spy.mockRestore();
	});

	it('shows the error message in the fallback UI', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		render(
			<ErrorBoundary>
				<BrokenComponent />
			</ErrorBoundary>
		);
		expect(screen.getByText('Test-Fehler')).toBeInTheDocument();
		spy.mockRestore();
	});

	it('recovers when retry button is clicked', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		let shouldThrow = true;
		function MaybeThrow() {
			if (shouldThrow) throw new Error('Fehler');
			return <p>Erholt</p>;
		}
		const { rerender } = render(
			<ErrorBoundary>
				<MaybeThrow />
			</ErrorBoundary>
		);
		expect(screen.getByRole('alert')).toBeInTheDocument();

		shouldThrow = false;
		fireEvent.click(screen.getByRole('button', { name: 'Erneut versuchen' }));
		rerender(
			<ErrorBoundary>
				<MaybeThrow />
			</ErrorBoundary>
		);
		expect(screen.getByText('Erholt')).toBeInTheDocument();
		spy.mockRestore();
	});
});
