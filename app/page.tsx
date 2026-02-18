import Link from 'next/link'
import { Nav } from '@/components/nav'
import {
  Zap,
  BarChart3,
  GitCompare,
  TrendingUp,
  Check,
  ArrowRight,
  Search,
  Layers,
  Sparkles,
  Lock,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0f23]">
      <Nav />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-violet-900/20 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-indigo-900/15 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-sm text-violet-300">既存LP分析AIと決定的に異なるアプローチ</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            あなたのLPの
            <br />
            <span className="text-gradient">「勝ちパターン」</span>を
            <br />
            データで蓄積する
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            単発の分析ではなく、改修のたびに差分を検出しCVR変化と紐づける。
            <br className="hidden sm:block" />
            使うほど賢くなる、自分だけのデザインインテリジェンスAI。
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-violet-900/40"
            >
              無料でLP分析する
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-slate-500">LP 1本まで永久無料 · クレジットカード不要</p>
          </div>
        </div>

        {/* Hero visual */}
        <div className="max-w-3xl mx-auto mt-16 relative">
          <div className="rounded-2xl border border-violet-500/20 bg-[#1a1a2e] p-6 shadow-2xl shadow-black/50">
            {/* Mock analysis UI */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 h-7 rounded-lg bg-[#0f0f23] border border-surface-border px-3 flex items-center">
                <span className="text-xs text-slate-500">https://your-lp.com</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {/* Section map mock */}
              <div className="col-span-2 space-y-2">
                {[
                  { color: '#3b82f6', label: 'Hero', w: '100%' },
                  { color: '#ef4444', label: '課題提起', w: '85%' },
                  { color: '#10b981', label: 'ソリューション', w: '90%' },
                  { color: '#8b5cf6', label: '機能一覧', w: '80%' },
                  { color: '#f59e0b', label: '社会的証明', w: '95%' },
                  { color: '#6366f1', label: '料金プラン', w: '100%' },
                  { color: '#10b981', label: 'CTA', w: '70%' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="h-5 rounded-md flex items-center px-2"
                      style={{ backgroundColor: s.color + '20', width: s.w, borderLeft: `3px solid ${s.color}` }}
                    >
                      <span className="text-xs text-slate-400 truncate">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scores mock */}
              <div className="col-span-3 space-y-3">
                <div className="bg-[#0f0f23] rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">デザインスコア</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#2d2d4e] rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
                    </div>
                    <span className="text-sm font-bold text-white">82</span>
                  </div>
                </div>
                <div className="bg-[#0f0f23] rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">構造スコア</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-[#2d2d4e] rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                    </div>
                    <span className="text-sm font-bold text-white">74</span>
                  </div>
                </div>
                <div className="bg-[#0f0f23] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-slate-500">CVR追跡</p>
                    <Lock className="w-3 h-3 text-slate-600" />
                  </div>
                  <div className="h-2 bg-[#2d2d4e] rounded-full opacity-30" />
                </div>
                <div className="bg-[#0f0f23] rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-slate-500">改修差分検出</p>
                    <Lock className="w-3 h-3 text-slate-600" />
                  </div>
                  <div className="h-2 bg-[#2d2d4e] rounded-full opacity-30" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 sm:right-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-2 backdrop-blur-sm">
            <p className="text-xs text-emerald-400 font-medium">Hero画像を変更 → CVR +0.8%</p>
          </div>
        </div>
      </section>

      {/* Problem / Existing tools fail */}
      <section className="py-20 px-4 border-t border-surface-border">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            既存のLP分析AIが全滅している理由
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Crazy Egg調査 (2025年11月): 11ツールをテストした結果、最高スコア15点中5点。
            最優秀ツールの提案をA/Bテストに使ったらCVRが16.4%悪化。
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { problem: '単発分析', desc: '1回きりの分析で、改修後の変化を追えない' },
              { problem: '文脈なし', desc: 'URLだけ見て、成果データや変更履歴が考慮されない' },
              { problem: '汎用提案', desc: '自分のデータではなく、一般的なベストプラクティス頼り' },
            ].map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-center"
              >
                <p className="text-red-400 font-semibold text-sm mb-2">{item.problem}</p>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
              <span className="text-violet-300 text-sm font-medium">
                LP Lensはその逆を設計思想としている
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-surface-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">継続追跡が生む、圧倒的な差</h2>
            <p className="text-slate-400">使うほど賢くなる。自分のデータに基づいた改善提案。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'AI構造分析',
                desc: 'URLを入力するだけで、セクション構成・情報設計・デザイントーンを自動分析。SNSでシェアできるビジュアルも生成。',
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
                border: 'border-blue-500/20',
                tag: 'Free',
              },
              {
                icon: BarChart3,
                title: 'CVR成果追跡',
                desc: 'GA4連携または手動入力で成果データを紐づけ。改修のたびに構造差分を自動検出し、CVR変化との因果仮説を蓄積。',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                tag: '¥500/月〜',
              },
              {
                icon: TrendingUp,
                title: '勝ちパターン抽出',
                desc: '複数LP横断分析で「あなたの勝ちパターン」を抽出。新規LP制作前に、自分の実績データに基づく最適構造を提案。',
                color: 'text-violet-400',
                bg: 'bg-violet-500/10',
                border: 'border-violet-500/20',
                tag: '¥2,000/月',
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl border ${f.bg} ${f.border} relative overflow-hidden`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <div className="absolute top-4 right-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${f.bg} ${f.border} ${f.color}`}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-surface-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">使い方はシンプル</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
            {[
              {
                icon: Layers,
                step: '01',
                title: 'URLを入力',
                desc: 'LPのURLを貼るだけ。AIがスクリーンショットを自動取得し、構造を解析。',
              },
              null,
              {
                icon: Search,
                step: '02',
                title: '構造分析出力',
                desc: 'セクション構成マップ・情報設計・デザイントーンを即座に可視化。',
              },
              null,
              {
                icon: GitCompare,
                step: '03',
                title: '継続的に追跡',
                desc: '改修のたびに差分を検出。CVR変化と紐づけて因果仮説を自動生成。',
              },
            ].map((item, i) => {
              if (item === null) {
                return (
                  <div key={i} className="flex justify-center">
                    <ArrowRight className="w-5 h-5 text-slate-600 rotate-0 sm:rotate-0" />
                  </div>
                )
              }
              return (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-surface-card border border-surface-border flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <p className="text-xs text-violet-400 font-mono mb-1">STEP {item.step}</p>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 border-t border-surface-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">シンプルな料金体系</h2>
            <p className="text-slate-400">必要な機能だけ、必要な分だけ。</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '¥0',
                period: 'ずっと無料',
                highlight: false,
                features: [
                  'LP 1本まで',
                  'AI構造分析（セクション構成・情報設計・デザイントーン）',
                  'SNSシェア用ビジュアル出力',
                  '有料機能のプレビュー',
                ],
                locked: ['CVR追跡グラフ', '改修差分検出', '変更履歴タイムライン'],
                cta: '無料で始める',
                href: '/register',
              },
              {
                name: 'スターター',
                price: '¥500',
                period: '/月',
                highlight: true,
                features: [
                  'LP 3本まで',
                  'Freeの全機能',
                  'GA4連携 / 手動CVR入力',
                  '改修差分の自動検出',
                  'CVR変化 × 変更の因果仮説生成',
                  '変更履歴タイムライン',
                ],
                locked: [],
                cta: 'スタートする',
                href: '/register?plan=starter',
              },
              {
                name: 'プロ',
                price: '¥2,000',
                period: '/月',
                highlight: false,
                features: [
                  'LP 無制限',
                  'スターターの全機能',
                  '複数LP横断分析',
                  '勝ちパターン抽出AI',
                  '新規LP制作前の改善提案',
                  'クライアント向けPDFレポート',
                  'Figma連携（デザインファイル分析）',
                ],
                locked: [],
                cta: 'プロを始める',
                href: '/register?plan=pro',
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl border p-6 relative ${
                  plan.highlight
                    ? 'border-violet-500/50 bg-violet-500/5'
                    : 'border-surface-border bg-surface-card'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-medium shadow-lg">
                      おすすめ
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-slate-400 text-sm mb-1">{plan.name}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
                  </div>
                </div>

                <Link
                  href={plan.href}
                  className={`block text-center py-2.5 rounded-xl font-medium text-sm mb-5 transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500'
                      : 'bg-surface-hover border border-surface-border text-slate-300 hover:border-violet-500/30 hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.locked.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                      <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 border-t border-surface-border">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-violet-900/40">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">今すぐ無料で分析する</h2>
          <p className="text-slate-400 mb-8 text-lg">
            URLを入力するだけ。30秒でLPの構造分析が完成します。
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-lg hover:from-violet-500 hover:to-indigo-500 transition-all shadow-2xl shadow-violet-900/40"
          >
            無料アカウントを作成
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-slate-400 text-sm">LP Lens</span>
          </div>
          <p className="text-slate-600 text-sm">© 2025 LP Lens. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
