export type TemplateElementType = 'heading' | 'text' | 'logo' | 'arrow' | 'pictogram' | 'image';

export interface TemplateElementBase {
	id: string;
	type: TemplateElementType;
	x: number;
	y: number;
	visible: boolean;
}

export interface HeadingElement extends TemplateElementBase {
	type: 'heading';
	content: string[];
	fontSize: number;
	width: number;
}

export interface TextElement extends TemplateElementBase {
	type: 'text';
	content: string[];
	width: number;
}

export interface LogoElement extends TemplateElementBase {
	type: 'logo';
	localGroup: string;
}

export interface ArrowElement extends TemplateElementBase {
	type: 'arrow';
	size: number;
}

export interface PictogramElement extends TemplateElementBase {
	type: 'pictogram';
	pictogramName: string;
	size: number;
}

export interface ImageElement extends TemplateElementBase {
	type: 'image';
	/** data URL (base64) or object URL – stored as data URL for JSON persistence */
	src: string;
	width: number;
	height: number;
	opacity: number;
}

export type TemplateElement =
	| HeadingElement
	| TextElement
	| LogoElement
	| ArrowElement
	| PictogramElement
	| ImageElement;

export interface SharePicTemplate {
	id: string;
	name: string;
	version: number;
	templateType: 'sharepic' | 'overlay';
	canvas: {
		width: number;
		height: number;
		colorSetName: string;
		highlightColorName: string;
		backgroundImage: string | null;
		backgroundPositionValue: string;
		backgroundBlur: number;
		backgroundBrightness: number;
	};
	elements: TemplateElement[];
}
