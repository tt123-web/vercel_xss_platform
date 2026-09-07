'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAuthClient } from 'better-auth/react'

const client = createAuthClient({ baseURL: typeof window === 'undefined' ? undefined : window.location.origin })

export function AuthForm() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@sentinel.local')
  const [password, setPassword] = useState('Sentinel2026!')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError('')
    await fetch('/api/auth/bootstrap', { method: 'POST' })
    const result = await client.signIn.email({ email, password })
    if (result.error) {
      setError('账号或密码不正确，请重试。')
      setPending(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return <section className="panel w-full max-w-md p-8"><div className="mb-8"><div className="mb-5 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[#62d6c9] font-bold text-[#0b1220]">X</div><span className="text-sm font-semibold tracking-[0.18em] text-[#62d6c9]">SENTINEL</span></div><h1 className="text-3xl font-semibold tracking-tight">安全控制台</h1><p className="muted mt-2 text-sm">使用内置管理员账号进入事件管理后台。</p></div><form onSubmit={submit} className="flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm"><span>管理员邮箱</span><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-lg border border-[#24334d] bg-[#0b1220] px-3 py-3 outline-none focus:border-[#62d6c9]" placeholder="you@example.com" /></label><label className="flex flex-col gap-2 text-sm"><span>密码</span><input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-lg border border-[#24334d] bg-[#0b1220] px-3 py-3 outline-none focus:border-[#62d6c9]" placeholder="至少 8 位字符" /></label>{error && <p className="text-sm text-[#f07c87]">{error}</p>}<button disabled={pending} className="mt-2 rounded-lg bg-[#62d6c9] px-4 py-3 font-semibold text-[#0b1220] disabled:opacity-60">{pending ? '登录中…' : '登录控制台'}</button></form><p className="muted mt-6 text-center text-xs">内置管理员账号 · 无需注册<br />账号：admin@sentinel.local · 密码：Sentinel2026!</p></section>
}
