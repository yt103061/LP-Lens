import { type AnalysisResult } from '@/lib/ai/analyzer'
import { cn } from '@/lib/utils'
import { MousePointerClick, LayoutGrid, CheckCircle2, AlertCircle } from 'lucide-react'

interface InfoDesignProps {
  informationDesign: AnalysisResult['informationDesign']
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      : score >= 50
      ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
      : 'bg-red-500/10 text-red-400 border-red-500/30'

  return (
    <span className={cn('px-2.5 py-1 rounded-full text-sm font-bold border', color)}>
      {score}
    </span>
  )
}

export function InfoDesign({ informationDesign }: InfoDesignProps) {
  return (
    <div className="space-y-5">
      {/* First view summary */}
      <div className="p-4 rounded-xl bg-surface-card border border-surface-border">
        <p className="text-xs text-slate-500 mb-2">ファーストビューで伝わること</p>
        <p className="text-sm text-slate-200 leading-relaxed">
          {informationDesign.firstViewSummary}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-center">
          <MousePointerClick className="w-4 h-4 text-violet-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{informationDesign.ctaCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">CTA数</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-center">
          <LayoutGrid className="w-4 h-4 text-blue-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">{informationDesign.textVisualRatio}</p>
          <p className="text-xs text-slate-500 mt-0.5">テキスト:ビジュアル</p>
        </div>

        <div className="p-3 rounded-xl bg-surface-card border border-surface-border text-center">
          <div className="flex justify-center mb-1">
            <ScoreBadge score={informationDesign.structureScore} />
          </div>
          <p className="text-xs text-slate-500 mt-1">構造スコア</p>
        </div>
      </div>

      {/* CTA positions */}
      {informationDesign.ctaPositions && informationDesign.ctaPositions.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 mb-2">CTA配置位置</p>
          <div className="flex flex-wrap gap-2">
            {informationDesign.ctaPositions.map((pos, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs text-violet-300"
              >
                {pos}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {informationDesign.strengths && informationDesign.strengths.length > 0 && (
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400">強み</span>
            </div>
            <ul className="space-y-1.5">
              {informationDesign.strengths.map((strength, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {informationDesign.improvements && informationDesign.improvements.length > 0 && (
          <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-semibold text-orange-400">改善ポイント</span>
            </div>
            <ul className="space-y-1.5">
              {informationDesign.improvements.map((improvement, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-1.5">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {improvement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
