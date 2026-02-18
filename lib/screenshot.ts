import path from 'path'
import fs from 'fs'

export async function captureScreenshot(url: string, id: string): Promise<string | null> {
  let browser = null
  try {
    // Dynamic import to avoid bundling issues
    const { chromium } = await import('playwright')

    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })

    const page = await browser.newPage()
    await page.setViewportSize({ width: 1280, height: 900 })

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    })

    // Wait for page to settle
    await page.waitForTimeout(2000)

    // Ensure screenshots directory exists
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots')
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }

    const filename = `${id}-${Date.now()}.png`
    const filepath = path.join(screenshotsDir, filename)

    await page.screenshot({
      path: filepath,
      fullPage: true,
      animations: 'disabled',
    })

    return `/screenshots/${filename}`
  } catch (error) {
    console.error('Screenshot capture failed:', error)
    return null
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

export async function fetchPageMetadata(url: string): Promise<{
  title: string
  description: string
  ogImage: string | null
}> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'LP-Lens-Bot/1.0' },
      signal: AbortSignal.timeout(10000),
    })
    const html = await res.text()

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)

    return {
      title: titleMatch?.[1]?.trim() ?? '',
      description: descMatch?.[1]?.trim() ?? '',
      ogImage: ogImageMatch?.[1]?.trim() ?? null,
    }
  } catch {
    return { title: '', description: '', ogImage: null }
  }
}
