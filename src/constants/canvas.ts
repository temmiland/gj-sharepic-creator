export const CANVAS_WIDTH = 360;
export const CANVAS_HEIGHT = 450;

export const STORY_CANVAS_WIDTH = 360;
export const STORY_CANVAS_HEIGHT = 640;

export interface CanvasConfig {
	width: number;
	height: number;
	transparentBackground: boolean;
}

export const SHAREPIC_CANVAS_CONFIG: CanvasConfig = {
	width: CANVAS_WIDTH,
	height: CANVAS_HEIGHT,
	transparentBackground: false,
};

export const STORY_CANVAS_CONFIG: CanvasConfig = {
	width: STORY_CANVAS_WIDTH,
	height: STORY_CANVAS_HEIGHT,
	transparentBackground: true,
};
