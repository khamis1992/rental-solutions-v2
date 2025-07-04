export type LeaseStatus = 'active' | 'completed' | 'cancelled' | 'overdue'
export type PaymentFrequency = 'daily' | 'weekly' | 'monthly'

export interface Lease {
  id: string
  customer_id: string
  vehicle_id: string
  start_date: string
  end_date: string
  total_amount: number
  security_deposit: number | null
  status: LeaseStatus
  payment_frequency: PaymentFrequency
  notes: string | null
  contract_terms: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface LeaseFilterParams {
  search?: string
  status?: LeaseStatus
  customer_id?: string
  vehicle_id?: string
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
  payment_frequency?: PaymentFrequency
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
  sort_by?: 'start_date' | 'end_date' | 'total_amount' | 'created_at'
}

export interface CreateLeaseRequest {
  customer_id: string
  vehicle_id: string
  start_date: string
  end_date: string
  total_amount: number
  security_deposit?: number
  status?: LeaseStatus
  payment_frequency?: PaymentFrequency
  notes?: string
  contract_terms?: Record<string, any>
}

export interface UpdateLeaseRequest extends Partial<CreateLeaseRequest> {
  id: string
}
