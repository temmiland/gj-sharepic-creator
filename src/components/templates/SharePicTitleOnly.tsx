import { useSharePic } from "../../context/SharePicContext";
import { SharePicLogo } from "../organism/SharePicLogo";
import { SharePicArrow } from "../organism/SharePicArrow";
import { SharePicHeading } from "../organism/SharePicHeading";
import { SharePicPictogram } from "../organism/SharePicPictogram";

export default function SharePicTitleOnly() {

	const { state } = useSharePic();

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
			<SharePicHeading
				multiLineText={state.heading}
				topOrBottom={state.headingTopOrBottom}
				colorSet={state.colorSet}
				highlightColor={state.highlightColor}
			/>
			<SharePicPictogram
				pictogram={state.pictogram}
				position={state.pictogramPosition}
				colorSet={state.colorSet}
			/>
		</div>
	);
}
