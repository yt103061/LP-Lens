'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, LogOut, Settings, ChevronDown, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PLAN_LIMITS, type Plan } from '@/lib/utils'

interface NavProps {
  user?: {
    id: string
    email: string
    name?: string | null
    plan: string
  }
}

export function Nav({ user }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const planLabel = user ? PLAN_LIMITS[user.plan as Plan]?.label ?? '無料プラン' : null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-surface-border glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-white">LP Lens</span>
        </Link>

        {/* Nav items */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Plan badge */}
            <Link
              href="/settings"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border text-xs text-slate-400 hover:border-accent/50 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              {planLabel}
            </Link>

            {/* Dashboard link */}
            <Link
              href="/dashboard"
              className={cn(
                'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors',
                pathname.startsWith('/dashboard')
                  ? 'bg-accent/10 text-violet-300'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              ダッシュボード
            </Link>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card hover:bg-surface-hover transition-colors text-sm text-slate-300"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                  {(user.name ?? user.email)[0].toUpperCase()}
                </div>
                <span className="hidden sm:block max-w-32 truncate">
                  {user.name ?? user.email}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-surface-border bg-surface-card shadow-xl shadow-black/50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-surface-border">
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-300 hover:bg-surface-hover hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    設定
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/30"
            >
              無料で始める
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
