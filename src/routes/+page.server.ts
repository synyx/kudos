import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const kudos = await db.query.kudos.findMany({});
	return { kudos };
};
