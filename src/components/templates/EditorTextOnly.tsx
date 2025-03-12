import { colorSets, highlightColors } from "../../constants/colors";
import { useSharePic } from "../../context/SharePicContext";
import { EditorColorSet } from "../organism/EditorColorSet";
import { EditorHighlightColor } from "../organism/EditorHighlightColor";
import { EditorLogoVisible } from "../organism/EditorLogoVisible";
import { EditorArrowVisible } from "../organism/EditorArrowVisible";
import { EditorLogoLocalGroup } from "../organism/EditorLogoLocalGroup";
import { EditorHeading } from "../organism/EditorHeading";
import { EditorText } from "../organism/EditorText";
import { EditorPictogram } from "../organism/EditorPictogram";
import { EditorPictogramPosition } from "../organism/EditorPictogramPosition";
import { pictograms } from "../../constants/pictograms";

export default function EditorTextOnly() {
	const { state, dispatch } = useSharePic();

	return (
		<>
			<EditorColorSet
				colorSets={colorSets}
				colorSet={state.colorSet}
				handleColorSet={(e: { target: { value: string; }; }) => dispatch({
					type: "SET_COLOR_SET",
					payload: colorSets.find((c) => c.name === e.target.value)!!,
				})}
			/>

			<EditorLogoLocalGroup
				localGroup={state.localGroup}
				handleLocalGroup={(e: { target: { value: any; }; }) => dispatch({
					type: "SET_LOCAL_GROUP",
					payload: e.target.value
				})}
			/>

			<EditorLogoVisible
				visible={state.logoVisible}
				handleVisibility={() => dispatch({
					type: "SET_LOGO_VISIBLE",
					payload: !state.logoVisible
				})}
			/>

			<EditorArrowVisible
				visible={state.arrowVisible}
				handleVisibility={() => dispatch({
					type: "SET_ARROW_VISIBLE",
					payload: !state.arrowVisible
				})}
			/>

			<EditorText
				multiLineText={state.text}
				handleText={(e: { target: { value: any; }; }) => dispatch({
					type: "SET_TEXT",
					payload: e.target.value.split(/\r?\n/)
				})}
			/>

			<EditorHighlightColor
				highlightColors={highlightColors}
				highlightColor={state.highlightColor}
				handleHighlightColor={(e: { target: { value: string; }; }) => dispatch({
					type: "SET_HIGHLIGHT_COLOR",
					payload: highlightColors.find((c) => c.name === e.target.value)!!,
				})}
			/>

			<EditorPictogram
				pictograms={pictograms}
				pictogram={state.pictogram}
				handlePictogram={(e: { target: { value: any; }; }) => dispatch({
					type: "SET_PICTOGRAM",
					payload: pictograms.find((p) => p.name === e.target.value) || null,
				})}
			/>

			<EditorPictogramPosition
				pictogramPosition={state.pictogramPosition}
				handlePictogramPositionX={(e: { target: { value: string; }; }) => dispatch({
					type: "SET_PICTOGRAM_POSITION",
					payload: { ...state.pictogramPosition, x: parseInt(e.target.value) }
				})}
				handlePictogramPositionY={(e: { target: { value: string; }; }) => dispatch({
					type: "SET_PICTOGRAM_POSITION",
					payload: { ...state.pictogramPosition, y: parseInt(e.target.value) }
				})}
			/>
		</>
	);
}
