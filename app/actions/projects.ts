'use server'

import { randomBytes } from 'node:crypto'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { eq, and } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events, projects } from '@/lib/db/schema'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createProject(name: string) {
  const userId = await getUserId()
  const [project] = await db.insert(projects).values({ userId, name: name.trim().slice(0, 80) || '我的 XSS 接收器', token: randomBytes(18).toString('hex') }).returning()
  revalidatePath('/')
  return project
}

export async function updateEventStatus(id: number, status: string) {
  const userId = await getUserId()
  await db.update(events).set({ status }).where(and(eq(events.id, id), eq(events.userId, userId)))
  revalidatePath('/')
}

export async function deleteEvent(id: number) {
  const userId = await getUserId()
  await db.delete(events).where(and(eq(events.id, id), eq(events.userId, userId)))
  revalidatePath('/')
}
