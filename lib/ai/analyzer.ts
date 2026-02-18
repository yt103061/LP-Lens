import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface SectionType {
  type: 'hero' | 'problem' | 'solution' | 'features' | 'social_proof' | 'pricing' | 'faq' | 'cta' | 'other'
  label: string
  description: string
  position: 'top' | 'upper' | 'middle' | 'lower' | 'bottom'
  elements: string[]
}

export interface AnalysisResult {
  sections: SectionType[]
  informationDesign: {
    firstViewSummary: string
    ctaCount: number
    ctaPositions: string[]
    textVisualRatio: string
    structureScore: number
    strengths: string[]
    improvements: string[]
  }
  designTone: {
    colorPalette: string[]
    colorMood: string
    fontStyle: 'serif' | 'sans-serif' | 'display' | 'mixed'
    whitespaceLevel: 'tight' | 'medium' | 'spacious'
    overallImpression: string
    designScore: number
  }
  summary: string
}

const ANALYSIS_PROMPT = `あなたはランディングページ（LP）の構造分析の専門家です。
提供されたLPのスクリーンショットを詳細に分析し、以下の情報を日本語でJSON形式で返してください。

分析項目:
1. sections: セクション構成の詳細（Hero, 課題提起, ソリューション, 特徴/機能, 社会的証明, 料金, FAQ, CTA等）
2. informationDesign: ファーストビューの内容、CTA数と配置、テキストとビジュアルのバランス
3. designTone: 配色、フォントスタイル、余白レベル、全体印象とスコア（0-100）

必ず以下の形式のJSONのみで返答してください。説明文やマークダウンのコードブロック（\`\`\`json等）は含めないでください：

{
  "sections": [
    {
      "type": "hero",
      "label": "ヒーローセクション",
      "description": "メインビジュアルとキャッチコピー（100文字以内）",
      "position": "top",
      "elements": ["メインヘッドライン", "サブコピー", "CTAボタン", "背景画像"]
    }
  ],
  "informationDesign": {
    "firstViewSummary": "ファーストビューで伝わる内容（150文字以内）",
    "ctaCount": 3,
    "ctaPositions": ["ヒーロー", "中段", "最下部"],
    "textVisualRatio": "60:40",
    "structureScore": 75,
    "strengths": ["強み1", "強み2", "強み3"],
    "improvements": ["改善点1", "改善点2", "改善点3"]
  },
  "designTone": {
    "colorPalette": ["#1a1a2e", "#e94560", "#ffffff"],
    "colorMood": "プロフェッショナルで信頼感がある",
    "fontStyle": "sans-serif",
    "whitespaceLevel": "medium",
    "overallImpression": "清潔感があり信頼性の高いデザイン",
    "designScore": 78
  },
  "summary": "LP全体の分析サマリー（200文字以内）"
}

sections の type は以下から選択してください:
- hero: ヒーローセクション（最初の大きなビジュアル）
- problem: 課題・悩み提起
- solution: ソリューション・解決策
- features: 機能・特徴
- social_proof: 実績・口コミ・社会的証明
- pricing: 料金プラン
- faq: よくある質問
- cta: コンバージョンへの呼びかけ
- other: その他のセクション

sections の position は以下から選択:
- top: 最上部（最初の20%）
- upper: 上部（20-40%）
- middle: 中間（40-60%）
- lower: 下部（60-80%）
- bottom: 最下部（80-100%）`

const TEXT_ANALYSIS_PROMPT = `あなたはランディングページ（LP）の構造分析の専門家です。
提供されたURLとページ情報からLPの構造を推定し、分析を行ってください。

注意: スクリーンショットが取得できなかったため、メタデータから推定分析を行います。
分析の確信度は低くなりますが、可能な範囲で詳細な分析を行ってください。

必ず以下の形式のJSONのみで返答してください。マークダウンのコードブロックは含めないでください：

{
  "sections": [
    {
      "type": "hero",
      "label": "ヒーローセクション",
      "description": "推定される内容（100文字以内）",
      "position": "top",
      "elements": ["推定要素"]
    }
  ],
  "informationDesign": {
    "firstViewSummary": "推定されるファーストビューの内容（150文字以内）",
    "ctaCount": 2,
    "ctaPositions": ["ヒーロー", "最下部"],
    "textVisualRatio": "不明",
    "structureScore": 50,
    "strengths": ["分析できる範囲での強み"],
    "improvements": ["スクリーンショット取得後の詳細分析を推奨"]
  },
  "designTone": {
    "colorPalette": [],
    "colorMood": "スクリーンショット未取得のため不明",
    "fontStyle": "sans-serif",
    "whitespaceLevel": "medium",
    "overallImpression": "スクリーンショット取得後に詳細分析が可能",
    "designScore": 0
  },
  "summary": "スクリーンショットの取得に失敗したため、メタデータからの推定分析です。URLを再分析することで詳細な結果が得られます。"
}`

function extractJSON(text: string): AnalysisResult {
  // Remove markdown code blocks if Gemini wraps the response
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Geminiのレスポンスにで JSON が見つかりません')
  }

  return JSON.parse(jsonMatch[0]) as AnalysisResult
}

export async function analyzeLPWithScreenshot(
  screenshotPath: string
): Promise<AnalysisResult> {
  const absolutePath = screenshotPath.startsWith('/public')
    ? screenshotPath
    : `${process.cwd()}/public${screenshotPath}`

  const imageData = fs.readFileSync(absolutePath)
  const base64Image = imageData.toString('base64')

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: 'image/png',
      },
    },
    ANALYSIS_PROMPT,
  ])

  return extractJSON(result.response.text())
}

export async function analyzeLPFromMetadata(
  url: string,
  title: string,
  description: string
): Promise<AnalysisResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent(
    `${TEXT_ANALYSIS_PROMPT}\n\nURL: ${url}\nタイトル: ${title}\n説明: ${description}\n\nこのLPを分析してください。`
  )

  return extractJSON(result.response.text())
}
