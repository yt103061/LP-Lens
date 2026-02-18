import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'LP Lens - LPの「勝ちパターン」をデータで蓄積する',
    template: '%s | LP Lens',
  },
  description:
    '制作したLPの構造分析・成果追跡・改修差分検出を継続的に行い、「自分だけの勝ちパターン」を蓄積するデザインインテリジェンスAI。',
  keywords: ['LP分析', 'ランディングページ', 'CVR改善', 'デザイン分析', 'AI分析'],
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://lp-lens.vercel.app',
    title: 'LP Lens - LPの「勝ちパターン」をデータで蓄積する',
    description:
      '単発の分析ではなく、使うほど賢くなる。自分のデータに基づいた改善提案。',
    siteName: 'LP Lens',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
