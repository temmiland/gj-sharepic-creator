/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router";
import { AppLayout } from '@/components/layouts/AppLayout';
import { Content } from '@/components/organisms/Content';
import { SharePicProvider } from '@/context/SharePicContext';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary';
import { STORY_CANVAS_CONFIG } from '@/constants/canvas';
import './main.scss';

const GjSharePicGenerator = lazy(() =>
	import('@/components/pages/GjSharePicGenerator').then(m => ({ default: m.GjSharePicGenerator }))
);
const Privacy = lazy(() =>
	import('@/components/pages/Privacy').then(m => ({ default: m.Privacy }))
);
const Contact = lazy(() =>
	import('@/components/pages/Contact').then(m => ({ default: m.Contact }))
);
const Imprint = lazy(() =>
	import('@/components/pages/Imprint').then(m => ({ default: m.Imprint }))
);
const Guide = lazy(() =>
	import('@/components/pages/Guide').then(m => ({ default: m.Guide }))
);
const StoryOverlayGenerator = lazy(() =>
	import('@/components/pages/StoryOverlayGenerator').then(m => ({ default: m.StoryOverlayGenerator }))
);

const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<AppLayout>
				<Content />
			</AppLayout>
		),
	},
	{
		path: "/sharepics",
		element: (
			<AppLayout>
				<SharePicProvider>
					<Suspense fallback={null}>
						<GjSharePicGenerator />
					</Suspense>
				</SharePicProvider>
			</AppLayout>
		)
	},
	{
		path: "/story-overlays",
		element: (
			<AppLayout>
				<SharePicProvider canvasConfig={STORY_CANVAS_CONFIG}>
					<Suspense fallback={null}>
						<StoryOverlayGenerator />
					</Suspense>
				</SharePicProvider>
			</AppLayout>
		)
	},
	{
		path: "/anleitung",
		element: (
			<AppLayout>
				<Suspense fallback={null}>
					<Guide />
				</Suspense>
			</AppLayout>
		)
	},
	{
		path: "/kontakt",
		element: (
			<AppLayout>
				<Suspense fallback={null}>
					<Contact />
				</Suspense>
			</AppLayout>
		)
	},
	{
		path: "/datenschutz",
		element: (
			<AppLayout>
				<Suspense fallback={null}>
					<Privacy />
				</Suspense>
			</AppLayout>
		)
	},
	{
		path: "/impressum",
		element: (
			<AppLayout>
				<Suspense fallback={null}>
					<Imprint />
				</Suspense>
			</AppLayout>
		)
	}
]);

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<RouterProvider router={router}/>
		</ErrorBoundary>
	</React.StrictMode>,
);
