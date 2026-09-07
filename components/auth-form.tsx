'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createAuthClient } from 'better-auth/react'

const client = createAuthClient()

export function AuthForm({ mode = 'sign-in' }: { mode?: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const isSignUp = mode === 'sign-up'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setError('')
    const result = isSignUp
      ? await client.signUp.email({ name, email, password })
      : await client.signIn.email({ email, password })
    if (result.error) {
      setError(isSignUp ? '注册失败，请检查信息后重试。' : '邮箱或密码不正确，请重试。')
      setPending(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return <section className="panel w-full max-w-md p-8"><div className="mb-8"><div className="mb-5 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[#62d6c9] font-bold text-[#0b1220]">X</div><span className="text-sm font-semibold tracking-[0.18em] text-[#62d6c9]">SENTINEL</span></div><h1 className="text-3xl font-semibold tracking-tight">{isSignUp ? '创建控制台' : '安全控制台'}</h1><p className="muted mt-2 text-sm">{isSignUp ? '创建账户以开始管理安全事件。' : '登录以查看你的事件收集与检测状态。'}</p></div><form onSubmit={submit} className="flex flex-col gap-4">{isSignUp && <label className="flex flex-col gap-2 text-sm"><span>名称</span><input required value={name} onChange={e => setName(e.target.value)} className="rounded-lg border border-[#24334d] bg-[#0b1220] px-3 py-3 outline-none focus:border-[#62d6c9]" placeholder="你的名称" /></label>}<label className="flex flex-col gap-2 text-sm"><span>邮箱地址</span><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-lg border border-[#24334d] bg-[#0b1220] px-3 py-3 outline-none focus:border-[#62d6c9]" placeholder="you@example.com" /></label><label className="flex flex-col gap-2 text-sm"><span>密码</span><input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-lg border border-[#24334d] bg-[#0b1220] px-3 py-3 outline-none focus:border-[#62d6c9]" placeholder="至少 8 位字符" /></label>{error && <p className="text-sm text-[#f07c87]">{error}</p>}<button disabled={pending} className="mt-2 rounded-lg bg-[#62d6c9] px-4 py-3 font-semibold text-[#0b1220] disabled:opacity-60">{pending ? (isSignUp ? '创建中…' : '登录中…') : (isSignUp ? '创建账户' : '登录控制台')}</button></form><p className="muted mt-6 text-center text-sm">{isSignUp ? '已有账户？' : '还没有账户？'} <Link className="text-[#62d6c9] hover:underline" href={isSignUp ? '/sign-in' : '/sign-up'}>{isSignUp ? '返回登录' : '创建账户'}</Link></p></section>
}
