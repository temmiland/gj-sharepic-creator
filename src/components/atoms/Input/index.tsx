/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import './Input.scss';

type InputProps = {
	type: React.HTMLInputTypeAttribute | undefined;
	name?: string;
	accept?: string;
	checked?: boolean;
	value?: string | number;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onFileDelete?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function Input({ type, name, accept, checked, value, onChange, onFileDelete }: InputProps) {
	return type === "file"
		? (
			<div className="file-upload">
				<label
					htmlFor="file-upload"
				>
					Datei auswählen
				</label>
				<input
					id="file-upload"
					type={type}
					name={name}
					accept={accept}
					checked={checked}
					value={value}
					onChange={onChange}
				/>
				<button
					onClick={onFileDelete}
				>
					Entfernen
				</button>
			</div>
		)
		: (
			<input
				type={type}
				name={name}
				accept={accept}
				checked={checked}
				value={value}
				onChange={onChange}
			/>
		);
}
