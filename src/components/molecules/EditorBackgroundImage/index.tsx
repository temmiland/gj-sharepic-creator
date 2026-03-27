/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { Input } from '@/components/atoms/Input';
import { scaleImageToDataUrl } from '@/utils/image-scale';

type EditorBackgroundImageProps = {
	handleBackgroundImage: (base64File: string) => void;
	handleFileDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function EditorBackgroundImage({ handleBackgroundImage, handleFileDelete }: EditorBackgroundImageProps) {

	const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		// Scale to 3× the 360×450 canvas so the image stays sharp in the 3× export,
		// while drastically reducing memory usage for large photos.
		const { dataUrl } = await scaleImageToDataUrl(file, 1080, 1350);
		handleBackgroundImage(dataUrl);
	};

	return (
		<>
			<h2>Hintergrundbild</h2>
			<Input
				type="file"
				accept="image/*"
				onChange={handleImageUpload}
				onFileDelete={handleFileDelete}
			/>
		</>
	);
}
