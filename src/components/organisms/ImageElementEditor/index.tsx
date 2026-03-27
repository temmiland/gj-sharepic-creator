import { useRef } from 'react';
import { useSharePic } from '@/context/SharePicContext';
import { scaleImageToDataUrl } from '@/utils/image-scale';
import type { ImageElement } from '@/types/template';

export function ImageElementEditor({ element }: { element: ImageElement }) {
	const { dispatch } = useSharePic();
	const fileRef = useRef<HTMLInputElement>(null);

	const handleReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (fileRef.current) fileRef.current.value = '';
		const { dataUrl, naturalWidth, naturalHeight } = await scaleImageToDataUrl(file, 1080, 1080);
		const displayScale = Math.min(1, 300 / naturalWidth, 300 / naturalHeight);
		dispatch({
			type: 'UPDATE_ELEMENT',
			payload: {
				id: element.id,
				changes: {
					src: dataUrl,
					width: Math.round(naturalWidth * displayScale),
					height: Math.round(naturalHeight * displayScale),
				},
			},
		});
	};

	return (
		<>
			<label className="element-editor__file-label">
				Bild ersetzen
				<input ref={fileRef} type="file" accept="image/*" onChange={handleReplace} className="element-editor__file-input" />
			</label>
			<div className="element-editor__grid">
				<label className="element-editor__field element-editor__field--no-margin">
					Breite (px)
					<input
						type="number" min={10} max={360}
						value={Math.round(element.width)}
						onChange={e => {
							const w = Number(e.target.value);
							const ratio = element.height / element.width;
							dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, changes: { width: w, height: Math.round(w * ratio) } } });
						}}
						className="element-editor__control"
					/>
				</label>
				<label className="element-editor__field element-editor__field--no-margin">
					Höhe (px)
					<input
						type="number" min={10} max={450}
						value={Math.round(element.height)}
						onChange={e => {
							const h = Number(e.target.value);
							const ratio = element.width / element.height;
							dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, changes: { height: h, width: Math.round(h * ratio) } } });
						}}
						className="element-editor__control"
					/>
				</label>
			</div>
			<label className="element-editor__field element-editor__field--no-margin">
				Opazität ({Math.round(element.opacity * 100)}%)
				<input
					type="range" min={0} max={1} step={0.01}
					value={element.opacity}
					onChange={e => dispatch({ type: 'UPDATE_ELEMENT', payload: { id: element.id, changes: { opacity: Number(e.target.value) } } })}
					className="element-editor__control"
				/>
			</label>
		</>
	);
}
