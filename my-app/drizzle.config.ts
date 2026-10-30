import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import { tursoURL } from '#/db'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'turso',
  dbCredentials: {
    url: tursoURL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
})
