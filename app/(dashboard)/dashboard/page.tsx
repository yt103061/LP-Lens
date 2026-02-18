import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Plus, ExternalLink, Clock, CheckCircle2, AlertCircle, Loader2, Lock } from 'lucide-react'
import { formatRelativeTime, getDomainFromUrl, PLAN_LIMITS, type Plan } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const lps = await prisma.landingPage.findMany({
    where: { userId: session.user.id },
    include: {
      snapshots: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const plan = session.user.plan as Plan
  const planConfig = PLAN_LIMITS[plan]
  const lpLimit = planConfig?.lpCount ?? 1
  const canAddMore = lps.length < lpLimit

  function SnapshotStatusBadge({ status }: { status: string }) {
    if (status === 'done') {
      return (
        <span className="flex items-center gap-1 text-xs text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          分析完了
        </span>
      )
    }
    if (status === 'analyzing') {
      return (
        <span className="flex items-center gap-1 text-xs text-blue-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          分析中...
        </span>
      )
    }
    if (status === 'error') {
      return (
        <span className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="w-3.5 h-3.5" />
          エラー
        </span>
      )
    }
    return (
      <span className="flex items-center gap-1 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5" />
        未分析
      </span>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            ダッシュボード
          </h1>
          <p className="text-slate-400 text-sm">
            {lps.length > 0
              ? `${lps.length}本のLPを管理中`
              : 'LPを追加して分析を始めましょう'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Plan badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-surface-border text-sm text-slate-400">
            <span className="w-2 h-2 rounded-full bg-violet-400"></span>
            {planConfig?.label} ({lps.length}/{lpLimit === Infinity ? '∞' : lpLimit} LP)
          </div>

          {canAddMore ? (
            <Link
              href="/lp/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-900/20"
            >
              <Plus className="w-4 h-4" />
              LP を追加
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-card border border-surface-border text-slate-500 text-sm">
              <Lock className="w-4 h-4" />
              上限に達しました
            </div>
          )}
        </div>
      </div>

      {/* LP limit warning */}
      {!canAddMore && (
        <div className="mb-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/20 flex items-center justify-between gap-4">
          <div>
            <p className="text-violet-300 text-sm font-medium">
              {planConfig?.label}の上限に達しました
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              プランをアップグレードして、より多くのLPを管理しましょう
            </p>
          </div>
          <Link
            href="/settings"
            className="shrink-0 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            アップグレード
          </Link>
        </div>
      )}

      {/* LP Grid */}
      {lps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center mb-5">
            <Plus className="w-8 h-8 text-slate-600" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">最初のLPを分析しましょう</h2>
          <p className="text-slate-500 text-sm max-w-sm mb-6">
            URLを入力するだけで、AIがセクション構成・デザイントーン・情報設計を自動分析します。
          </p>
          <Link
            href="/lp/new"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            LP を追加する
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lps.map((lp) => {
            const snapshot = lp.snapshots[0]
            const analysis = snapshot?.analysisResult
              ? JSON.parse(snapshot.analysisResult)
              : null

            return (
              <Link
                key={lp.id}
                href={`/lp/${lp.id}`}
                className="group block p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-violet-500/30 hover:bg-surface-hover transition-all"
              >
                {/* Status */}
                <div className="flex items-start justify-between mb-3">
                  <SnapshotStatusBadge status={snapshot?.status ?? 'pending'} />
                  <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>

                {/* Name & URL */}
                <h3 className="text-white font-semibold mb-1 truncate">
                  {lp.name ?? getDomainFromUrl(lp.url)}
                </h3>
                <p className="text-slate-500 text-xs truncate mb-3">{lp.url}</p>

                {/* Analysis summary */}
                {analysis && (
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-center py-2 px-3 rounded-lg bg-[#0f0f23] border border-surface-border">
                      <p className="text-lg font-bold text-white">
                        {analysis.designTone?.designScore ?? '–'}
                      </p>
                      <p className="text-xs text-slate-500">デザイン</p>
                    </div>
                    <div className="text-center py-2 px-3 rounded-lg bg-[#0f0f23] border border-surface-border">
                      <p className="text-lg font-bold text-white">
                        {analysis.informationDesign?.structureScore ?? '–'}
                      </p>
                      <p className="text-xs text-slate-500">構造</p>
                    </div>
                  </div>
                )}

                {/* Section count */}
                {analysis?.sections && (
                  <div className="flex gap-1 mb-3">
                    {analysis.sections.slice(0, 6).map((s: { type: string }, i: number) => {
                      const colors: Record<string, string> = {
                        hero: '#3b82f6',
                        problem: '#ef4444',
                        solution: '#10b981',
                        features: '#8b5cf6',
                        social_proof: '#f59e0b',
                        pricing: '#6366f1',
                        faq: '#64748b',
                        cta: '#10b981',
                        other: '#475569',
                      }
                      return (
                        <div
                          key={i}
                          className="flex-1 h-1.5 rounded-full"
                          style={{ backgroundColor: colors[s.type] ?? '#475569' }}
                        />
                      )
                    })}
                  </div>
                )}

                {/* Date */}
                <p className="text-xs text-slate-600">
                  {snapshot ? formatRelativeTime(snapshot.createdAt) : formatRelativeTime(lp.createdAt)}に追加
                </p>
              </Link>
            )
          })}

          {/* Add LP card (if can add more) */}
          {canAddMore && (
            <Link
              href="/lp/new"
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border border-dashed border-surface-border hover:border-violet-500/40 hover:bg-violet-500/5 transition-all text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center">
                <Plus className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-slate-500 text-sm">LP を追加</p>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
