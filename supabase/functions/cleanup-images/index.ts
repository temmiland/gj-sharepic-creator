import { createClient } from 'jsr:@supabase/supabase-js@2';

const MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000; // 2 days

Deno.serve(async () => {
	const supabase = createClient(
		Deno.env.get('SUPABASE_URL')!,
		Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
	);

	const cutoff = Date.now() - MAX_AGE_MS;
	const toDelete: string[] = [];
	let offset = 0;

	// Page through all files (Storage list() returns max 100 per call)
	while (true) {
		const { data: files, error } = await supabase.storage
			.from('images')
			.list('', { limit: 100, offset });

		if (error) return new Response(error.message, { status: 500 });
		if (!files || files.length === 0) break;

		for (const file of files) {
			const ts = parseInt(file.name.split('-')[0], 10);
			if (!isNaN(ts) && ts < cutoff) {
				toDelete.push(file.name);
			}
		}

		if (files.length < 100) break;
		offset += 100;
	}

	if (toDelete.length > 0) {
		const { error } = await supabase.storage.from('images').remove(toDelete);
		if (error) return new Response(error.message, { status: 500 });

		const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
		const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
		if (botToken && chatId) {
			try {
				const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chat_id: chatId,
						text: `🗑️ Cleanup: ${toDelete.length} alte Bild${toDelete.length === 1 ? '' : 'er'} gelöscht`,
					}),
				});
				if (!res.ok) console.error('Telegram notification failed:', res.status);
			} catch (err) {
				console.error('Telegram notification error:', err);
			}
		}
	}

	return new Response(`Deleted ${toDelete.length} files`, { status: 200 });
});
