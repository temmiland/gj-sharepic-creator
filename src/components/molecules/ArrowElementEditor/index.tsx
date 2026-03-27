import { useSharePic } from '@/context/SharePicContext';
import type { ArrowElement } from '@/types/template';

export function ArrowElementEditor({ element }: { element: ArrowElement }) {
	const { dispatch } = useSharePic();

	return (
		<label className="element-editor__field element-editor__field--no-margin">
			Größe (px)
			<input
				type="number"
				min={20}
				max={160}
				value={element.size}
				onChange={e =>
					dispatch({
						type: 'UPDATE_ELEMENT',
						payload: { id: element.id, changes: { size: Number(e.target.value) } },
					})
				}
				className="element-editor__control"
			/>
		</label>
	);
}
