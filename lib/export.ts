import Papa from 'papaparse'
import { Income, Expense } from '@/types'
import { formatCurrency } from './currency'

export const exportIncomeToCSV = (incomeData: Income[], projectName: string) => {
  const csvData = incomeData.map(item => ({
    'Name': item.name,
    'Phone Number': item.phone_number || '',
    'Amount': item.amount,
    'Description': item.description || '',
    'Date': item.date,
    'Called Status': item.called_status ? 'Yes' : 'No',
    'Created At': new Date(item.created_at).toLocaleDateString()
  }))
  
  const csv = Papa.unparse(csvData)
  downloadCSV(csv, `${projectName}_income_${new Date().toISOString().split('T')[0]}.csv`)
}

export const exportExpensesToCSV = (expenseData: Expense[], projectName: string) => {
  const csvData = expenseData.map(item => ({
    'Description': item.description,
    'Amount': item.amount,
    'Category': item.category,
    'Date': item.date,
    'Created At': new Date(item.created_at).toLocaleDateString()
  }))
  
  const csv = Papa.unparse(csvData)
  downloadCSV(csv, `${projectName}_expenses_${new Date().toISOString().split('T')[0]}.csv`)
}

const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}