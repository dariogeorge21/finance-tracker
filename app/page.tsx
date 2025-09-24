import { supabase } from '@/lib/supabase'
import { ProjectAccessForm } from '@/components/project-access-form'
import { CreateProjectForm } from '@/components/create-project-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Toaster richColors position="top-right" />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Finance Tracker
              <span className="block text-emerald-600">Workspace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create secure, password-protected project workspaces to manage your income and expenses. 
              Track your finances with real-time analytics and beautiful visualizations.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Shield,
                title: 'Secure Workspaces',
                description: 'Password-protected projects for complete privacy'
              },
              {
                icon: TrendingUp,
                title: 'Real-time Analytics',
                description: 'Live financial summaries and insights'
              },
              {
                icon: BarChart3,
                title: 'Visual Reports',
                description: 'Charts and graphs for better understanding'
              },
              {
                icon: Users,
                title: 'Multi-tenant',
                description: 'Multiple projects with independent data'
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="pt-6">
                  <feature.icon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Action Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Access Existing Project */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Project</h2>
                <p className="text-gray-600">Enter your project workspace</p>
              </div>
              <ProjectAccessForm projects={projects} />
            </div>

            {/* Create New Project */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Project</h2>
                <p className="text-gray-600">Start a new finance workspace</p>
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

          {/* Project List */}
          {projects.length > 0 && (
            <div className="mt-16 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Available Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{project.project_name}</h4>
                      <p className="text-sm text-gray-500">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}