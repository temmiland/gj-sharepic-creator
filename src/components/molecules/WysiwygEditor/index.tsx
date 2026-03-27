import { useRef, useCallback } from 'react';
import './WysiwygEditor.scss';

export type FormatAction = {
	label: string;
	icon: React.ReactNode;
	wrapper: [string, string];
	lineLevel?: boolean;
};

type WysiwygEditorProps = {
	value: string;
	onChange: (value: string) => void;
	actions: FormatAction[];
	rows?: number;
	cols?: number;
	maxLength?: number;
	wrap?: string;
	placeholder?: string;
};

export function WysiwygEditor({ value, onChange, actions, rows, cols, maxLength, wrap, placeholder }: WysiwygEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const applyFormat = useCallback((action: FormatAction) => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		const start = textarea.selectionStart;
		const end = textarea.selectionEnd;

		if (action.lineLevel) {
			const lines = value.split('\n');
			let charCount = 0;
			let lineIndex = 0;

			for (let i = 0; i < lines.length; i++) {
				if (charCount + lines[i].length >= start) {
					lineIndex = i;
					break;
				}
				charCount += lines[i].length + 1;
			}

			const line = lines[lineIndex];
			const prefix = action.wrapper[0];

			if (line.startsWith(prefix)) {
				lines[lineIndex] = line.substring(prefix.length);
			} else {
				lines[lineIndex] = prefix + line;
			}

			onChange(lines.join('\n'));

			requestAnimationFrame(() => {
				textarea.focus();
			});
		} else {
			const selectedText = value.substring(start, end);
			const [prefix, suffix] = action.wrapper;

			const beforeStart = Math.max(0, start - prefix.length);
			const afterEnd = Math.min(value.length, end + suffix.length);
			const textBefore = value.substring(beforeStart, start);
			const textAfter = value.substring(end, afterEnd);

			let newValue: string;
			let newStart: number;
			let newEnd: number;

			if (textBefore === prefix && textAfter === suffix) {
				newValue = value.substring(0, beforeStart) + selectedText + value.substring(afterEnd);
				newStart = beforeStart;
				newEnd = beforeStart + selectedText.length;
			} else {
				newValue = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
				newStart = start + prefix.length;
				newEnd = end + prefix.length;
			}

			onChange(newValue);

			requestAnimationFrame(() => {
				textarea.focus();
				textarea.setSelectionRange(newStart, newEnd);
			});
		}
	}, [value, onChange]);

	return (
		<div className="wysiwyg-editor">
			<div className="wysiwyg-editor__toolbar">
				{actions.map((action) => (
					<button
						key={action.label}
						type="button"
						className="wysiwyg-editor__btn"
						title={action.label}
						onMouseDown={(e) => {
							e.preventDefault();
							applyFormat(action);
						}}
					>
						{action.icon}
					</button>
				))}
			</div>
			<textarea
				ref={textareaRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				rows={rows}
				cols={cols}
				maxLength={maxLength}
				wrap={wrap}
				placeholder={placeholder}
			/>
		</div>
	);
}
