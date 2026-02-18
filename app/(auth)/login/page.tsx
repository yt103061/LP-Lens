'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('メールアドレスまたはパスワードが正しくありません')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5" htmlFor="email">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-[#0f0f23] border border-[#2d2d4e] text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5" htmlFor="password">
            パスワード
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 pr-12 rounded-xl bg-[#0f0f23] border border-[#2d2d4e] text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              ログイン中...
            </>
          ) : (
            'ログイン'
          )}
        </button>
      </form>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-900/15 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">LP Lens</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a2e] rounded-2xl border border-[#2d2d4e] p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">ログイン</h1>
          <p className="text-slate-400 text-sm mb-6">
            アカウントにログインしてLPを分析する
          </p>

          <Suspense
            fallback={
              <div className="h-32 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-slate-500 mt-6">
            アカウントをお持ちでない方は{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors">
              無料登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
