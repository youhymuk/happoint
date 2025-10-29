import { defineConfig } from 'drizzle-kit';

const DBUrl = process.env.DATABASE_URL!;

if (!DBUrl) throw new Error('DATABASE_URL is not defined');

export default defineConfig({
	schema: './drizzle/schema.ts',
	out: './drizzle/migrations',
	dialect: 'postgresql',
	strict: true,
	verbose: true,
	dbCredentials: {
		url: DBUrl,
	},
});
