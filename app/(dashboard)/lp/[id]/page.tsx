'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  Share2,
  Loader2,
  AlertCircle,
  Lock,
  BarChart3,
  GitCompare,
  Clock,
} from 'lucide-react'
import { SectionMap } from '@/components/analysis/section-map'
import { DesignTone } from '@/components/analysis/design-tone'
import { InfoDesign } from '@/components/analysis/info-design'
import { ShareCard } from '@/components/analysis/share-card'
import { type AnalysisResult } from '@/lib/ai/analyzer'
import { getDomainFromUrl, formatRelativeTime } from '@/lib/utils'

interface LPData {
  id: string
  url: string
  name: string | null
  snapshots: Array<{
    id: string
    status: string
    screenshotPath: string | null
    analysisResult: string | null
    version: number
    errorMessage: string | null
    createdAt: string
  }>
}

type TabKey = 'sections' | 'design' | 'info' | 'share'

export default function LPDetailPage() {
  const params = useParams<{ id: string }>()
  const [lp, setLp] = useState<LPData | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('sections')

  const fetchLP = useCallback(async () => {
    const res = await fetch(`/api/lp/${params.id}`)
    if (!res.ok) return null
    const data = await res.json()
    return data.lp as LPData
  }, [params.id])

  const triggerAnalysis = useCallback(async () => {
    setAnalyzing(true)
    setError('')

    const res = await fetch(`/api/lp/${params.id}/analyze`, { method: 'POST' })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? '分析に失敗しました')
    }

    // Refetch LP data
    const updatedLp = await fetchLP()
    if (updatedLp) setLp(updatedLp)
    setAnalyzing(false)
  }, [params.id, fetchLP])

  useEffect(() => {
    async function init() {
      const data = await fetchLP()
      setLp(data)
      setLoading(false)

      if (data) {
        const latest = data.snapshots[0]
        // Auto-trigger analysis if snapshot is pending
        if (!latest || latest.status === 'pending') {
          await triggerAnalysis()
        }
      }
    }
    init()
  }, [fetchLP, triggerAnalysis])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
      </div>
    )
  }

  if (!lp) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">LPが見つかりません</h2>
        <Link href="/dashboard" className="text-violet-400 hover:text-violet-300">
          ダッシュボードに戻る
        </Link>
      </div>
    )
  }

  const snapshot = lp.snapshots[0]
  const analysisResult: AnalysisResult | null = snapshot?.analysisResult
    ? JSON.parse(snapshot.analysisResult)
    : null

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'sections', label: 'セクション構成' },
    { key: 'design', label: 'デザイントーン' },
    { key: 'info', label: '情報設計' },
    { key: 'share', label: 'シェアカード' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        ダッシュボード
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white mb-1 truncate">
            {lp.name ?? getDomainFromUrl(lp.url)}
          </h1>
          <a
            href={lp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-slate-400 hover:text-violet-400 text-sm transition-colors"
          >
            {lp.url}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {snapshot && (
            <p className="text-xs text-slate-600 mt-1">
              {formatRelativeTime(snapshot.createdAt)}に分析
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={triggerAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border bg-surface-card text-slate-300 text-sm hover:border-violet-500/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            再分析
          </button>

          {analysisResult && (
            <Link
              href={`/lp/${lp.id}/share`}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-600/30 transition-all"
            >
              <Share2 className="w-4 h-4" />
              シェア
            </Link>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Analysis loading */}
      {(analyzing || snapshot?.status === 'analyzing') && (
        <div className="mb-6 p-6 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-center">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
          <p className="text-violet-300 font-medium">AIがLPを分析中...</p>
          <p className="text-slate-500 text-sm mt-1">
            スクリーンショットを取得してClaudeが構造を分析しています。しばらくお待ちください。
          </p>
        </div>
      )}

      {/* Main content */}
      {analysisResult ? (
        <div>
          {/* Scores row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-center">
              <p className="text-3xl font-bold text-white">{analysisResult.designTone.designScore}</p>
              <p className="text-xs text-slate-500 mt-1">デザインスコア</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-center">
              <p className="text-3xl font-bold text-white">{analysisResult.informationDesign.structureScore}</p>
              <p className="text-xs text-slate-500 mt-1">構造スコア</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-center">
              <p className="text-3xl font-bold text-white">{analysisResult.sections.length}</p>
              <p className="text-xs text-slate-500 mt-1">セクション数</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-card border border-surface-border text-center">
              <p className="text-3xl font-bold text-white">{analysisResult.informationDesign.ctaCount}</p>
              <p className="text-xs text-slate-500 mt-1">CTA数</p>
            </div>
          </div>

          {/* Summary */}
          <div className="p-5 rounded-xl bg-surface-card border border-surface-border mb-6">
            <p className="text-sm text-slate-400 mb-2">AI分析サマリー</p>
            <p className="text-slate-200 leading-relaxed">{analysisResult.summary}</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-xl bg-surface-card border border-surface-border mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-violet-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="bg-surface-card rounded-2xl border border-surface-border p-5 sm:p-6">
            {activeTab === 'sections' && (
              <SectionMap sections={analysisResult.sections} />
            )}
            {activeTab === 'design' && (
              <DesignTone designTone={analysisResult.designTone} />
            )}
            {activeTab === 'info' && (
              <InfoDesign informationDesign={analysisResult.informationDesign} />
            )}
            {activeTab === 'share' && (
              <div>
                <p className="text-sm text-slate-400 mb-4">
                  このカードをスクリーンショットしてSNSでシェアしましょう
                </p>
                <ShareCard
                  url={lp.url}
                  name={lp.name}
                  analysisResult={analysisResult}
                  analyzedAt={snapshot?.createdAt}
                />
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/lp/${lp.id}/share`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-surface-border text-slate-300 text-sm hover:border-violet-500/30 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    シェアページを開く
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Paid feature placeholders */}
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-slate-500 mb-4">有料プランで利用可能な機能</h3>

            <div className="p-5 rounded-xl border border-surface-border bg-surface-card/50 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-emerald-400/50" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium flex items-center gap-2">
                      CVR追跡グラフ
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    </p>
                    <p className="text-xs text-slate-600">
                      GA4連携または手動入力でCVRをトラッキング
                    </p>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs hover:bg-violet-600/30 transition-colors"
                >
                  ¥500/月〜
                </Link>
              </div>
              {/* Blurred preview */}
              <div className="mt-4 h-24 rounded-lg bg-[#0f0f23] border border-surface-border flex items-end px-3 pb-3 gap-1.5 overflow-hidden">
                {[40, 55, 48, 62, 58, 70, 65, 75, 68, 80].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-emerald-500/20 rounded-t"
                    style={{ height: `${h}%`, filter: 'blur(1px)' }}
                  />
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-surface-border bg-surface-card/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <GitCompare className="w-5 h-5 text-blue-400/50" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium flex items-center gap-2">
                      改修差分検出 + 因果仮説
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    </p>
                    <p className="text-xs text-slate-600">
                      改修前後の構造差分を自動検出し、CVR変化と紐づける
                    </p>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs hover:bg-violet-600/30 transition-colors"
                >
                  ¥500/月〜
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  'Hero画像を人物写真に変更 → CVR +?.?%',
                  'CTAボタンを赤→緑に変更 → CVR +?.?%',
                  'ヘッドラインを短縮 → CVR +?.?%',
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#0f0f23] border border-surface-border"
                    style={{ filter: 'blur(2px)' }}
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-xs text-slate-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-surface-border bg-surface-card/50">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-violet-400/50" />
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium flex items-center gap-2">
                      変更履歴タイムライン
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    </p>
                    <p className="text-xs text-slate-600">
                      改修のたびに記録される変更履歴とCVR推移
                    </p>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400 text-xs hover:bg-violet-600/30 transition-colors"
                >
                  ¥500/月〜
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : snapshot?.status === 'error' ? (
        <div className="text-center py-16">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">分析エラー</h3>
          <p className="text-slate-400 text-sm mb-4">
            {snapshot.errorMessage ?? '分析中にエラーが発生しました'}
          </p>
          <button
            onClick={triggerAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 disabled:opacity-50 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            再試行
          </button>
        </div>
      ) : null}
    </div>
  )
}
