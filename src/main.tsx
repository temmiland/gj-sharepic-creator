import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { SharePicProvider } from './context/SharePicContext.tsx';
import GjSharePicGenerator from './GjSharePicGenerator.tsx';
import './main.scss';
import { Header } from './components/organism/Header/index.tsx';
import { Content } from './components/organism/Content/index.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
		<Route>
			<Content />
		</Route>
	),
  },
  {
	path: "/sharepic",
	element: (
		<Route>
			<SharePicProvider>
				<GjSharePicGenerator />
			</SharePicProvider>
		</Route>
	)
  }
]);

function Route({children}: {children: ReactNode | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal | boolean | null | undefined}) {
	return (
		<>
			<Header />
			<div className="hdg-route">
				{children}
			</div>
			<footer>
				<div className="inner">
					<p>
						Made with ♥︎ by <a href="https://temmi.land">Temmi Pietsch</a>
						<br/>
						v0.9.0  ✦ <a href="https://github.com/temmiland/gj-sharepic-creator">GitHub</a> ✦ <a href="./kontakt">Kontakt</a> ✦ <a href="./datenschutz">Datenschutz</a> ✦ <a href="./impressum">Impressum</a>
					</p>
				</div>
			</footer>
		</>
	);
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider router={router}/>
	</StrictMode>,
)
