export type MaintenanceType = 'routine' | 'repair' | 'inspection' | 'emergency'
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'

export interface MaintenanceRecord {
  id: string
  vehicle_id: string
  maintenance_type: MaintenanceType
  description: string
  cost: number
  service_date: string
  next_service_date: string | null
  service_provider: string | null
  status: MaintenanceStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface MaintenanceFilterParams {
  search?: string
  status?: MaintenanceStatus
  maintenance_type?: MaintenanceType
  vehicle_id?: string
  service_date_from?: string
  service_date_to?: string
  service_provider?: string
  cost_min?: number
  cost_max?: number
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
  sort_by?: 'service_date' | 'cost' | 'created_at'
}

export interface CreateMaintenanceRequest {
  vehicle_id: string
  maintenance_type: MaintenanceType
  description: string
  cost: number
  service_date: string
  next_service_date?: string
  service_provider?: string
  status?: MaintenanceStatus
  notes?: string
}

export interface UpdateMaintenanceRequest extends Partial<CreateMaintenanceRequest> {
  id: string
}
