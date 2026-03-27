import { useSharePic } from '@/context/SharePicContext';
import { EditorText } from '@/components/molecules/EditorText';
import type { TextElement } from '@/types/template';

export function TextElementEditor({ element }: { element: TextElement }) {
	const { dispatch } = useSharePic();

	return (
		<>
			<label className="element-editor__field">
				Breite (px)
				<input
					type="number"
					min={50}
					max={360}
					value={element.width}
					onChange={e =>
						dispatch({
							type: 'UPDATE_ELEMENT',
							payload: { id: element.id, changes: { width: Number(e.target.value) } },
						})
					}
					className="element-editor__control"
				/>
			</label>
			<EditorText
				value={element.content.join('\n')}
				onChange={value =>
					dispatch({
						type: 'UPDATE_ELEMENT',
						payload: { id: element.id, changes: { content: value.split(/\r?\n/) } },
					})
				}
			/>
		</>
	);
}
