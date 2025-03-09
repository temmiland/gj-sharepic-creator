import { useState } from 'react';
import domtoimage from 'dom-to-image-more';
import Button from './components/atoms/Button';
import SharePicTitleOnly from './components/templates/SharePicTitleOnly';
import EditorTitleOnly from './components/templates/EditorTitleOnly';
import './GjSharePicGenerator.scss';

const templates = {
	titleOnly: { name: 'Nur Überschrift', sharePic: SharePicTitleOnly, options: EditorTitleOnly },
}

function GjSharePicGenerator() {

  	const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('titleOnly');

	const handleDownload = () => {
		const node = document.getElementById('sharepic-download');
		if (node) {
			domtoimage.toPng(node, {
				height: 1350,
				width: 1080,
				style: { transform: 'scale(3, 3)', 'transform-origin': 'top left' },
			}).then((dataUrl: string) => {
				const link = document.createElement('a');
				link.download = `gj-sharepic-${new Date().toISOString()}.png`;
				link.href = dataUrl;
				link.click();
			});
		}
	};

	const SharePicComponent = templates[selectedTemplate].sharePic;
	const EditorComponent = templates[selectedTemplate].options;

	return (
		<div className="inner">
			<div className='container'>
				<h2>Vorlage auswählen:</h2>
				<select
					onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof templates)}
					value={selectedTemplate}
				>
					{
						Object.entries(templates).map(([key, template]) => (
							<option key={key} value={key}>
								{template.name}
							</option>
						))
					}
				</select>
				<div
					id='sharepic-download'
					className='sharepic-container'
				>
					{
						SharePicComponent && (<SharePicComponent />)
					}
				</div>
				<Button onClick={handleDownload}>Download</Button>
			</div>

			<div className='container'>
				{
					EditorComponent && (<EditorComponent />)
				}
			</div>
		</div>
  );
}

export default GjSharePicGenerator;
