'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Zap, Eye, EyeOff, Loader2, Check } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = (() => {
    if (password.length === 0) return null
    if (password.length < 8) return { level: 'weak', label: '短すぎます（8文字以上）', color: 'bg-red-500' }
    if (password.length < 12) return { level: 'medium', label: '普通', color: 'bg-yellow-500' }
    return { level: 'strong', label: '強い', color: 'bg-emerald-500' }
  })()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? '登録に失敗しました')
        setLoading(false)
        return
      }

      // Auto login after register
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        router.push('/login')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('サーバーエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center px-4">
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

        {/* Free plan badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {['LP 1本まで無料', 'クレジットカード不要', 'いつでも解約可'].map((item, i) => (
            <div key={i} className="flex items-center gap-1 text-xs text-emerald-400">
              <Check className="w-3 h-3" />
              {item}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#1a1a2e] rounded-2xl border border-[#2d2d4e] p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">無料アカウントを作成</h1>
          <p className="text-slate-400 text-sm mb-6">
            LPを分析して、勝ちパターンを蓄積しましょう
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5" htmlFor="name">
                お名前（任意）
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田 太郎"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0f0f23] border border-[#2d2d4e] text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>

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
                  placeholder="8文字以上"
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

              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {['weak', 'medium', 'strong'].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          (passwordStrength.level === 'weak' && level === 'weak') ||
                          (passwordStrength.level === 'medium' && (level === 'weak' || level === 'medium')) ||
                          passwordStrength.level === 'strong'
                            ? passwordStrength.color
                            : 'bg-[#2d2d4e]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">{passwordStrength.label}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  アカウント作成中...
                </>
              ) : (
                '無料アカウントを作成'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
              ログイン
            </Link>
          </p>

          <p className="text-center text-xs text-slate-600 mt-4">
            登録することで、
            <Link href="/terms" className="underline hover:text-slate-500">利用規約</Link>
            および
            <Link href="/privacy" className="underline hover:text-slate-500">プライバシーポリシー</Link>
            に同意したものとみなします。
          </p>
        </div>
      </div>
    </div>
  )
}
