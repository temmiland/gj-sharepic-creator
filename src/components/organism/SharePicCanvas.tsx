import { useEffect } from "react";
import { colorSets } from "../../constants/colors";

type SharePicCanvasProps = {
	backgroundImage: string | null;
	backgroundPosition: BackgroundPosition;
	backgroundBlur: number;
	colorSet: ColorSet;
	handleColorSet: (colorSet: ColorSet) => void;
	children: React.ReactNode;
};

export function SharePicCanvas({ backgroundImage, backgroundPosition, backgroundBlur, colorSet, handleColorSet, children }: SharePicCanvasProps) {

	useEffect(() => {
		const calculateAndSetColorSet = async () => {
			if (backgroundImage) {
				try {
					const colorSet = await calculateColorSetOnImageBrightness(backgroundImage);
					handleColorSet(colorSet);
				} catch (error) {
					console.error("Fehler beim Berechnen des Farbsatzes:", error);
				}
			}
		};

		calculateAndSetColorSet();
	}, [backgroundImage]);

	const calculateColorSetOnImageBrightness = (base64Image: string): Promise<ColorSet> => {
		const calculateImageBrightness = (image: HTMLImageElement): number => {
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

				const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
				totalBrightness += brightness;
				pixelCount++;
			}

			return totalBrightness / pixelCount;
		};

		return new Promise((resolve, reject) => {
			const image = new Image();
			image.src = base64Image;
			console.log(base64Image);


			image.onload = () => {
				const brightness = calculateImageBrightness(image);

				if (brightness < 180) {
					resolve(colorSets.find(cS => cS.name === "Black") || colorSets[6]);
				} else {
					resolve(colorSets.find(cS => cS.name === "White") || colorSets[5]);
				}
			};

			image.onerror = () => {
				reject(new Error("Failed to load base64 image"));
			};
		});
	};

	return (
		<div id='sharepic-download' className='sharepic-canvas' style={{
				padding: 0,
				margin: 0,
				position: 'relative',
				backgroundColor: colorSet.backgroundColor,
				zIndex: 0,
		}}>
			{backgroundImage && (
			<img
				src={backgroundImage}
				style={{
					position: 'absolute',
					top: '-20px',
					left: '-20px',
					width: '400px',
					height: '490px',
					objectFit: 'cover',
					objectPosition: backgroundPosition.value,
					filter: `blur(${backgroundBlur}rem)`,
					zIndex: 1,
				}}
			/>
		)}
			{children}
		</div>
	);
}
