import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL;
const isDockerBuild = process.env.DOCKER_BUILDING === '1';

if (!dbUrl && !isDockerBuild) throw new Error('DATABASE_URL is not set');

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',
  dbCredentials: { url: dbUrl ?? '' },
  verbose: true,
  strict: true,
  dialect: 'postgresql',
});
