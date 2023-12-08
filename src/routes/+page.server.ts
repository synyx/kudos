import { PrismaClient, type Kudo } from '@prisma/client';
import type { PageServerLoad } from './$types';
const prisma = new PrismaClient();

export const load: PageServerLoad<{ kudos: Kudo[] }> = async () => {
  const kudos = await prisma.kudo.findMany();
  return { kudos };
};
