export interface Project {
  id: string
  project_name: string
  password_hash: string
  created_at: string
  updated_at: string
}

export interface Income {
  id: string
  project_id: string
  name: string
  phone_number?: string
  amount: number
  description?: string
  date: string
  called_status: boolean
  created_at: string
}

export interface Expense {
  id: string
  project_id: string
  description: string
  amount: number
  date: string
  category: string
  created_at: string
}

export interface ProjectStats {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  incomeCount: number
  expenseCount: number
}

export interface CreateProjectData {
  project_name: string
  password: string
}

export interface AccessProjectData {
  project_name: string
  password: string
}

export interface CreateIncomeData {
  name: string
  phone_number?: string
  amount: number
  description?: string
  date: string
  called_status?: boolean
}

export interface CreateExpenseData {
  description: string
  amount: number
  date: string
  category?: string
}