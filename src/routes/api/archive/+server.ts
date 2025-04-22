import { PrismaClient } from '@prisma/client';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
  const kudoIds = await request.json();

  try {
    await prisma.kudo.updateMany({
      data: { archived: true },
      where: { id: { in: kudoIds } },
    });
  } catch (e) {
    error(500, `couldn't archive kudos: ${e}`);
  }

  return new Response('archived');
};
