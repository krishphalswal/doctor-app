import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')
  const email = searchParams.get('email')

  if (!phone || !email) {
    return NextResponse.json({ error: 'Missing phone number or email' }, { status: 400 })
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientPhone: phone,
        patientEmail: email
      },
      include: {
        doctor: {
          select: {
            name: true,
            specialty: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ error: 'No appointments found for this phone and email' }, { status: 404 })
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error looking up appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
