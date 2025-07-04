export type CustomerStatus = 'active' | 'inactive' | 'blocked' | 'pending'

export interface Customer {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  driver_license: string | null
  nationality: string | null
  notes: string | null
  status: CustomerStatus
  id_card_image: string | null
  created_at: string
  updated_at: string
}

export interface CustomerFilterParams {
  search?: string
  status?: CustomerStatus
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
}

export interface CreateCustomerRequest {
  full_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  driver_license?: string
  nationality?: string
  notes?: string
  status?: CustomerStatus
  id_card_image?: string
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string
}
