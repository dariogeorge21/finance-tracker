"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { IncomeForm } from '@/components/income-form'
import { ExpenseForm } from '@/components/expense-form'
import { FinancialCharts } from '@/components/financial-charts'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/currency'
import { exportIncomeToCSV, exportExpensesToCSV } from '@/lib/export'
import { ProjectStats, Income, Expense } from '@/types'
import {
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  Users,
  Plus,
  Download,
  Edit,
  Trash2,
  Phone,
  PhoneOff,
  LogOut
} from 'lucide-react'

interface ProjectAuth {
  project_id: string
  project_name: string
  authenticated_at: number
}

export default function ProjectDashboard({ params }: { params: { projectName: string } }) {
  const router = useRouter()
  const [projectAuth, setProjectAuth] = useState<ProjectAuth | null>(null)
  const [stats, setStats] = useState<ProjectStats | null>(null)
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingIncome, setEditingIncome] = useState<Income | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  useEffect(() => {
    // Check authentication
    const authData = sessionStorage.getItem('project_auth')
    if (!authData) {
      router.push('/')
      return
    }

    const auth: ProjectAuth = JSON.parse(authData)
    const decodedProjectName = decodeURIComponent(params.projectName)
    
    if (auth.project_name !== decodedProjectName) {
      router.push('/')
      return
    }

    // Check if session is still valid (24 hours)
    if (Date.now() - auth.authenticated_at > 24 * 60 * 60 * 1000) {
      sessionStorage.removeItem('project_auth')
      router.push('/')
      return
    }

    setProjectAuth(auth)
    fetchData(auth.project_id)
  }, [params.projectName, router])

  const fetchData = async (projectId: string) => {
    setIsLoading(true)
    try {
      const [statsRes, incomeRes, expensesRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/stats`),
        fetch(`/api/projects/${projectId}/income?limit=10`),
        fetch(`/api/projects/${projectId}/expenses?limit=10`)
      ])

      const [statsData, incomeData, expensesData] = await Promise.all([
        statsRes.json(),
        incomeRes.json(),
        expensesRes.json()
      ])

      if (statsRes.ok) setStats(statsData.stats)
      if (incomeRes.ok) setIncome(incomeData.income)
      if (expensesRes.ok) setExpenses(expensesData.expenses)
    } catch (error) {
      toast.error('Failed to load project data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('project_auth')
    router.push('/')
  }

  const handleDeleteIncome = async (id: string) => {
    if (!projectAuth) return

    try {
      const response = await fetch(`/api/projects/${projectAuth.project_id}/income/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Income deleted successfully')
        fetchData(projectAuth.project_id)
      } else {
        toast.error('Failed to delete income')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (!projectAuth) return

    try {
      const response = await fetch(`/api/projects/${projectAuth.project_id}/expenses/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Expense deleted successfully')
        fetchData(projectAuth.project_id)
      } else {
        toast.error('Failed to delete expense')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  const handleExportIncome = async () => {
    if (!projectAuth) return

    try {
      const response = await fetch(`/api/projects/${projectAuth.project_id}/export/income`)
      const data = await response.json()
      
      if (response.ok) {
        exportIncomeToCSV(data.income, projectAuth.project_name)
        toast.success('Income data exported successfully')
      } else {
        toast.error('Failed to export income data')
      }
    } catch (error) {
      toast.error('Export failed')
    }
  }

  const handleExportExpenses = async () => {
    if (!projectAuth) return

    try {
      const response = await fetch(`/api/projects/${projectAuth.project_id}/export/expenses`)
      const data = await response.json()
      
      if (response.ok) {
        exportExpensesToCSV(data.expenses, projectAuth.project_name)
        toast.success('Expenses data exported successfully')
      } else {
        toast.error('Failed to export expenses data')
      }
    } catch (error) {
      toast.error('Export failed')
    }
  }

  if (!projectAuth || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster richColors position="top-right" />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{projectAuth.project_name}</h1>
              <p className="text-sm text-gray-500">Finance Dashboard</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Exit Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm font-medium">Total Income</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalIncome)}</p>
                  </div>
                  <ArrowUpCircle className="w-8 h-8 text-emerald-100" />
                </div>
                <p className="text-emerald-100 text-xs mt-2">{stats.incomeCount} entries</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</p>
                  </div>
                  <ArrowDownCircle className="w-8 h-8 text-red-100" />
                </div>
                <p className="text-red-100 text-xs mt-2">{stats.expenseCount} entries</p>
              </CardContent>
            </Card>

            <Card className={`${stats.netBalance >= 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-opacity-90 text-sm font-medium">Net Balance</p>
                    <p className="text-2xl font-bold">{formatCurrency(stats.netBalance)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-white text-opacity-75" />
                </div>
                <p className="text-white text-opacity-75 text-xs mt-2">
                  {stats.netBalance >= 0 ? 'Positive' : 'Negative'} balance
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Entries</p>
                    <p className="text-2xl font-bold">{stats.incomeCount + stats.expenseCount}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-100" />
                </div>
                <p className="text-purple-100 text-xs mt-2">All transactions</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button onClick={() => setShowIncomeForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Income
          </Button>
          <Button onClick={() => setShowExpenseForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
          <Button variant="outline" onClick={handleExportIncome}>
            <Download className="w-4 h-4 mr-2" />
            Export Income
          </Button>
          <Button variant="outline" onClick={handleExportExpenses}>
            <Download className="w-4 h-4 mr-2" />
            Export Expenses
          </Button>
        </div>

        {/* Charts */}
        {stats && (
          <div className="mb-8">
            <FinancialCharts stats={stats} />
          </div>
        )}

        {/* Data Tables */}
        <Tabs defaultValue="income" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="income">Recent Income</TabsTrigger>
            <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Recent Income Entries</CardTitle>
                <CardDescription>Latest income transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {income.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Called</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {income.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>
                            {item.phone_number ? (
                              <span className="text-sm">{item.phone_number}</span>
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-semibold text-emerald-600">
                            {formatCurrency(item.amount)}
                          </TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={item.called_status ? "default" : "secondary"}>
                              {item.called_status ? (
                                <><Phone className="w-3 h-3 mr-1" />Called</>
                              ) : (
                                <><PhoneOff className="w-3 h-3 mr-1" />Not Called</>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingIncome(item)
                                  setShowIncomeForm(true)
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteIncome(item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No income entries yet. Add your first income entry!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expense Entries</CardTitle>
                <CardDescription>Latest expense transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.category}</Badge>
                          </TableCell>
                          <TableCell className="font-semibold text-red-600">
                            {formatCurrency(item.amount)}
                          </TableCell>
                          <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingExpense(item)
                                  setShowExpenseForm(true)
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteExpense(item.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No expense entries yet. Add your first expense entry!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Forms */}
      <IncomeForm
        isOpen={showIncomeForm}
        onClose={() => {
          setShowIncomeForm(false)
          setEditingIncome(null)
        }}
        onSuccess={() => fetchData(projectAuth.project_id)}
        projectId={projectAuth.project_id}
        editData={editingIncome}
      />

      <ExpenseForm
        isOpen={showExpenseForm}
        onClose={() => {
          setShowExpenseForm(false)
          setEditingExpense(null)
        }}
        onSuccess={() => fetchData(projectAuth.project_id)}
        projectId={projectAuth.project_id}
        editData={editingExpense}
      />
    </div>
  )
}