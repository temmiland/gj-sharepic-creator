import { describe, it, expect } from 'vitest';
import { generateUUID } from '@/utils/uuid';

describe('generateUUID', () => {
	it('generates a valid UUID v4 format', () => {
		const uuid = generateUUID();
		expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
	});

	it('generates unique UUIDs', () => {
		const uuids = new Set(Array.from({ length: 100 }, () => generateUUID()));
		expect(uuids.size).toBe(100);
	});
});
