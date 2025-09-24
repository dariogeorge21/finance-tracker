'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/currency'
import { ProjectStats } from '@/types'
import * as React from 'react'

// Type assertion for ResponsiveContainer to fix compatibility issues
const TypedResponsiveContainer = ResponsiveContainer as React.FC<{
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
}>

interface FinancialChartsProps {
  stats: ProjectStats
}

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B']

export function FinancialCharts({ stats }: FinancialChartsProps) {
  const pieData = [
    { name: 'Income', value: stats.totalIncome, color: '#10B981' },
    { name: 'Expenses', value: stats.totalExpenses, color: '#EF4444' },
  ]

  const barData = [
    {
      name: 'Financial Overview',
      Income: stats.totalIncome,
      Expenses: stats.totalExpenses,
      Balance: stats.netBalance,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <TypedResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatCurrency(value as number)}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </TypedResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <TypedResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="Income" fill="#10B981" name="Income" />
                <Bar dataKey="Expenses" fill="#EF4444" name="Expenses" />
                <Bar dataKey="Balance" fill={stats.netBalance >= 0 ? '#3B82F6' : '#F59E0B'} name="Net Balance" />
              </BarChart>
            </TypedResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}