import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string; incomeId: string } }
) {
  try {
    const { incomeId } = params
    const data = await request.json()

    const { data: income, error } = await supabase
      .from('income')
      .update(data)
      .eq('id', incomeId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ income })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string; incomeId: string } }
) {
  try {
    const { incomeId } = params

    const { error } = await supabase
      .from('income')
      .delete()
      .eq('id', incomeId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}