import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

const dbUrl = env.DATABASE_URL;
const isDockerBuild = env.DOCKER_BUILDING === '1';

if (!dbUrl && !isDockerBuild) throw new Error('DATABASE_URL is not set');

const client = postgres(dbUrl);

export const db = drizzle(client, { schema });
