/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { SharePicProvider, useSharePic } from '@/context/SharePicContext';

// Minimal consumer that exposes position of the first element and lets tests
// select it and fire keyboard events.
function TestConsumer() {
	const { state, dispatch } = useSharePic();
	const el = state.elements[0];
	return (
		<div>
			<span data-testid="x">{el?.x}</span>
			<span data-testid="y">{el?.y}</span>
			<span data-testid="selected">{state.selectedElementId ?? 'none'}</span>
			<button
				onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: el?.id ?? null })}
			>
				select
			</button>
			<button
				onClick={() => dispatch({ type: 'SELECT_ELEMENT', payload: null })}
			>
				deselect
			</button>
		</div>
	);
}

function renderWithProvider() {
	render(
		<SharePicProvider>
			<TestConsumer />
		</SharePicProvider>
	);
}

describe('Arrow key navigation', () => {
	it('moves selected element left by 1px on ArrowLeft', () => {
		renderWithProvider();
		const initialX = Number(screen.getByTestId('x').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowLeft' });
		});

		expect(Number(screen.getByTestId('x').textContent)).toBe(initialX - 1);
	});

	it('moves selected element right by 1px on ArrowRight', () => {
		renderWithProvider();
		const initialX = Number(screen.getByTestId('x').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowRight' });
		});

		expect(Number(screen.getByTestId('x').textContent)).toBe(initialX + 1);
	});

	it('moves selected element up by 1px on ArrowUp', () => {
		renderWithProvider();
		const initialY = Number(screen.getByTestId('y').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowUp' });
		});

		expect(Number(screen.getByTestId('y').textContent)).toBe(initialY - 1);
	});

	it('moves selected element down by 1px on ArrowDown', () => {
		renderWithProvider();
		const initialY = Number(screen.getByTestId('y').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowDown' });
		});

		expect(Number(screen.getByTestId('y').textContent)).toBe(initialY + 1);
	});

	it('moves 10px with Shift+ArrowRight', () => {
		renderWithProvider();
		const initialX = Number(screen.getByTestId('x').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowRight', shiftKey: true });
		});

		expect(Number(screen.getByTestId('x').textContent)).toBe(initialX + 10);
	});

	it('moves 10px with Shift+ArrowUp', () => {
		renderWithProvider();
		const initialY = Number(screen.getByTestId('y').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowUp', shiftKey: true });
		});

		expect(Number(screen.getByTestId('y').textContent)).toBe(initialY - 10);
	});

	it('does nothing when no element is selected', () => {
		renderWithProvider();
		const initialX = Number(screen.getByTestId('x').textContent);
		// ensure nothing is selected
		expect(screen.getByTestId('selected').textContent).toBe('none');

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowRight' });
		});

		expect(Number(screen.getByTestId('x').textContent)).toBe(initialX);
	});

	it('does nothing when deselected after prior selection', () => {
		renderWithProvider();
		const initialX = Number(screen.getByTestId('x').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));
		fireEvent.click(screen.getByRole('button', { name: 'deselect' }));

		act(() => {
			fireEvent.keyDown(document, { key: 'ArrowRight' });
		});

		expect(Number(screen.getByTestId('x').textContent)).toBe(initialX);
	});

	it('does not move when focus is on an INPUT', () => {
		renderWithProvider();
		const initialX = Number(screen.getByTestId('x').textContent);
		fireEvent.click(screen.getByRole('button', { name: 'select' }));

		const input = document.createElement('input');
		document.body.appendChild(input);
		act(() => {
			fireEvent.keyDown(input, { key: 'ArrowRight' });
		});
		document.body.removeChild(input);

		expect(Number(screen.getByTestId('x').textContent)).toBe(initialX);
	});
});
