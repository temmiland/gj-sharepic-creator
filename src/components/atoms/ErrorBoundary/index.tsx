/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { Component, type ReactNode } from 'react';
import './ErrorBoundary.scss';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	override render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}
			return (
				<div role="alert" className="error-boundary">
					<h2>Etwas ist schiefgelaufen.</h2>
					<p>{this.state.error?.message}</p>
					<button type="button" onClick={() => this.setState({ hasError: false, error: null })}>
						Erneut versuchen
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}
