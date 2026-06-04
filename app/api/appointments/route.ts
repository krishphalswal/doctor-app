import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientName, patientPhone, patientEmail, date, timeSlot, doctorId } = body

    if (!patientName || !patientPhone || !patientEmail || !date || !timeSlot || !doctorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientName,
        patientPhone,
        patientEmail,
        date: new Date(date),
        timeSlot,
        doctorId,
        status: 'Pending'
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
