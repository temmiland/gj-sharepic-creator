export type ColorSet = {
	name: string;
	backgroundColor: string;
	accentColor: string;
};

export type HighlightColor = {
	name: string;
	backgroundColor: string;
};

export type BackgroundPosition = {
	displayName: string;
	value: string;
};

export type Pictogram = {
	name: string;
	path: string;
};

export type PictogramItem = {
	id: string;
	pictogram: Pictogram;
	position: { x: number; y: number };
	size: number;
};
