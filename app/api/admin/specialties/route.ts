import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: specialties, error } = await supabase
      .from('Specialty')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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

    const { data: existing } = await supabase
      .from('Specialty')
      .select('*')
      .eq('name', formattedName)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Specialty already exists' }, { status: 400 })
    }

    const { data: specialty, error } = await supabase
      .from('Specialty')
      .insert({ name: formattedName })
      .select()
      .single()

    if (error) {
      console.error('Error creating specialty in Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

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

    const { error } = await supabase
      .from('Specialty')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting specialty in Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting specialty:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
