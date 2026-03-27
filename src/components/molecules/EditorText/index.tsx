import { WysiwygEditor } from '@/components/molecules/WysiwygEditor';
import type { FormatAction } from '@/components/molecules/WysiwygEditor';
import './EditorText.scss';

type EditorTextProps = {
	value: string;
	onChange: (value: string) => void;
};

const textActions: FormatAction[] = [
	{ label: 'Fett', icon: <strong>B</strong>, wrapper: ['*', '*'] },
	{ label: 'Kursiv', icon: <em>I</em>, wrapper: ['_', '_'] },
	{ label: 'Durchgestrichen', icon: <s>S</s>, wrapper: ['~', '~'] },
	{ label: 'Akzentfarbe', icon: <span className="editor-text-swatch editor-text-swatch--accent">A</span>, wrapper: ['%', '%'] },
	{ label: 'Highlightfarbe', icon: <span className="editor-text-swatch editor-text-swatch--highlight">H</span>, wrapper: ['#', '#'] },
];

export function EditorText({ value, onChange }: EditorTextProps) {
	return (
		<>
			<h2>Text</h2>
			<WysiwygEditor
				value={value}
				onChange={onChange}
				actions={textActions}
				rows={8}
				placeholder="Text mit *fett*, _kursiv_, ~durchgestrichen~"
			/>
		</>
	);
}
