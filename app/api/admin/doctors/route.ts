import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(doctors)
  } catch (error) {
    console.error('Error fetching doctors:', error)
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
    const { name, specialty, experience, about, education, imageUrl, availableTimings } = body

    if (!name || !specialty || experience === undefined || !imageUrl || !availableTimings) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty,
        experience: Number(experience),
        about,
        education,
        imageUrl,
        availableTimings
      }
    })

    return NextResponse.json(doctor, { status: 201 })
  } catch (error) {
    console.error('Error creating doctor:', error)
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

    // First delete any appointments for this doctor to avoid constraint errors
    await prisma.appointment.deleteMany({
      where: { doctorId: id }
    })

    await prisma.doctor.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting doctor:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
