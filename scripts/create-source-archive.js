/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const outputPath = join(rootDir, 'public', 'source-code.zip');

try {
  execSync(`git archive --format=zip HEAD -o "${outputPath}"`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log(`✔ Source archive created: ${outputPath}`);
} catch (err) {
  console.error('✘ Failed to create source archive:', err.message);
  process.exit(1);
}
