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

export default function SharePicTitleAndText() {

	const { state, dispatch } = useSharePic();

	useEffect(() => {
		dispatch({
			type: "INITIALIZE",
			payload: {
				localGroup: "Dresden",
				logoVisible: false,
				arrowVisible: true,
				headingTopOrBottom: true,
				heading: ["*Kein Ausbau", "fossiler Infrastruktur!"],
				text: ["In den letzten Jahrzehnten ist die Energieversorgung in Deutschland auf Energieimporte aus Russland in Form von Erdgas aufgebaut worden. Das hat sich durch den brutalen Überfall Russlands auf die Ukraine geändert. Die große Abhängigkeit von fossilen Energien ist der Grund für die Energiekrise. Ein weiterer Ausbau von LNG-Terminals kann daher keine Lösung sein!"],
				highlightColor: highlightColors[0],
				colorSet: colorSets[1],
				backgroundImage: null,
				backgroundPosition: backgroundPositions[0],
				pictogram: null,
				pictogramPosition: { x: 175, y: 225 },
			}
		});
	}, []);

	return(
		<SharePicCanvas
			backgroundImage={state.backgroundImage}
			backgroundPosition={state.backgroundPosition}
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
		</SharePicCanvas>
	);
}
