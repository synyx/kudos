import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { kudos } from '$lib/server/db/schema';
import { inArray } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	const kudoIds = await request.json();

	try {
		await db.update(kudos).set({ archived: true }).where(inArray(kudos.id, kudoIds)).execute();
	} catch (e) {
		error(500, `couldn't archive kudos: ${e}`);
	}

	return new Response('archived');
};
