import { useEffect } from "react";
import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicText } from "../organism/SharePicText";
import { SharePicPictogram } from "../organism/SharePicPictogram";
import { colorSets, highlightColors } from "../../constants/colors";
import { SharePicContent } from "../organism/SharePicContent";
import { SharePicCanvas } from "../organism/SharePicCanvas";
import { backgroundPositions } from "../../constants/background-positions";

export default function SharePicTextOnly() {

	const { state, dispatch } = useSharePic();

	useEffect(() => {
		dispatch({
			type: "INITIALIZE",
			payload: {
				localGroup: "Dresden",
				logoVisible: false,
				arrowVisible: true,
				headingTopOrBottom: true,
				heading: [],
				text: ["Ziel waren stets Gay Bars in Greenwich Village, einem Stadtteil New Yorks. Dieses Mal lehnte sich die Community aber gegen die Polizeigewalt auf. Die Polizisten verbarrikadierten sich in der Bar, während Hunderte von Menschen protestierten. Die Aufstände vor dem Stonewall Inn waren eines der ersten Ereignisse, bei dem Lesben, Schwule, trans* Personen und andere Gruppen gemeinsam kämpften!"],
				highlightColor: highlightColors[0],
				colorSet: colorSets[2],
				backgroundImage: null,
				backgroundImageUploaded: false,
				backgroundPosition: backgroundPositions[0],
				backgroundBlur: 0.2,
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
				positionValue={5}
				topOrBottom={state.headingTopOrBottom}
			>
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
