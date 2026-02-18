import { type SectionType } from '@/lib/ai/analyzer'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  AlertCircle,
  Lightbulb,
  Star,
  Users,
  DollarSign,
  HelpCircle,
  ArrowRight,
  Layout,
} from 'lucide-react'

const SECTION_CONFIG: Record<
  SectionType['type'],
  {
    icon: React.ElementType
    color: string
    bg: string
    border: string
    label: string
  }
> = {
  hero: {
    icon: Sparkles,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/40',
    label: 'ヒーロー',
  },
  problem: {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/40',
    label: '課題提起',
  },
  solution: {
    icon: Lightbulb,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    label: 'ソリューション',
  },
  features: {
    icon: Star,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/40',
    label: '機能・特徴',
  },
  social_proof: {
    icon: Users,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/40',
    label: '社会的証明',
  },
  pricing: {
    icon: DollarSign,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/40',
    label: '料金プラン',
  },
  faq: {
    icon: HelpCircle,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/40',
    label: 'FAQ',
  },
  cta: {
    icon: ArrowRight,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/40',
    label: 'CTA',
  },
  other: {
    icon: Layout,
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/40',
    label: 'その他',
  },
}

interface SectionMapProps {
  sections: SectionType[]
}

export function SectionMap({ sections }: SectionMapProps) {
  return (
    <div className="space-y-2">
      {sections.map((section, index) => {
        const config = SECTION_CONFIG[section.type] ?? SECTION_CONFIG.other
        const Icon = config.icon

        return (
          <div
            key={index}
            className={cn(
              'flex items-start gap-3 p-3 rounded-xl border transition-all',
              config.bg,
              config.border
            )}
          >
            {/* Position indicator */}
            <div className="flex flex-col items-center gap-1 mt-0.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  config.bg
                )}
              >
                <Icon className={cn('w-4 h-4', config.color)} />
              </div>
              {index < sections.length - 1 && (
                <div className="w-px h-3 bg-surface-border"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-xs font-semibold uppercase tracking-wide', config.color)}>
                  {config.label}
                </span>
                <span className="text-slate-400 text-xs">{section.label}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{section.description}</p>
              {section.elements && section.elements.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {section.elements.slice(0, 4).map((el, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-surface-card border border-surface-border text-xs text-slate-400"
                    >
                      {el}
                    </span>
                  ))}
                  {section.elements.length > 4 && (
                    <span className="px-2 py-0.5 rounded-full bg-surface-card border border-surface-border text-xs text-slate-500">
                      +{section.elements.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Section number */}
            <span className="text-xs text-slate-600 font-mono mt-1">#{index + 1}</span>
          </div>
        )
      })}
    </div>
  )
}
