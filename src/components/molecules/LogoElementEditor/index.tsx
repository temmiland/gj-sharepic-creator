import { useSharePic } from '@/context/SharePicContext';
import type { LogoElement } from '@/types/template';

export function LogoElementEditor({ element }: { element: LogoElement }) {
	const { dispatch } = useSharePic();

	return (
		<label className="element-editor__field element-editor__field--no-margin">
			Ortsgruppe
			<input
				type="text"
				value={element.localGroup}
				onChange={e =>
					dispatch({
						type: 'UPDATE_ELEMENT',
						payload: { id: element.id, changes: { localGroup: e.target.value } },
					})
				}
				className="element-editor__control"
				placeholder="z.B. Leipzig"
			/>
		</label>
	);
}
