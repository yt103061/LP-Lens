'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Globe, Loader2, Zap } from 'lucide-react'

export default function NewLPPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!url) {
      setError('URLを入力してください')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/lp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, name }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.limitReached) {
          setError(data.error)
        } else {
          setError(data.error ?? 'LP の追加に失敗しました')
        }
        setLoading(false)
        return
      }

      // Redirect to LP detail page which will trigger analysis
      router.push(`/lp/${data.lp.id}`)
    } catch {
      setError('サーバーエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        ダッシュボードに戻る
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">LPを追加</h1>
        <p className="text-slate-400">
          URLを入力するだけで、AIがLPの構造を自動分析します。
        </p>
      </div>

      {/* Form */}
      <div className="bg-[#1a1a2e] rounded-2xl border border-[#2d2d4e] p-6 sm:p-8">
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* URL input */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5" htmlFor="url">
              LP の URL <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/lp"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0f0f23] border border-[#2d2d4e] text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
              />
            </div>
            <p className="text-xs text-slate-600 mt-1.5">
              http:// または https:// から始まるURLを入力してください
            </p>
          </div>

          {/* Name input */}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5" htmlFor="name">
              LP の名前（任意）
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: サービス名 春季LP"
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f23] border border-[#2d2d4e] text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
            />
          </div>

          {/* What happens */}
          <div className="p-4 rounded-xl bg-[#0f0f23] border border-[#2d2d4e]">
            <p className="text-xs text-slate-500 font-medium mb-3">分析で出力される内容</p>
            <div className="space-y-2">
              {[
                'セクション構成マップ（Hero → CTA の流れを可視化）',
                '情報設計の分析（CTA数・テキスト/ビジュアル比率・改善点）',
                'デザイントーン判定（配色・フォント・余白・スコア）',
                'SNSシェア用のビジュアルカード',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                  <p className="text-xs text-slate-400">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                追加中...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                LP を追加して分析する
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 rounded-xl border border-surface-border bg-surface-card">
        <p className="text-xs text-slate-500 font-medium mb-2">Tips</p>
        <ul className="space-y-1.5">
          <li className="text-xs text-slate-600">• パスワード保護されたLPは分析できません</li>
          <li className="text-xs text-slate-600">• JavaScriptで動的に生成されるLPは分析精度が下がる場合があります</li>
          <li className="text-xs text-slate-600">• Figmaファイルの分析はプロプランでご利用いただけます</li>
        </ul>
      </div>
    </div>
  )
}
