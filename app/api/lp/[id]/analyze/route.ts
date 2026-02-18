import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { captureScreenshot, fetchPageMetadata } from '@/lib/screenshot'
import { analyzeLPWithScreenshot, analyzeLPFromMetadata } from '@/lib/ai/analyzer'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify LP ownership
  const lp = await prisma.landingPage.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      snapshots: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!lp) {
    return NextResponse.json({ error: 'LP not found' }, { status: 404 })
  }

  const latestSnapshot = lp.snapshots[0]
  const snapshotId = latestSnapshot?.id

  // Update status to analyzing
  if (snapshotId) {
    await prisma.lPSnapshot.update({
      where: { id: snapshotId },
      data: { status: 'analyzing' },
    })
  }

  try {
    // Step 1: Capture screenshot
    const screenshotPath = await captureScreenshot(lp.url, params.id)

    let analysisResult

    if (screenshotPath) {
      // Step 2a: Analyze with screenshot
      analysisResult = await analyzeLPWithScreenshot(screenshotPath)
    } else {
      // Step 2b: Fallback - analyze from metadata
      const metadata = await fetchPageMetadata(lp.url)
      analysisResult = await analyzeLPFromMetadata(lp.url, metadata.title, metadata.description)
    }

    // Step 3: Get next version number
    const versionCount = await prisma.lPSnapshot.count({
      where: { landingPageId: params.id },
    })

    // Step 4: Save results
    if (snapshotId) {
      await prisma.lPSnapshot.update({
        where: { id: snapshotId },
        data: {
          screenshotPath,
          analysisResult: JSON.stringify(analysisResult),
          status: 'done',
          version: versionCount,
        },
      })
    } else {
      await prisma.lPSnapshot.create({
        data: {
          landingPageId: params.id,
          screenshotPath,
          analysisResult: JSON.stringify(analysisResult),
          status: 'done',
          version: versionCount + 1,
        },
      })
    }

    return NextResponse.json({ success: true, analysisResult })
  } catch (error) {
    console.error('Analysis error:', error)

    // Update snapshot status to error
    if (snapshotId) {
      await prisma.lPSnapshot.update({
        where: { id: snapshotId },
        data: {
          status: 'error',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }

    return NextResponse.json(
      { error: '分析中にエラーが発生しました。しばらくしてから再試行してください。' },
      { status: 500 }
    )
  }
}
