import { useState } from 'react';
import { domToPng } from 'modern-screenshot';
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
		name: 'Veranstaltung (opt. Piktogramm)',
		sharePic: SharePicEvent,
		options: EditorEvent,
	},
	textOnly: {
		name: 'Text (opt. Piktogramm)',
		sharePic: SharePicTextOnly,
		options: EditorTextOnly,
	},
	pictogramOnly: {
		name: 'Piktogramm',
		sharePic: SharePicPictogramOnly,
		options: EditorPictogramOnly,
	}
}

export default function GjSharePicGenerator() {

  	const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('titleOnly');

	const handleDownload = async () => {
			const resultImg = document.getElementById('final-result') as HTMLImageElement;

			if (resultImg && resultImg.src) {
				const link = document.createElement('a');
				link.download = `gj-sharepic-${new Date().toISOString()}.png`;
				link.href = resultImg.src;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
	};

	const handlePreview = async () => {
		const node = document.getElementById('sharepic-download');
		if (node) {
			const scale = 3;
			const width = node.offsetWidth;
			const height = node.offsetHeight;

			const contentDataUrl = await domToPng(node, {
				width: width * scale,
				height: height * scale,
				style: {
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
					width: `${width}px`,
					height: `${height}px`,
				}
			});

			const resultImg = document.getElementById('final-result') as HTMLImageElement;
			resultImg.src = contentDataUrl;
			resultImg.style.width = '360px';

			const downloadBtn = document.getElementById('final-download') as HTMLDivElement;
			downloadBtn.style.display = 'block';
		}
	};

	const SharePicComponent = templates[selectedTemplate].sharePic;
	const EditorComponent = templates[selectedTemplate].options;

	return (
		<>
			<div className="inner">
				<div className='container sticky'>
					<div
						className='sharepic-container'
					>
						{
							SharePicComponent && (<SharePicComponent />)
						}
					</div>
					<Button onClick={handlePreview}>SharePic erstellen</Button>
					<h3>Die Bilderstellung bei Fehlern bitte erneut versuchen.</h3>
					<h2>Vorschau:</h2>
					<img id='final-result' />
					<div id='final-download' style={{display: 'none'}}>
						<Button onClick={handleDownload}>Herunterladen</Button>
					</div>
				</div>

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
					{
						EditorComponent && (<EditorComponent />)
					}
				</div>
			</div>
		</>
  );
}
