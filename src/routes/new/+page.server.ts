import type { KudoTitles } from '$lib/utils/kudoTitles';
import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

const prisma = new PrismaClient();

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const kudoTitleId = (data.get('kudoTitle')?.toString()?.trim() ?? 'WELL_DONE') as KudoTitles;
    const content = data.get('content')?.toString()?.trim();
    const to = data.get('to')?.toString()?.trim();
    const from = data.get('from')?.toString()?.trim();
    const img = data.get('img')?.toString()?.trim() ?? '';

    const invalidData = [
      [to, 'to'],
      [from, 'from'],
    ]
      .filter(([data]) => {
        if (!data || data.length <= 0) {
          return true;
        }
        return false;
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, field]) => field)
      .join(', ');

    if (invalidData || invalidData.length > 0) {
      return fail(400, { kudoTitleId, content, from, to, img, error: `invalid ${invalidData}` });
    }

    await prisma.kudo.create({
      data: {
        kudoTitle: kudoTitleId,
        content: content,
        to,
        from,
        img,
      },
    });
  },
};
