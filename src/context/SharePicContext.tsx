/******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     https://gjshare.pics/license
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *****************************************************************************/

import { createContext, useReducer, useContext, ReactNode } from "react";
import { colorSets, highlightColors } from "../constants/colors";
import { backgroundPositions } from "../constants/background-positions";

interface SharePicState {
	localGroup: string;
	logoVisible: boolean;
	arrowVisible: boolean;
	heading: string[];
	text: string[];
	headingTopOrBottom: boolean;
	highlightColor: HighlightColor;
	colorSet: ColorSet;
	backgroundImage: string | null;
	backgroundImageUploaded: boolean;
	backgroundPosition: BackgroundPosition;
	backgroundBlur: number;
	pictogram: Pictogram | null;
	pictogramPosition: { x: number; y: number };
}

type SharePicAction =
	| { type: "INITIALIZE"; payload: SharePicState }
	| { type: "SET_LOCAL_GROUP"; payload: string }
	| { type: "SET_LOGO_VISIBLE"; payload: boolean }
	| { type: "SET_ARROW_VISIBLE"; payload: boolean }
	| { type: "SET_HEADING"; payload: string[] }
	| { type: "SET_TEXT"; payload: string[] }
	| { type: "SET_HEADING_TOP_OR_BOTTOM"; payload: boolean }
	| { type: "SET_HIGHLIGHT_COLOR"; payload: HighlightColor }
	| { type: "SET_COLOR_SET"; payload: ColorSet }
	| { type: "SET_BACKGROUND_IMAGE"; payload: string | null, uploaded?: boolean }
	| { type: "SET_BACKGROUND_POSITION"; payload: BackgroundPosition }
	| { type: "SET_BACKGROUND_BLUR"; payload: number }
	| { type: "SET_PICTOGRAM"; payload: Pictogram | null }
	| { type: "SET_PICTOGRAM_POSITION"; payload: { x: number; y: number } };

const sharePicReducer = (state: SharePicState, action: SharePicAction): SharePicState => {
	switch (action.type) {
		case "INITIALIZE":
			return { ...action.payload };
		case "SET_LOCAL_GROUP":
			return { ...state, localGroup: action.payload };
		case "SET_LOGO_VISIBLE":
			return { ...state, logoVisible: action.payload };
		case "SET_ARROW_VISIBLE":
			return { ...state, arrowVisible: action.payload };
		case "SET_HEADING_TOP_OR_BOTTOM":
			return { ...state, headingTopOrBottom: action.payload };
		case "SET_HEADING":
			return { ...state, heading: action.payload };
		case "SET_TEXT":
			return { ...state, text: action.payload };
		case "SET_HIGHLIGHT_COLOR":
			return { ...state, highlightColor: action.payload };
		case "SET_COLOR_SET":
			return { ...state, colorSet: action.payload };
		case "SET_BACKGROUND_IMAGE":
			return {
				...state,
				backgroundImage: action.payload,
				backgroundImageUploaded: !!action.uploaded
			};
		case "SET_BACKGROUND_POSITION":
			return { ...state, backgroundPosition: action.payload };
		case "SET_BACKGROUND_BLUR":
			return { ...state, backgroundBlur: action.payload };
		case "SET_PICTOGRAM":
			return { ...state, pictogram: action.payload };
		case "SET_PICTOGRAM_POSITION":
			return { ...state, pictogramPosition: action.payload };
		default:
			return state;
	}
};

const initialState: SharePicState = {
	localGroup: "",
	logoVisible: true,
	arrowVisible: false,
	headingTopOrBottom: false,
	heading: [],
	text: [],
	highlightColor: highlightColors[0],
	colorSet: colorSets[1],
	backgroundImage: null,
	backgroundImageUploaded: false,
	backgroundPosition: backgroundPositions[0],
	backgroundBlur: 0.2,
	pictogram: null,
	pictogramPosition: { x: 175, y: 225 },
};

interface SharePicContextType {
	state: SharePicState;
	dispatch: React.Dispatch<SharePicAction>;
}

const SharePicContext = createContext<SharePicContextType | undefined>(undefined);

export const SharePicProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(sharePicReducer, initialState);

	return (
		<SharePicContext.Provider value={{ state, dispatch }}>
			{children}
		</SharePicContext.Provider>
	);
};

export const useSharePic = (): SharePicContextType => {
	const context = useContext(SharePicContext);
	if (!context) {
		throw new Error("useSharePic must be used within a SharePicProvider");
	}
	return context;
};
