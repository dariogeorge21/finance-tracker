import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword)
}

export const getProjectByName = async (projectName: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_name', projectName)
    .single()
  
  if (error) return null
  return data
}

export const authenticateProject = async (projectName: string, password: string) => {
  const project = await getProjectByName(projectName)
  if (!project) return null
  
  const isValid = await verifyPassword(password, project.password_hash)
  return isValid ? project : null
}