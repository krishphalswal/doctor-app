import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(specialties)
  } catch (error) {
    console.error('Error fetching specialties:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Normalize name (trim and capitalize first letter of words)
    const formattedName = name
      .trim()
      .split(/\s+/)
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')

    const existing = await prisma.specialty.findUnique({
      where: { name: formattedName }
    })

    if (existing) {
      return NextResponse.json({ error: 'Specialty already exists' }, { status: 400 })
    }

    const specialty = await prisma.specialty.create({
      data: { name: formattedName }
    })

    return NextResponse.json(specialty, { status: 201 })
  } catch (error) {
    console.error('Error creating specialty:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.specialty.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting specialty:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
