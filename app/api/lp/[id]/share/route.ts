import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Public endpoint - no auth required for share cards
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const lp = await prisma.landingPage.findUnique({
    where: { id: params.id },
    include: {
      snapshots: {
        where: { status: 'done' },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })

  if (!lp) {
    return NextResponse.json({ error: 'LP not found' }, { status: 404 })
  }

  const snapshot = lp.snapshots[0]
  if (!snapshot || !snapshot.analysisResult) {
    return NextResponse.json({ error: 'Analysis not available' }, { status: 404 })
  }

  const analysisResult = JSON.parse(snapshot.analysisResult)

  return NextResponse.json({
    id: lp.id,
    url: lp.url,
    name: lp.name,
    analysisResult,
    screenshotPath: snapshot.screenshotPath,
    analyzedAt: snapshot.createdAt,
  })
}
