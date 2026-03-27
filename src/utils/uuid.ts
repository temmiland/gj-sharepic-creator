/**
 * UUID v4 generator with fallback for iOS < 15.4 where crypto.randomUUID() is unavailable.
 */
export function generateUUID(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}
	// Fallback using crypto.getRandomValues (available since iOS 6)
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = crypto.getRandomValues(new Uint8Array(1))[0] & 15;
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
}
