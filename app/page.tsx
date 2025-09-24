import { supabase } from '@/lib/supabase'
import { ProjectAccessForm } from '@/components/project-access-form'
import { CreateProjectForm } from '@/components/create-project-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Shield, Users, BarChart3 } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getProjects() {
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, project_name, created_at, password_hash, updated_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return projects || []
}

export default async function HomePage() {
  const projects = await getProjects()

  return (
    <div className="flex-1 h-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 h-full" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 h-full" >
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Finance Tracker
              <span className="block text-emerald-600">Workspace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create secure, password-protected project workspaces to manage your income and expenses. 
              Track your finances with real-time analytics and visualizations.
            </p>
          </div>

          {/* Main Action Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <ProjectAccessForm projects={projects} />
            </div>

            {/* Create New Project */}
            <div className="space-y-6">
              <div className="text-center">  
              </div>
              <Card className="p-6 text-center">
                <CardHeader>
                  <CardTitle className="text-lg">New Project Workspace</CardTitle>
                  <CardDescription>
                    Create a secure, password-protected workspace for tracking your finances
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <CreateProjectForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}