import type { Metadata } from 'next'
import { Noto_Sans_SC } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans_SC({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = { title: 'XSS Sentinel', description: '安全事件管理控制台' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN" className="bg-[#080f1d]"><body className={notoSans.className}>{children}</body></html> }
