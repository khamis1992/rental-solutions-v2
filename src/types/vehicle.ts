export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'out_of_service'

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  license_plate: string
  vin: string | null
  color: string | null
  mileage: number | null
  status: VehicleStatus
  daily_rate: number
  weekly_rate: number | null
  monthly_rate: number | null
  insurance_policy: string | null
  registration_expiry: string | null
  inspection_expiry: string | null
  notes: string | null
  images: string[] | null
  created_at: string
  updated_at: string
}

export interface VehicleFilterParams {
  search?: string
  status?: VehicleStatus
  make?: string
  model?: string
  year_from?: number
  year_to?: number
  daily_rate_min?: number
  daily_rate_max?: number
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
  sort_by?: 'make' | 'model' | 'year' | 'daily_rate' | 'created_at'
}

export interface CreateVehicleRequest {
  make: string
  model: string
  year: number
  license_plate: string
  vin?: string
  color?: string
  mileage?: number
  status?: VehicleStatus
  daily_rate: number
  weekly_rate?: number
  monthly_rate?: number
  insurance_policy?: string
  registration_expiry?: string
  inspection_expiry?: string
  notes?: string
  images?: string[]
}

export interface UpdateVehicleRequest extends Partial<CreateVehicleRequest> {
  id: string
}
