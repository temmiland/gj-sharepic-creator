import { useEffect } from "react";
import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicHeading } from "../organism/SharePicHeading";
import { SharePicText } from "../organism/SharePicText";
import { SharePicPictogram } from "../organism/SharePicPictogram";
import { colorSets, highlightColors } from "../../constants/colors";
import { SharePicContent } from "../organism/SharePicContent";
import { SharePicCanvas } from "../organism/SharePicCanvas";
import { backgroundPositions } from "../../constants/background-positions";

export default function SharePicEvent() {

	const { state, dispatch } = useSharePic();

	useEffect(() => {
		dispatch({
			type: "INITIALIZE",
			payload: {
				localGroup: "Leipzig",
				logoVisible: true,
				arrowVisible: false,
				headingTopOrBottom: true,
				heading: ["*Weihnachts-", "feier"],
				text: ["%Mit leckeren Plätzchen, Punsch und Pub-Quiz feiern wir die Weihnachtszeit.%", "%🗓️ Dienstag, 12.12.2025 – 18:30 Uhr%", "%📍 Grünen Quartier, Heinrichstraße 9, Leipzig%"],
				highlightColor: highlightColors[0],
				colorSet: colorSets[5],
				backgroundImage: "./event_bg.jpg",
				backgroundImageUploaded: false,
				backgroundPosition: backgroundPositions[0],
				backgroundBlur: 0,
				backgroundBrightness: 100,
				pictogram: null,
				pictogramPosition: { x: 175, y: 225 },
			}
		});
	}, []);

	return(
		<SharePicCanvas
			backgroundImageUploaded={state.backgroundImageUploaded}
			backgroundImage={state.backgroundImage}
			backgroundPosition={state.backgroundPosition}
			backgroundBlur={state.backgroundBlur}
			backgroundBrightness={state.backgroundBrightness}
			colorSet={state.colorSet}
			handleColorSet={(colorSet: ColorSet) => dispatch({
				type: "SET_COLOR_SET",
				payload: colorSet
			})}
		>
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
				<SharePicText
					multiLineText={state.text}
					colorSet={state.colorSet}
					highlightColor={state.highlightColor}
				/>
			</SharePicContent>
			<SharePicPictogram
				pictogram={state.pictogram}
				position={state.pictogramPosition}
				colorSet={state.colorSet}
			/>
		</SharePicCanvas>
	);
}
