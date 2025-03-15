/// <reference types="vite/client" />

type ColorSet = {
	name: string;
	backgroundColor: string;
	accentColor: string;
};

type HighlightColor = {
	name: string;
	backgroundColor: string;
};

type Pictogram = {
	name: string;
	path: string;
};

type PictogramPostion = {
	x: number,
	y: number
}

type BackgroundPosition = {
	displayName: string;
	value: string;
};
