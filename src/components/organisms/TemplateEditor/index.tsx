/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useSharePic } from '@/context/SharePicContext';
import { colorSets, highlightColors } from '@/constants/colors';
import { backgroundPositions } from '@/constants/background-positions';
import { EditorColorSet } from '@/components/organisms/EditorColorSet';
import { EditorHighlightColor } from '@/components/organisms/EditorHighlightColor';
import { EditorBackgroundImage } from '@/components/molecules/EditorBackgroundImage';
import { EditorBackgroundPosition } from '@/components/molecules/EditorBackgroundPosition';
import { EditorBackgroundBlur } from '@/components/molecules/EditorBackgroundBlur';
import { EditorBackgroundBrightness } from '@/components/molecules/EditorBackgroundBrightness';
import { Accordion } from '@/components/molecules/Accordion';
import { ElementEditor } from '@/components/organisms/ElementEditor';
import { AddElementButton } from '@/components/organisms/AddElementButton';
import { TemplateIOSection } from '@/components/organisms/TemplateIOSection';

export { AddElementButton } from '@/components/organisms/AddElementButton';

export function TemplateEditor() {
	const { state, dispatch } = useSharePic();

	return (
		<>
			<Accordion summary="Farben">
				<EditorColorSet
					colorSets={colorSets}
					colorSet={state.colorSet}
					handleColorSet={(e: React.ChangeEvent<HTMLInputElement>) =>
						dispatch({
							type: 'SET_COLOR_SET',
							payload: colorSets.find(c => c.name === e.target.value) ?? colorSets[0],
						})
					}
				/>
				<EditorHighlightColor
					highlightColors={highlightColors}
					highlightColor={state.highlightColor}
					handleHighlightColor={(e: React.ChangeEvent<HTMLInputElement>) =>
						dispatch({
							type: 'SET_HIGHLIGHT_COLOR',
							payload: highlightColors.find(c => c.name === e.target.value) ?? highlightColors[0],
						})
					}
				/>
			</Accordion>

			<Accordion summary="Hintergrund">
				<EditorBackgroundImage
					handleBackgroundImage={(dataUrl: string) =>
						dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: dataUrl, uploaded: true })
					}
					handleFileDelete={() =>
						dispatch({ type: 'SET_BACKGROUND_IMAGE', payload: null })
					}
				/>
				<EditorBackgroundPosition
					position={state.backgroundPosition}
					handlePosition={(e: React.ChangeEvent<HTMLSelectElement>) =>
						dispatch({
							type: 'SET_BACKGROUND_POSITION',
							payload: backgroundPositions.find(bp => bp.value === e.target.value) ?? backgroundPositions[0],
						})
					}
				/>
				<EditorBackgroundBlur
					blur={state.backgroundBlur}
					handleBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
						dispatch({ type: 'SET_BACKGROUND_BLUR', payload: Number(e.target.value) })
					}
				/>
				<EditorBackgroundBrightness
					brightness={state.backgroundBrightness}
					handleBrightness={(e: React.ChangeEvent<HTMLInputElement>) =>
						dispatch({ type: 'SET_BACKGROUND_BRIGHTNESS', payload: Number(e.target.value) })
					}
				/>
			</Accordion>

			<Accordion summary="Elemente">
				{state.elements.map(element => (
					<ElementEditor key={element.id} element={element} />
				))}
				<AddElementButton />
			</Accordion>

			<Accordion summary="Template speichern/laden">
				<TemplateIOSection />
			</Accordion>
		</>
	);
}
