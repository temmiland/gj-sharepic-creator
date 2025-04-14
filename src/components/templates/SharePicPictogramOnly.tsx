import { useEffect } from "react";
import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicPictogram } from "../organism/SharePicPictogram";
import { colorSets, highlightColors } from "../../constants/colors";
import { pictograms } from "../../constants/pictograms";
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
				text: [],
				highlightColor: highlightColors[0],
				colorSet: colorSets[3],
				backgroundImage: null,
				backgroundImageUploaded: false,
				backgroundPosition: backgroundPositions[0],
				backgroundBlur: 0.2,
				pictogram: pictograms.find(pictogram => pictogram.name == 'Streikfaust') as Pictogram,
				pictogramPosition: { x: 95, y: 125 },
			}
		});
	}, []);

	return(
		<SharePicCanvas
			backgroundImageUploaded={state.backgroundImageUploaded}
			backgroundImage={state.backgroundImage}
			backgroundPosition={state.backgroundPosition}
			backgroundBlur={state.backgroundBlur}
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
			<SharePicPictogram
				pictogram={state.pictogram}
				position={state.pictogramPosition}
				colorSet={state.colorSet}
			/>
		</SharePicCanvas>
	);
}
