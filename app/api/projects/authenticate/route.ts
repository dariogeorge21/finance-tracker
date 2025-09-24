import { NextRequest, NextResponse } from 'next/server'
import { authenticateProject } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { project_name, password } = await request.json()

    if (!project_name || !password) {
      return NextResponse.json({ error: 'Project name and password are required' }, { status: 400 })
    }

    const project = await authenticateProject(project_name, password)

    if (!project) {
      return NextResponse.json({ error: 'Invalid project name or password' }, { status: 401 })
    }

    // Return project without password hash
    const { password_hash, ...projectData } = project
    
    return NextResponse.json({ project: projectData })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}