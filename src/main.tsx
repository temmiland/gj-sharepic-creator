import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GjSharePicGenerator from './GjSharePicGenerator.tsx';
import './main.scss';
import { SharePicProvider } from './context/SharePicContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
	<SharePicProvider>
		<GjSharePicGenerator />
	</SharePicProvider>
  </StrictMode>,
)
