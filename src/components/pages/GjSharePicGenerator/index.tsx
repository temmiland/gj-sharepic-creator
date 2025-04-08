import { useState } from 'react';
import { domToPng } from 'modern-screenshot'
import Button from '../../atoms/Button';
import SharePicTitleOnly from '../../templates/SharePicTitleOnly';
import EditorTitleOnly from '../../templates/EditorTitleOnly';
import SharePicTitleAndText from '../../templates/SharePicTitleAndText';
import EditorTitleAndText from '../../templates/EditorTitleAndText';
import SharePicTextOnly from '../../templates/SharePicTextOnly';
import EditorTextOnly from '../../templates/EditorTextOnly';
import SharePicPictogramOnly from '../../templates/SharePicPictogramOnly';
import EditorPictogramOnly from '../../templates/EditorPictogramOnly';
import SharePicEvent from '../../templates/SharePicEvent';
import EditorEvent from '../../templates/EditorEvent';
import './GjSharePicGenerator.scss';

const templates = {
	titleOnly: {
		name: 'Überschrift (opt. Piktogramm)',
		sharePic: SharePicTitleOnly,
		options: EditorTitleOnly,
	},
	titleAndText: {
		name: 'Überschrift & Text',
		sharePic: SharePicTitleAndText,
		options: EditorTitleAndText,
	},
	event: {
		name: 'Veranstaltung',
		sharePic: SharePicEvent,
		options: EditorEvent,
	},
	textOnly: {
		name: 'Text (opt. Piktogramm)',
		sharePic: SharePicTextOnly,
		options: EditorTextOnly,
	},
	pictogramOnly: {
		name: 'Piktogram',
		sharePic: SharePicPictogramOnly,
		options: EditorPictogramOnly,
	}
}

export default function GjSharePicGenerator() {

  	const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('titleOnly');

	const handleDownload = () => {
		const node = document.getElementById('sharepic-download');
		if (node) {
			domToPng(node, {
				height: 1350,
				width: 1080,
				style: { transform: 'scale(3, 3)', transformOrigin: 'top left' },
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
		<>
			<div className="inner">
				<div className='container sticky'>
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
		</>
  );
}
