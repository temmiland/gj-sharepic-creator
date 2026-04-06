/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useEffect, useRef } from "react";
import type { ColorSet, BackgroundPosition } from '@/types/design-tokens';
import { colorSets } from '@/constants/colors';
import { useSharePic } from '@/context/SharePicContext';
import './SharePicCanvas.scss';

type SharePicCanvasProps = {
	backgroundImageUploaded: boolean;
	backgroundImage: string | null;
	backgroundPosition: BackgroundPosition;
	backgroundBlur: number;
	backgroundBrightness: number;
	colorSet: ColorSet;
	handleColorSet: (colorSet: ColorSet) => void;
	children: React.ReactNode;
};

function calculateImageBrightness(image: HTMLImageElement): number {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");

	if (!ctx) {
		throw new Error("Canvas context not available");
	}

	canvas.width = image.width;
	canvas.height = image.height;
	ctx.drawImage(image, 0, 0, image.width, image.height);

	const imageData = ctx.getImageData(0, 0, image.width, image.height);
	const pixels = imageData.data;

	let totalBrightness = 0;
	let pixelCount = 0;

	for (let i = 0; i < pixels.length; i += 4) {
		const r = pixels[i];
		const g = pixels[i + 1];
		const b = pixels[i + 2];
		totalBrightness += 0.2126 * r + 0.7152 * g + 0.0722 * b;
		pixelCount++;
	}

	return totalBrightness / pixelCount;
}

function calculateColorSetOnImageBrightness(base64Image: string): Promise<ColorSet> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.src = base64Image;

		image.onload = () => {
			const brightness = calculateImageBrightness(image);
			if (brightness < 180) {
				resolve(colorSets.find(cS => cS.name === "Black") ?? colorSets[6]);
			} else {
				resolve(colorSets.find(cS => cS.name === "White") ?? colorSets[5]);
			}
		};

		image.onerror = () => {
			reject(new Error("Failed to load base64 image"));
		};
	});
}

export function SharePicCanvas({ backgroundImageUploaded, backgroundImage, backgroundPosition, backgroundBlur, backgroundBrightness, colorSet, handleColorSet, children }: SharePicCanvasProps) {

	const handleColorSetRef = useRef(handleColorSet);
	handleColorSetRef.current = handleColorSet;

	useEffect(() => {
		if (!backgroundImageUploaded || !backgroundImage) return;
		calculateColorSetOnImageBrightness(backgroundImage)
			.then(colorSet => handleColorSetRef.current(colorSet))
			.catch(() => {});
	}, [backgroundImage, backgroundImageUploaded]);

	const { canvasConfig } = useSharePic();
	const { transparentBackground, width, height } = canvasConfig;

	// Fixed overflow so blur doesn't change the visible zoom level of the background image.
	// 80px is sufficient for blur values up to ~20px.
	const blurOverflow = 80;
	const imgWidth = width + blurOverflow * 2;
	const imgHeight = height + blurOverflow * 2;

	return (
		<div
			id='sharepic-download'
			className={`sharepic-canvas${transparentBackground ? ' sharepic-canvas--transparent' : ''}`}
			style={{
				padding: 0,
				margin: 0,
				position: 'relative',
				width: `${width}px`,
				height: `${height}px`,
				overflow: 'visible',
				background: transparentBackground ? 'transparent' : colorSet.backgroundColor,
				zIndex: 0,
			}}
		>
			{backgroundImage && (
				<div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1 }}>
					<img
						src={backgroundImage}
						style={{
							position: 'absolute',
							top: `-${blurOverflow}px`,
							left: `-${blurOverflow}px`,
							width: `${imgWidth}px`,
							height: `${imgHeight}px`,
							objectFit: 'cover',
							objectPosition: backgroundPosition.value,
							filter: `blur(${backgroundBlur}px) brightness(${backgroundBrightness}%)`,
						}}
					/>
				</div>
			)}
			{children}
		</div>
	);
}
