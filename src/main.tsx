import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SharePicProvider } from './context/SharePicContext.tsx';
import GjSharePicGenerator from './GjSharePicGenerator.tsx';
import './main.scss';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SharePicProvider>
			<GjSharePicGenerator />
		</SharePicProvider>
	</StrictMode>,
)
