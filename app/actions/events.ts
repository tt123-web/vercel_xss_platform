'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { and, eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createEvent(input: { title: string; type: string; source: string; payload?: string }) {
  const userId = await getUserId()
  await db.insert(events).values({ userId, title: input.title.slice(0, 160), type: input.type.slice(0, 80), source: input.source.slice(0, 160), payload: input.payload?.slice(0, 10000) || '{}' })
  revalidatePath('/')
}

export async function updateEventStatus(id: number, status: string) {
  const userId = await getUserId()
  await db.update(events).set({ status: status.slice(0, 32) }).where(and(eq(events.id, id), eq(events.userId, userId)))
  revalidatePath('/')
}

export async function deleteEvent(id: number) {
  const userId = await getUserId()
  await db.delete(events).where(and(eq(events.id, id), eq(events.userId, userId)))
  revalidatePath('/')
}
