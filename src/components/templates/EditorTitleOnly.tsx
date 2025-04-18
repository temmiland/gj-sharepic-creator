import { colorSets, highlightColors } from "../../constants/colors";
import { pictograms } from "../../constants/pictograms";
import { useSharePic } from "../../context/SharePicContext";
import { EditorColorSet } from "../organism/EditorColorSet";
import { EditorBackgroundImage } from "../organism/EditorBackgroundImage";
import { EditorHighlightColor } from "../organism/EditorHighlightColor";
import { EditorLogoVisible } from "../organism/EditorLogoVisible";
import { EditorArrowVisible } from "../organism/EditorArrowVisible";
import { EditorLogoLocalGroup } from "../organism/EditorLogoLocalGroup";
import { EditorHeadingTopOrBottom } from "../organism/EditorHeadingTopOrBottom";
import { EditorHeading } from "../organism/EditorHeading";
import { EditorPictogram } from "../organism/EditorPictogram";
import { EditorPictogramPosition } from "../organism/EditorPictogramPosition";
import { EditorBackgroundPosition } from "../organism/EditorBackgroundPosition";
import { backgroundPositions } from "../../constants/background-positions";
import { EditorBackgroundBlur } from "../organism/EditorBackgroundBlur";
import { EditorBackgroundBrightness } from "../organism/EditorBackgroundBrightness";
import Details from "../atoms/Details";

export default function EditorTitleOnly() {
	const { state, dispatch } = useSharePic();

	return (
		<>
			<Details summary="Farben">
				<EditorColorSet
					colorSets={colorSets}
					colorSet={state.colorSet}
					handleColorSet={(e: { target: { value: string; }; }) => dispatch({
						type: "SET_COLOR_SET",
						payload: colorSets.find((c) => c.name === e.target.value)!!,
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
			</Details>

			<Details summary="Hintergrund">
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

				<EditorBackgroundPosition
					position={state.backgroundPosition}
					handlePosition={(e: { target: { value: any; }; }) => dispatch({
						type: "SET_BACKGROUND_POSITION",
						payload: backgroundPositions.find((bP) => bP.value === e.target.value)!!,
					})}
				/>

				<EditorBackgroundBlur
					blur={state.backgroundBlur}
					handleBlur={(e: { target: { value: any; }; }) => dispatch({
						type: "SET_BACKGROUND_BLUR",
						payload: e.target.value
					})}
				/>

				<EditorBackgroundBrightness
					brightness={state.backgroundBrightness}
					handleBrightness={(e: { target: { value: any; }; }) => dispatch({
						type: "SET_BACKGROUND_BRIGHTNESS",
						payload: e.target.value
					})}
				/>
			</Details>

			<Details summary="Logo & Pfeil">
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
			</Details>

			<Details summary="Inhalte">
				<EditorHeadingTopOrBottom
					topOrBottom={state.headingTopOrBottom}
					handleTopOrBottom={() => dispatch({
						type: "SET_HEADING_TOP_OR_BOTTOM",
						payload: !state.headingTopOrBottom
					})}
				/>

				<EditorHeading
					multiLineText={state.heading}
					maxCharsPerLine={20}
					maxLines={5}
					handleHeading={(e: { target: { value: any; }; }) => dispatch({
						type: "SET_HEADING",
						payload: e.target.value.split(/\r?\n/).slice(0, 5)
					})}
				/>
			</Details>

			<Details summary="Piktogramm">
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
			</Details>

		</>
	);
}
