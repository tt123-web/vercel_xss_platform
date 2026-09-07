import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

const BUILTIN_EMAIL = 'admin@sentinel.local'
const BUILTIN_PASSWORD = 'Sentinel2026!'

export async function POST() {
  try {
    await auth.api.signUpEmail({
      body: { name: 'Sentinel 管理员', email: BUILTIN_EMAIL, password: BUILTIN_PASSWORD },
    })
  } catch {
    // The account already exists on normal subsequent logins.
  }

  return NextResponse.json({ email: BUILTIN_EMAIL, password: BUILTIN_PASSWORD })
}
