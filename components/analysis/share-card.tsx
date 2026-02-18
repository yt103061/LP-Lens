import { type AnalysisResult } from '@/lib/ai/analyzer'
import { getDomainFromUrl } from '@/lib/utils'
import { Zap } from 'lucide-react'

const SECTION_COLORS: Record<string, string> = {
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

const SECTION_SHORT_LABELS: Record<string, string> = {
  hero: 'Hero',
  problem: '課題',
  solution: '解決策',
  features: '機能',
  social_proof: '実績',
  pricing: '料金',
  faq: 'FAQ',
  cta: 'CTA',
  other: 'その他',
}

interface ShareCardProps {
  url: string
  name?: string | null
  analysisResult: AnalysisResult
  analyzedAt?: string | Date
}

export function ShareCard({ url, name, analysisResult }: ShareCardProps) {
  const domain = getDomainFromUrl(url)
  const designScore = analysisResult.designTone.designScore
  const structureScore = analysisResult.informationDesign.structureScore

  return (
    <div
      id="share-card"
      className="bg-gradient-to-br from-[#0f0f23] via-[#1a0f3c] to-[#0f0f23] rounded-2xl border border-violet-500/20 p-6 shadow-2xl"
      style={{ maxWidth: 560 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold text-violet-400 tracking-wider uppercase">
              LP Lens Analysis
            </span>
          </div>
          <p className="text-white font-semibold text-lg leading-tight">
            {name ?? domain}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">{domain}</p>
        </div>

        {/* Score badges */}
        <div className="flex gap-2">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{
                background:
                  designScore >= 75
                    ? 'rgba(16, 185, 129, 0.15)'
                    : designScore >= 50
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                color:
                  designScore >= 75
                    ? '#10b981'
                    : designScore >= 50
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              {designScore}
            </div>
            <p className="text-xs text-slate-500 mt-1">デザイン</p>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
              style={{
                background:
                  structureScore >= 75
                    ? 'rgba(16, 185, 129, 0.15)'
                    : structureScore >= 50
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                color:
                  structureScore >= 75
                    ? '#10b981'
                    : structureScore >= 50
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              {structureScore}
            </div>
            <p className="text-xs text-slate-500 mt-1">構造</p>
          </div>
        </div>
      </div>

      {/* Section visualization */}
      <div className="mb-5">
        <p className="text-xs text-slate-500 mb-2">セクション構成</p>
        <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
          {analysisResult.sections.map((section, i) => (
            <div
              key={i}
              className="flex-1 relative group"
              style={{ backgroundColor: SECTION_COLORS[section.type] ?? '#475569', opacity: 0.8 }}
              title={section.label}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <span className="text-white text-xs font-medium px-1">
                  {SECTION_SHORT_LABELS[section.type]}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1 mt-1.5 flex-wrap">
          {analysisResult.sections.map((section, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: SECTION_COLORS[section.type] ?? '#475569' }}
              />
              <span className="text-xs text-slate-500">
                {SECTION_SHORT_LABELS[section.type]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white/5 rounded-xl p-3 mb-4">
        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
          {analysisResult.summary}
        </p>
      </div>

      {/* Key data */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 bg-white/5 rounded-lg p-2.5 text-center">
          <p className="text-lg font-bold text-white">{analysisResult.informationDesign.ctaCount}</p>
          <p className="text-xs text-slate-500">CTA数</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-2.5 text-center">
          <p className="text-sm font-bold text-white">{analysisResult.informationDesign.textVisualRatio}</p>
          <p className="text-xs text-slate-500">テキスト:画像</p>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-2.5 text-center">
          <p className="text-sm font-bold text-white">{analysisResult.sections.length}つ</p>
          <p className="text-xs text-slate-500">セクション数</p>
        </div>
      </div>

      {/* Color palette */}
      {analysisResult.designTone.colorPalette.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-500">カラー</span>
          <div className="flex gap-1">
            {analysisResult.designTone.colorPalette.slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-5 h-5 rounded border border-white/10"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <Zap className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-xs text-slate-500">lp-lens.vercel.app で無料分析</span>
        </div>
        <span className="text-xs text-slate-600">
          {new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  )
}
