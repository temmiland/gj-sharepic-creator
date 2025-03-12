import { useEffect } from "react";
import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicPictogram } from "../organism/SharePicPictogram";
import { colorSets, highlightColors } from "../../constants/colors";
import { pictograms } from "../../constants/pictograms";

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
				colorSet: colorSets[4],
				pictogram: pictograms.find(pictogram => pictogram.name == 'Streikfaust') as Pictogram,
				pictogramPosition: { x: 95, y: 125 },
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
			<SharePicPictogram
				pictogram={state.pictogram}
				position={state.pictogramPosition}
				colorSet={state.colorSet}
			/>
		</div>
	);
}
