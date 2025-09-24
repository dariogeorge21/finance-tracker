"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'
import { Income } from '@/types'

const incomeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone_number: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  called_status: z.boolean(),
})

type IncomeFormData = z.infer<typeof incomeSchema>

interface IncomeFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  projectId: string
  editData?: Income | null
}

export function IncomeForm({ isOpen, onClose, onSuccess, projectId, editData }: IncomeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: editData ? {
      name: editData.name,
      phone_number: editData.phone_number || '',
      amount: editData.amount,
      description: editData.description || '',
      date: editData.date,
      called_status: editData.called_status,
    } : {
      date: new Date().toISOString().split('T')[0],
      called_status: false,
    }
  })

  const calledStatus = watch('called_status')

  const onSubmit = async (data: IncomeFormData) => {
    setIsLoading(true)
    
    try {
      const url = editData ? `/api/projects/${projectId}/income/${editData.id}` : `/api/projects/${projectId}/income`
      const method = editData ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        toast.success(`Income ${editData ? 'updated' : 'added'} successfully!`)
        reset()
        onClose()
        onSuccess()
      } else {
        const result = await response.json()
        toast.error(result.error || `Failed to ${editData ? 'update' : 'add'} income`)
      }
    } catch (error) {
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? 'Edit Income' : 'Add New Income'}</DialogTitle>
          <DialogDescription>
            {editData ? 'Update the income details below.' : 'Enter the income details below.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              placeholder="+91 9876543210"
              {...register('phone_number')}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="5000.00"
                {...register('amount', { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Payment for services..."
              rows={3}
              {...register('description')}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="called_status"
              checked={calledStatus}
              onCheckedChange={(checked) => setValue('called_status', !!checked)}
            />
            <Label htmlFor="called_status" className="text-sm font-normal">
              Mark as called/contacted
            </Label>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {editData ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editData ? 'Update Income' : 'Add Income'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}