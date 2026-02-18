import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { PLAN_LIMITS } from '@/lib/utils'

const createLPSchema = z.object({
  url: z.string().url('有効なURLを入力してください'),
  name: z.string().optional(),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lps = await prisma.landingPage.findMany({
    where: { userId: session.user.id },
    include: {
      snapshots: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ lps })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = createLPSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    // Check plan limits
    const plan = session.user.plan as keyof typeof PLAN_LIMITS
    const limit = PLAN_LIMITS[plan]?.lpCount ?? 1

    const existingCount = await prisma.landingPage.count({
      where: { userId: session.user.id },
    })

    if (existingCount >= limit) {
      return NextResponse.json(
        {
          error: `${PLAN_LIMITS[plan]?.label}では最大${limit}本までLPを登録できます。プランをアップグレードしてください。`,
          limitReached: true,
        },
        { status: 403 }
      )
    }

    const { url, name } = parsed.data

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`

    const lp = await prisma.landingPage.create({
      data: {
        userId: session.user.id,
        url: normalizedUrl,
        name: name ?? null,
        snapshots: {
          create: {
            status: 'pending',
            version: 1,
          },
        },
      },
      include: {
        snapshots: true,
      },
    })

    return NextResponse.json({ lp }, { status: 201 })
  } catch (error) {
    console.error('Create LP error:', error)
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
