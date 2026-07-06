import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: doctors, error } = await supabase
      .from('Doctor')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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

    const { data: doctor, error } = await supabase
      .from('Doctor')
      .insert({
        name,
        specialty,
        experience: Number(experience),
        about,
        education,
        imageUrl,
        availableTimings
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating doctor in Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath('/')
    revalidatePath('/doctors')

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
    const { error: apptError } = await supabase
      .from('Appointment')
      .delete()
      .eq('doctorId', id)

    if (apptError) {
      console.error('Error deleting doctor appointments in Supabase:', apptError)
      return NextResponse.json({ error: apptError.message }, { status: 500 })
    }

    const { error: doctorError } = await supabase
      .from('Doctor')
      .delete()
      .eq('id', id)

    if (doctorError) {
      console.error('Error deleting doctor in Supabase:', doctorError)
      return NextResponse.json({ error: doctorError.message }, { status: 500 })
    }

    revalidatePath('/')
    revalidatePath('/doctors')
    revalidatePath(`/doctors/${id}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting doctor:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
