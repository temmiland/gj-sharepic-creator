/******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *     https://gjsharepics.temmi.land/license
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *****************************************************************************/

/// <reference types="vite/client" />

type ColorSet = {
	name: string;
	backgroundColor: string;
	accentColor: string;
};

type HighlightColor = {
	name: string;
	backgroundColor: string;
};

type Pictogram = {
	name: string;
	path: string;
};

type PictogramPostion = {
	x: number,
	y: number
}

type BackgroundPosition = {
	displayName: string;
	value: string;
};
