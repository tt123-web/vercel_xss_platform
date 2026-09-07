import { NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { hashPassword } from 'better-auth/crypto'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { account } from '@/lib/db/schema'

const BUILTIN_EMAIL = 'admin@sentinel.local'
const BUILTIN_PASSWORD = 'Sentinel2026!'

export async function POST() {
  try {
    await auth.api.signUpEmail({
      body: { name: 'Sentinel 管理员', email: BUILTIN_EMAIL, password: BUILTIN_PASSWORD },
    })
  } catch {
    const password = await hashPassword(BUILTIN_PASSWORD)
    await db.update(account)
      .set({ password, updatedAt: new Date() })
      .where(and(eq(account.accountId, BUILTIN_EMAIL), eq(account.providerId, 'credential')))
  }

  return NextResponse.json({ email: BUILTIN_EMAIL, password: BUILTIN_PASSWORD })
}
