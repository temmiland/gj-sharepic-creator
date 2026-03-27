/*******************************************************************************
 * gj-sharepic-creator
 * Copyright (c) 2025-2026 temmiland
 *
 * Licensed under the Affero General Public License (AGPL) Version 3.0;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at:
 *     - https://gjsharepics.temmi.land/license
 *******************************************************************************/

import { supabase } from '@/lib/supabase';
import type { SharePicTemplate } from '@/types/template';

export async function saveTemplateToSupabase(template: SharePicTemplate): Promise<string> {
	const { data, error } = await supabase
		.from('shared_templates')
		.insert({ template })
		.select('id')
		.single();
	if (error) throw error;
	return data.id as string;
}

export async function submitTemplateForReview(template: SharePicTemplate, message?: string): Promise<void> {
	const { error } = await supabase
		.from('template_submissions')
		.insert({ template, message: message || null });
	if (error) throw error;
}

export async function loadTemplateFromSupabase(id: string): Promise<SharePicTemplate | null> {
	const { data, error } = await supabase
		.from('shared_templates')
		.select('template')
		.eq('id', id)
		.single();
	if (error) return null;
	return data.template as SharePicTemplate;
}
