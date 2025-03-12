import { useEffect } from "react";
import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicHeading } from "../organism/SharePicHeading";
import { SharePicText } from "../organism/SharePicText";
import { SharePicPictogram } from "../organism/SharePicPictogram";
import { colorSets, highlightColors } from "../../constants/colors";
import { SharePicContent } from "../organism/SharePicContent";

export default function SharePicTitleAndText() {

	const { state, dispatch } = useSharePic();

	useEffect(() => {
		dispatch({
			type: "INITIALIZE",
			payload: {
				localGroup: "Dresden",
				logoVisible: true,
				arrowVisible: true,
				headingTopOrBottom: true,
				heading: ["Corporate Design", "*Generator"],
				text: ["*_~#Hallo!#~_* Hier ist ein *fetter* Text, ein _kursiver_ Text, ein ~durchgestrichener~ Text und ein #hervorgehobener# Text.", "Das ist ein zweiter Absatz, den du mit einem Enter erzeugen kannst."],
				highlightColor: highlightColors[0],
				colorSet: colorSets[4],
				pictogram: null,
				pictogramPosition: { x: 175, y: 225 },
			}
		});
	}, []);

	return(
		<div className='sharepic-canvas' style={{ backgroundColor: state.colorSet.backgroundColor }}>
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
					fontSize={2.6}
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
		</div>
	);
}
