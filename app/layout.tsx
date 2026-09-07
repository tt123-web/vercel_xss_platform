import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'XSS Sentinel', description: '安全事件管理控制台' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="zh-CN"><body>{children}</body></html> }
