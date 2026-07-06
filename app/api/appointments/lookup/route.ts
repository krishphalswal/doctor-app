import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const phone = searchParams.get('phone')
  const email = searchParams.get('email')

  if (!phone || !email) {
    return NextResponse.json({ error: 'Missing phone number or email' }, { status: 400 })
  }

  try {
    const { data: appointments, error } = await supabase
      .from('Appointment')
      .select('*, doctor:Doctor(name, specialty)')
      .eq('patientPhone', phone)
      .eq('patientEmail', email)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error looking up appointment in Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!appointments || appointments.length === 0) {
      return NextResponse.json({ error: 'No appointments found for this phone and email' }, { status: 404 })
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error looking up appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
