import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { events } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Dashboard } from '@/components/dashboard'

export default async function Home(){ const session=await auth.api.getSession({headers:await headers()}); if(!session?.user) redirect('/sign-in'); const rows=await db.select().from(events).where(eq(events.userId,session.user.id)).orderBy(desc(events.createdAt)).limit(8); return <Dashboard user={session.user} events={rows} /> }
