import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PLAN_LIMITS, type Plan } from '@/lib/utils'
import { Check, CreditCard } from 'lucide-react'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) return null

  const currentPlan = session.user.plan as Plan
  const plans: Array<{
    key: Plan
    name: string
    price: string
    period: string
    features: string[]
  }> = [
    {
      key: 'free',
      name: '無料プラン',
      price: '¥0',
      period: 'ずっと無料',
      features: [
        'LP 1本まで',
        'AI構造分析',
        'デザイントーン判定',
        'SNSシェア用ビジュアル',
      ],
    },
    {
      key: 'starter',
      name: 'スターター',
      price: '¥500',
      period: '/月',
      features: [
        'LP 3本まで',
        'Freeの全機能',
        'GA4連携 / 手動CVR入力',
        '改修差分の自動検出',
        '因果仮説の自動生成',
        '変更履歴タイムライン',
      ],
    },
    {
      key: 'pro',
      name: 'プロ',
      price: '¥2,000',
      period: '/月',
      features: [
        'LP 無制限',
        'スターターの全機能',
        '複数LP横断分析',
        '勝ちパターン抽出AI',
        '新規LP最適構造提案',
        'PDFレポート自動生成',
        'Figma連携',
      ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">設定</h1>
        <p className="text-slate-400">アカウント情報とプランの管理</p>
      </div>

      {/* Account info */}
      <div className="bg-surface-card rounded-2xl border border-surface-border p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">アカウント情報</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-surface-border">
            <span className="text-slate-400 text-sm">メールアドレス</span>
            <span className="text-white text-sm">{session.user.email}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-surface-border">
            <span className="text-slate-400 text-sm">お名前</span>
            <span className="text-white text-sm">{session.user.name ?? '未設定'}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400 text-sm">現在のプラン</span>
            <span className="text-violet-400 text-sm font-medium">
              {PLAN_LIMITS[currentPlan]?.label}
            </span>
          </div>
        </div>
      </div>

      {/* Plan selection */}
      <div className="bg-surface-card rounded-2xl border border-surface-border p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-violet-400" />
          プラン
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`rounded-xl border p-4 relative ${
                currentPlan === plan.key
                  ? 'border-violet-500/50 bg-violet-500/5'
                  : 'border-surface-border bg-[#0f0f23]'
              }`}
            >
              {currentPlan === plan.key && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-600 text-white text-xs font-medium">
                    現在のプラン
                  </span>
                </div>
              )}

              <div className="mb-3">
                <p className="text-slate-400 text-xs mb-0.5">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-500 text-xs mb-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {currentPlan !== plan.key && (
                <button
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                    plan.key === 'free'
                      ? 'bg-surface-card border border-surface-border text-slate-500 cursor-not-allowed'
                      : 'bg-violet-600 text-white hover:bg-violet-500'
                  }`}
                  disabled={plan.key === 'free'}
                >
                  {plan.key === 'free' ? 'ダウングレード' : `${plan.name}にアップグレード`}
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-slate-600 mt-4 text-center">
          ※ 決済機能は近日公開予定です。しばらくお待ちください。
        </p>
      </div>
    </div>
  )
}
