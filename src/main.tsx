/******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     https://gjshare.pics/license
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *****************************************************************************/

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import Route from './components/templates/Route/index.tsx';
import { Content } from './components/organism/Content/index.tsx';
import { SharePicProvider } from './context/SharePicContext.tsx';
import GjSharePicGenerator from './components/pages/GjSharePicGenerator/index.tsx';
import './main.scss';

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
		path: "/sharepics",
		element: (
			<Route>
				<SharePicProvider>
					<GjSharePicGenerator />
				</SharePicProvider>
			</Route>
		)
	}
]);

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>,
);
