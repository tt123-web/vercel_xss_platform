import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const origin = (value?: string) => value ? (value.startsWith('http') ? value : `https://${value}`) : undefined
const baseURL = origin(process.env.BETTER_AUTH_URL) || origin(process.env.VERCEL_PROJECT_PRODUCTION_URL) || origin(process.env.VERCEL_URL) || 'http://localhost:3000'
const trustedOrigins = [baseURL, 'http://localhost:3000', origin(process.env.V0_RUNTIME_URL), origin(process.env.V0_DEV_APP_URL), origin(process.env.V0_BUILD_URL), origin(process.env.V0_SANDBOX_URL), origin(process.env.VERCEL_URL), origin(process.env.VERCEL_PROJECT_PRODUCTION_URL)].filter(Boolean) as string[]

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,
  baseURL,
  trustedOrigins,
  emailAndPassword: { enabled: true },
  ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } } : {}),
})
