import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lp = await prisma.landingPage.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      snapshots: {
        orderBy: { createdAt: 'desc' },
      },
      cvrData: {
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!lp) {
    return NextResponse.json({ error: 'LP not found' }, { status: 404 })
  }

  return NextResponse.json({ lp })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const lp = await prisma.landingPage.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!lp) {
    return NextResponse.json({ error: 'LP not found' }, { status: 404 })
  }

  await prisma.landingPage.delete({ where: { id: params.id } })

  return NextResponse.json({ success: true })
}
