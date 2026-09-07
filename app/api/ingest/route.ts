import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const title = typeof body.title === 'string' ? body.title : '未命名安全事件'
  const type = typeof body.type === 'string' ? body.type : 'xss'
  const source = typeof body.source === 'string' ? body.source : 'api'
  const payload = JSON.stringify(body.payload ?? body).slice(0, 10000)
  const [event] = await db.insert(events).values({ userId: session.user.id, title: title.slice(0, 160), type: type.slice(0, 80), source: source.slice(0, 160), payload }).returning({ id: events.id })
  return NextResponse.json({ ok: true, id: event.id }, { status: 201 })
}
