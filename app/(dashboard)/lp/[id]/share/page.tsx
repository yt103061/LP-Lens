import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { type AnalysisResult } from '@/lib/ai/analyzer'
import { ShareCard } from '@/components/analysis/share-card'
import { getDomainFromUrl } from '@/lib/utils'
import Link from 'next/link'
import { Zap, ArrowLeft, Twitter } from 'lucide-react'
import type { Metadata } from 'next'

interface SharePageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const lp = await prisma.landingPage.findUnique({
    where: { id: params.id },
  })

  if (!lp) return {}

  const domain = getDomainFromUrl(lp.url)

  return {
    title: `${lp.name ?? domain} の LP分析 | LP Lens`,
    description: `LP LensによるAI構造分析レポート`,
    openGraph: {
      title: `${lp.name ?? domain} の LP分析`,
      description: 'LP LensによるAI構造分析レポート - セクション構成・デザイントーン・情報設計',
    },
  }
}

export default async function SharePage({ params }: SharePageProps) {
  const lp = await prisma.landingPage.findUnique({
    where: { id: params.id },
    include: {
      snapshots: {
        where: { status: 'done' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!lp) notFound()

  const snapshot = lp.snapshots[0]
  if (!snapshot?.analysisResult) notFound()

  const analysisResult: AnalysisResult = JSON.parse(snapshot.analysisResult)
  const domain = getDomainFromUrl(lp.url)

  const twitterText = encodeURIComponent(
    `「${lp.name ?? domain}」のLP分析をしました✨\nデザインスコア: ${analysisResult.designTone.designScore}/100\n構造スコア: ${analysisResult.informationDesign.structureScore}/100\nセクション数: ${analysisResult.sections.length}\n\n#LP分析 #LPLens`
  )
  const twitterUrl = encodeURIComponent(`${process.env.NEXTAUTH_URL}/lp/${lp.id}/share`)
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${twitterUrl}`

  return (
    <div className="min-h-screen bg-[#0f0f23]">
      {/* Minimal nav */}
      <nav className="border-b border-surface-border px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-white">LP Lens</span>
        </Link>

        <Link
          href={`/lp/${lp.id}`}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          分析詳細に戻る
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Page header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {lp.name ?? domain} の LP分析レポート
          </h1>
          <p className="text-slate-400 text-sm">
            LP LensのAIがセクション構成・デザイントーン・情報設計を分析しました
          </p>
        </div>

        {/* Share card */}
        <div className="flex justify-center mb-6">
          <ShareCard
            url={lp.url}
            name={lp.name}
            analysisResult={analysisResult}
            analyzedAt={snapshot.createdAt}
          />
        </div>

        {/* Share buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={twitterShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] font-medium hover:bg-[#1DA1F2]/20 transition-colors"
          >
            <Twitter className="w-4 h-4" />
            X (Twitter) でシェア
          </a>

          <Link
            href="/register"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
          >
            <Zap className="w-4 h-4" />
            自分のLPを無料分析する
          </Link>
        </div>

        {/* Scores detail */}
        <div className="mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-white">分析サマリー</h2>
          <div className="p-5 rounded-xl bg-surface-card border border-surface-border">
            <p className="text-slate-300 leading-relaxed">{analysisResult.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {analysisResult.informationDesign.strengths.map((s, i) => (
              <div key={i} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-sm text-slate-300">
                ✓ {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
