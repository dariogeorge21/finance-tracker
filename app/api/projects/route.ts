import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('id, project_name, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ projects })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { project_name, password } = await request.json()

    if (!project_name || !password) {
      return NextResponse.json({ error: 'Project name and password are required' }, { status: 400 })
    }

    // Check if project name already exists
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('project_name', project_name)
      .single()

    if (existingProject) {
      return NextResponse.json({ error: 'Project name already exists' }, { status: 409 })
    }

    // Hash the password
    const password_hash = await hashPassword(password)

    // Create the project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({ project_name, password_hash })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}