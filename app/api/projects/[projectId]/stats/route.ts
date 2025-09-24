import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const projectId = params.projectId

    // Get income stats
    const { data: incomeData, error: incomeError } = await supabase
      .from('income')
      .select('amount')
      .eq('project_id', projectId)

    if (incomeError) {
      return NextResponse.json({ error: incomeError.message }, { status: 500 })
    }

    // Get expense stats
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .select('amount')
      .eq('project_id', projectId)

    if (expenseError) {
      return NextResponse.json({ error: expenseError.message }, { status: 500 })
    }

    const totalIncome = incomeData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
    const totalExpenses = expenseData?.reduce((sum, item) => sum + Number(item.amount), 0) || 0
    const netBalance = totalIncome - totalExpenses

    const stats = {
      totalIncome,
      totalExpenses,
      netBalance,
      incomeCount: incomeData?.length || 0,
      expenseCount: expenseData?.length || 0,
    }

    return NextResponse.json({ stats })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}