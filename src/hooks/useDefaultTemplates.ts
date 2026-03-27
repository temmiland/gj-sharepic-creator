/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { SharePicTemplate } from '@/types/template';

/**
 * Loads enabled default templates from Supabase for the given type.
 * Falls back to the provided hardcoded templates if the fetch fails or returns nothing.
 */
export function useDefaultTemplates(
	templateType: 'sharepic' | 'overlay',
	fallback: SharePicTemplate[],
): SharePicTemplate[] {
	const [templates, setTemplates] = useState<SharePicTemplate[]>(fallback);

	useEffect(() => {
		let mounted = true;
		supabase
			.from('default_templates')
			.select('template, sort_order')
			.eq('template_type', templateType)
			.eq('enabled', true)
			.order('sort_order')
			.then(({ data, error }) => {
				if (!mounted) return;
				if (error) {
					console.error('Failed to load default templates:', error);
					return;
				}
				if (data && data.length > 0) {
					setTemplates(data.map(row => row.template as SharePicTemplate));
				}
			});
		return () => { mounted = false; };
	}, [templateType]);

	return templates;
}
