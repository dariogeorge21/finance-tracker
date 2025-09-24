"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'
import { Project } from '@/types'

const accessSchema = z.object({
  project_name: z.string().min(1, 'Project name is required'),
  password: z.string().min(1, 'Password is required'),
})

type AccessFormData = z.infer<typeof accessSchema>

interface ProjectAccessFormProps {
  projects: Project[]
}

export function ProjectAccessForm({ projects }: ProjectAccessFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AccessFormData>({
    resolver: zodResolver(accessSchema),
  })

  const onSubmit = async (data: AccessFormData) => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/projects/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        // Store project session
        sessionStorage.setItem('project_auth', JSON.stringify({
          project_id: result.project.id,
          project_name: result.project.project_name,
          authenticated_at: Date.now()
        }))
        
        router.push(`/project/${encodeURIComponent(data.project_name)}`)
        toast.success('Access granted! Redirecting to dashboard...')
      } else {
        toast.error(result.error || 'Authentication failed')
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Access Project</CardTitle>
        <CardDescription className="text-center">
          Enter your project name and password to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">Project Name</Label>
            <Select onValueChange={(value) => setValue('project_name', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.project_name}>
                    {project.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project_name && (
              <p className="text-sm text-destructive">{errors.project_name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter project password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Authenticating...
              </>
            ) : (
              'Access Project'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}