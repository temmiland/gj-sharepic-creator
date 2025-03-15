import { useEffect } from "react";
import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicContent } from "../organism/SharePicContent";
import { SharePicHeading } from "../organism/SharePicHeading";
import { SharePicPictogram } from "../organism/SharePicPictogram";
import { colorSets, highlightColors } from "../../constants/colors";
import { pictograms } from "../../constants/pictograms";
import { SharePicCanvas } from "../organism/SharePicCanvas";
import { backgroundPositions } from "../../constants/background-positions";

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
				backgroundPosition: backgroundPositions[0],
				backgroundBlur: 0.2,
				pictogram: pictograms.find(pictogram => pictogram.name == 'Banner') as Pictogram,
				pictogramPosition: { x: 75, y: 50 },
			}
		});
	}, []);


	return(
		<SharePicCanvas
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
		</SharePicCanvas>
	);
}
