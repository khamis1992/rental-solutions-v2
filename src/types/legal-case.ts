export type LegalCaseType = 'collection' | 'damage' | 'breach' | 'other'
export type LegalCaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface LegalCase {
  id: string
  customer_id: string
  lease_id: string | null
  case_type: LegalCaseType
  status: LegalCaseStatus
  description: string
  amount_claimed: number | null
  amount_settled: number | null
  court_date: string | null
  lawyer_assigned: string | null
  documents: Record<string, any> | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface LegalCaseFilterParams {
  search?: string
  status?: LegalCaseStatus
  case_type?: LegalCaseType
  customer_id?: string
  lease_id?: string
  court_date_from?: string
  court_date_to?: string
  lawyer_assigned?: string
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
  sort_by?: 'court_date' | 'amount_claimed' | 'created_at'
}

export interface CreateLegalCaseRequest {
  customer_id: string
  lease_id?: string
  case_type: LegalCaseType
  status?: LegalCaseStatus
  description: string
  amount_claimed?: number
  amount_settled?: number
  court_date?: string
  lawyer_assigned?: string
  documents?: Record<string, any>
  notes?: string
}

export interface UpdateLegalCaseRequest extends Partial<CreateLegalCaseRequest> {
  id: string
}
