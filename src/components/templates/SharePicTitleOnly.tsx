import { useEffect } from "react";
import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicContent } from "../organism/SharePicContent";
import { SharePicHeading } from "../organism/SharePicHeading";
import { SharePicPictogram } from "../organism/SharePicPictogram";
import { colorSets, highlightColors } from "../../constants/colors";
import { pictograms } from "../../constants/pictograms";

export default function SharePicTitleOnly() {

	const { state, dispatch } = useSharePic();

	useEffect(() => {
		dispatch({
			type: "INITIALIZE",
			payload: {
				localGroup: "Dresden",
				logoVisible: true,
				arrowVisible: true,
				headingTopOrBottom: false,
				heading: ["*Menschen", "retten statt", "Abschottung!"],
				text: [],
				highlightColor: highlightColors[0],
				colorSet: colorSets[4],
				backgroundImage: null,
				pictogram: pictograms.find(pictogram => pictogram.name == 'Banner') as Pictogram,
				pictogramPosition: { x: 75, y: 50 },
			}
		});
	}, []);

	useEffect(() => {
		const calculateAndSetColorSet = async () => {
			if (state.backgroundImage) {
				try {
					const colorSet = await calculateColorSetOnImageBrightness(state.backgroundImage);
					dispatch({ type: "SET_COLOR_SET", payload: colorSet });
				} catch (error) {
					console.error("Fehler beim Berechnen des Farbsatzes:", error);
				}
			}
		};

		calculateAndSetColorSet();
	}, [state.backgroundImage, dispatch]);

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

	return(
		<div className='sharepic-canvas' style={{
				background: state.backgroundImage ? `url(${state.backgroundImage})` : state.colorSet.backgroundColor,
				backgroundSize: state.backgroundImage ? `cover` : "none",
				backgroundPosition: state.backgroundImage ? `cover` : "none"
		}}>
			<SharePicLogo
				localGroup={state.localGroup}
				visible={state.logoVisible}
				color={state.colorSet.accentColor}
			/>
			<SharePicArrow
				visible={state.arrowVisible}
				color={state.colorSet.accentColor}
			/>
			<SharePicContent
				positionValue={7.5}
				topOrBottom={state.headingTopOrBottom}
			>
				<SharePicHeading
					multiLineText={state.heading}
					colorSet={state.colorSet}
					highlightColor={state.highlightColor}
					fontSize={3.75}
				/>
			</SharePicContent>
			<SharePicPictogram
				pictogram={state.pictogram}
				position={state.pictogramPosition}
				colorSet={state.colorSet}
			/>
		</div>
	);
}
