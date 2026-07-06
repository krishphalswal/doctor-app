import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientName, patientPhone, patientEmail, date, timeSlot, doctorId } = body

    if (!patientName || !patientPhone || !patientEmail || !date || !timeSlot || !doctorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: appointment, error } = await supabase
      .from('Appointment')
      .insert({
        patientName,
        patientPhone,
        patientEmail,
        date: new Date(date).toISOString(),
        timeSlot,
        doctorId,
        status: 'Pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating appointment in Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
