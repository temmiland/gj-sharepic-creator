import { createContext, useReducer, useContext, ReactNode } from "react";
import { colorSets, highlightColors } from "../constants/colors";

interface SharePicState {
	localGroup: string;
	logoVisible: boolean;
	arrowVisible: boolean;
	heading: string[];
	headingTopOrBottom: boolean;
	highlightColor: HighlightColor;
	colorSet: ColorSet;
	pictogram: Pictogram | null;
	pictogramPosition: { x: number; y: number };
}

type SharePicAction =
	| { type: "SET_LOCAL_GROUP"; payload: string }
	| { type: "SET_LOGO_VISIBLE"; payload: boolean }
	| { type: "SET_ARROW_VISIBLE"; payload: boolean }
	| { type: "SET_HEADING"; payload: string[] }
	| { type: "SET_HEADING_TOP_OR_BOTTOM"; payload: boolean }
	| { type: "SET_HIGHLIGHT_COLOR"; payload: HighlightColor }
	| { type: "SET_COLOR_SET"; payload: ColorSet }
	| { type: "SET_PICTOGRAM"; payload: Pictogram | null }
	| { type: "SET_PICTOGRAM_POSITION"; payload: { x: number; y: number } };

const sharePicReducer = (state: SharePicState, action: SharePicAction): SharePicState => {
	switch (action.type) {
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
		case "SET_HIGHLIGHT_COLOR":
		return { ...state, highlightColor: action.payload };
		case "SET_COLOR_SET":
		return { ...state, colorSet: action.payload };
		case "SET_PICTOGRAM":
		return { ...state, pictogram: action.payload };
		case "SET_PICTOGRAM_POSITION":
		return { ...state, pictogramPosition: action.payload };
		default:
		return state;
	}
};

const initialState: SharePicState = {
	localGroup: "Dresden",
	logoVisible: true,
	arrowVisible: false,
	headingTopOrBottom: true,
	heading: ["Corporate", "Design", "Generator", "*Test", "*123"],
	highlightColor: highlightColors[0],
	colorSet: colorSets[1],
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
