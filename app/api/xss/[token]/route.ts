import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { events, projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  return receive(request, await params)
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  return receive(request, await params)
}

async function receive(request: Request, { token }: { token: string }) {
  const [project] = await db.select().from(projects).where(eq(projects.token, token)).limit(1)
  if (!project) return NextResponse.json({ error: '接收地址不存在' }, { status: 404 })
  const url = new URL(request.url)
  const body = request.method === 'POST' ? await request.json().catch(() => ({})) : Object.fromEntries(url.searchParams)
  const payload = JSON.stringify({ method: request.method, url: request.url, headers: Object.fromEntries(request.headers), body }).slice(0, 20000)
  const [event] = await db.insert(events).values({ userId: project.userId, projectId: project.id, title: '检测到 XSS 回连', type: 'xss', source: '唯一接收地址', payload }).returning({ id: events.id })
  return NextResponse.json({ ok: true, eventId: event.id, message: '已接收并记录' }, { status: 201 })
}
