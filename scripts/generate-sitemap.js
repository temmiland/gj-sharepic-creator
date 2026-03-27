#!/usr/bin/env node

/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

/**
 * Generate sitemap.xml from application routes
 * Run this script as part of your build process: npm run generate:sitemap
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOMAIN = 'https://gjsharepics.temmi.land';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Define all routes with metadata
const routes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'weekly',
    description: 'Startseite - Höchste Priorität'
  },
  {
    path: '/sharepics',
    priority: 0.9,
    changefreq: 'monthly',
    description: 'SharePic Generator - Hauptfeature'
  },
  {
    path: '/story-overlays',
    priority: 0.9,
    changefreq: 'monthly',
    description: 'Story Overlay Generator - Neues Feature'
  },
  {
    path: '/anleitung',
    priority: 0.8,
    changefreq: 'monthly',
    description: 'Anleitung - Wichtig für Benutzer'
  },
  {
    path: '/kontakt',
    priority: 0.7,
    changefreq: 'yearly',
    description: 'Kontakt'
  },
  {
    path: '/datenschutz',
    priority: 0.5,
    changefreq: 'yearly',
    description: 'Datenschutz (erforderlich, aber niedrigere Priorität)'
  },
  {
    path: '/impressum',
    priority: 0.5,
    changefreq: 'yearly',
    description: 'Impressum (erforderlich, aber niedrigere Priorität)'
  }
];

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  const urlEntries = routes.map(route => `  <!-- ${route.description} -->
  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n\n');

  const sitemap = `<!--
  gj-sharepic-creator
  Copyright (c) 2025-2026 temmiland

  Licensed under the Affero General Public License (AGPL) Version 3.0;
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at:
    - https://gjsharepics.temmi.land/license
-->

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf-8');
  console.log(`✅ Sitemap generated: ${OUTPUT_PATH}`);
}

generateSitemap();
