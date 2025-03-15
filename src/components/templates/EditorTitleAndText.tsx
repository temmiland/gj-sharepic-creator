import { colorSets, highlightColors } from "../../constants/colors";
import { useSharePic } from "../../context/SharePicContext";
import { EditorColorSet } from "../organism/EditorColorSet";
import { EditorHighlightColor } from "../organism/EditorHighlightColor";
import { EditorLogoVisible } from "../organism/EditorLogoVisible";
import { EditorArrowVisible } from "../organism/EditorArrowVisible";
import { EditorLogoLocalGroup } from "../organism/EditorLogoLocalGroup";
import { EditorHeading } from "../organism/EditorHeading";
import { EditorText } from "../organism/EditorText";
import { EditorBackgroundImage } from "../organism/EditorBackgroundImage";

export default function EditorTitleAndText() {
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

			<EditorBackgroundImage
				handleBackgroundImage={(base64File: string) => dispatch({
					type: "SET_BACKGROUND_IMAGE",
					payload: base64File
				})}
				handleFileDelete={() => dispatch({
					type: "SET_BACKGROUND_IMAGE",
					payload: null
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

			<EditorHeading
				multiLineText={state.heading}
				maxCharsPerLine={20}
				maxLines={3}
				handleHeading={(e: { target: { value: any; }; }) => dispatch({
					type: "SET_HEADING",
					payload: e.target.value.split(/\r?\n/).slice(0, 5)
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
		</>
	);
}
