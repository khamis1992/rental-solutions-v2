export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'check'
export type PaymentScheduleStatus = 'pending' | 'paid' | 'overdue' | 'partial'

export interface Payment {
  id: string
  lease_id: string
  amount: number
  payment_date: string
  payment_method: PaymentMethod
  status: PaymentStatus
  reference_number: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PaymentSchedule {
  id: string
  lease_id: string
  due_date: string
  amount: number
  status: PaymentScheduleStatus
  paid_amount: number | null
  payment_id: string | null
  created_at: string
  updated_at: string
}

export interface PaymentFilterParams {
  search?: string
  status?: PaymentStatus
  payment_method?: PaymentMethod
  lease_id?: string
  payment_date_from?: string
  payment_date_to?: string
  amount_min?: number
  amount_max?: number
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
  sort_by?: 'payment_date' | 'amount' | 'created_at'
}

export interface CreatePaymentRequest {
  lease_id: string
  amount: number
  payment_date: string
  payment_method: PaymentMethod
  status?: PaymentStatus
  reference_number?: string
  notes?: string
}

export interface UpdatePaymentRequest extends Partial<CreatePaymentRequest> {
  id: string
}
