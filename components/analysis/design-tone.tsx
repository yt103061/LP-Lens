import { type AnalysisResult } from '@/lib/ai/analyzer'
import { cn } from '@/lib/utils'
import { Palette, Type, Space, Eye } from 'lucide-react'

interface DesignToneProps {
  designTone: AnalysisResult['designTone']
}

const WHITESPACE_LABELS: Record<string, string> = {
  tight: '密度が高い',
  medium: '標準的',
  spacious: 'ゆとりがある',
}

const FONT_LABELS: Record<string, string> = {
  serif: 'セリフ体（伝統的）',
  'sans-serif': 'サンセリフ体（モダン）',
  display: 'ディスプレイ体（装飾的）',
  mixed: '複数フォント混在',
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = size / 2 - 8
  const circumference = 2 * Math.PI * radius
  const progress = (score / 100) * circumference
  const scoreColor =
    score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(45, 45, 78, 0.8)"
          strokeWidth="6"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={scoreColor}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{score}</span>
      </div>
    </div>
  )
}

export function DesignTone({ designTone }: DesignToneProps) {
  return (
    <div className="space-y-5">
      {/* Score + Impression */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-surface-card border border-surface-border">
        <ScoreRing score={designTone.designScore} size={84} />
        <div>
          <p className="text-xs text-slate-500 mb-1">デザインスコア</p>
          <p className="text-white font-medium leading-relaxed">{designTone.overallImpression}</p>
          <p className="text-sm text-violet-300 mt-1">{designTone.colorMood}</p>
        </div>
      </div>

      {/* Color Palette */}
      {designTone.colorPalette && designTone.colorPalette.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-400">カラーパレット</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {designTone.colorPalette.map((color, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-white/10 shadow-md"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                <span className="text-xs font-mono text-slate-500">{color}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attributes grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
          <div className="flex items-center gap-2 mb-1.5">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">フォントスタイル</span>
          </div>
          <p className="text-sm text-slate-200">
            {FONT_LABELS[designTone.fontStyle] ?? designTone.fontStyle}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
          <div className="flex items-center gap-2 mb-1.5">
            <Space className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">余白感</span>
          </div>
          <p className="text-sm text-slate-200">
            {WHITESPACE_LABELS[designTone.whitespaceLevel] ?? designTone.whitespaceLevel}
          </p>
        </div>
      </div>

      {/* Score bar */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <div className="flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs text-slate-500">デザイン品質スコア</span>
          </div>
          <span className="text-xs font-mono text-slate-400">{designTone.designScore}/100</span>
        </div>
        <div className="h-2 bg-surface-border rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              designTone.designScore >= 75
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : designTone.designScore >= 50
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                : 'bg-gradient-to-r from-red-500 to-red-400'
            )}
            style={{ width: `${designTone.designScore}%` }}
          />
        </div>
      </div>
    </div>
  )
}
