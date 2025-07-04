import { supabase } from '@/lib/supabase'
import { MaintenanceRecord, CreateMaintenanceRequest, UpdateMaintenanceRequest, MaintenanceFilterParams } from '@/types/maintenance'

export class MaintenanceService {
  static async getMaintenanceRecords(params: MaintenanceFilterParams = {}) {
    let query = supabase
      .from('maintenance_records')
      .select(`
        *,
        vehicles:vehicle_id(make, model, license_plate, status)
      `)

    if (params.search) {
      query = query.or(`description.ilike.%${params.search}%,service_provider.ilike.%${params.search}%`)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.maintenance_type) {
      query = query.eq('maintenance_type', params.maintenance_type)
    }

    if (params.vehicle_id) {
      query = query.eq('vehicle_id', params.vehicle_id)
    }

    if (params.service_date_from) {
      query = query.gte('service_date', params.service_date_from)
    }

    if (params.service_date_to) {
      query = query.lte('service_date', params.service_date_to)
    }

    if (params.service_provider) {
      query = query.eq('service_provider', params.service_provider)
    }

    if (params.cost_min) {
      query = query.gte('cost', params.cost_min)
    }

    if (params.cost_max) {
      query = query.lte('cost', params.cost_max)
    }

    const sortColumn = params.sort_by || 'created_at'
    const sortOrder = params.sort === 'asc' ? true : false
    query = query.order(sortColumn, { ascending: sortOrder })

    if (params.limit) {
      query = query.limit(params.limit)
    }

    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch maintenance records: ${error.message}`)
    }

    return {
      data: data as MaintenanceRecord[],
      count: count || 0
    }
  }

  static async getMaintenanceRecordById(id: string) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select(`
        *,
        vehicles:vehicle_id(make, model, license_plate, year, mileage)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch maintenance record: ${error.message}`)
    }

    return data as MaintenanceRecord
  }

  static async createMaintenanceRecord(maintenanceData: CreateMaintenanceRequest) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .insert([{
        ...maintenanceData,
        status: maintenanceData.status || 'scheduled',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create maintenance record: ${error.message}`)
    }

    return data as MaintenanceRecord
  }

  static async updateMaintenanceRecord(maintenanceData: UpdateMaintenanceRequest) {
    const { id, ...updateData } = maintenanceData
    
    const { data, error } = await supabase
      .from('maintenance_records')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update maintenance record: ${error.message}`)
    }

    return data as MaintenanceRecord
  }

  static async deleteMaintenanceRecord(id: string) {
    const { error } = await supabase
      .from('maintenance_records')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete maintenance record: ${error.message}`)
    }

    return true
  }

  static async getMaintenanceByVehicle(vehicleId: string) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('service_date', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch maintenance records for vehicle: ${error.message}`)
    }

    return data as MaintenanceRecord[]
  }

  static async getUpcomingMaintenance() {
    const today = new Date().toISOString().split('T')[0]
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthStr = nextMonth.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('maintenance_records')
      .select(`
        *,
        vehicles:vehicle_id(make, model, license_plate)
      `)
      .eq('status', 'scheduled')
      .gte('service_date', today)
      .lte('service_date', nextMonthStr)
      .order('service_date', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch upcoming maintenance: ${error.message}`)
    }

    return data as MaintenanceRecord[]
  }

  static async getOverdueMaintenance() {
    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('maintenance_records')
      .select(`
        *,
        vehicles:vehicle_id(make, model, license_plate)
      `)
      .eq('status', 'scheduled')
      .lt('service_date', today)
      .order('service_date', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch overdue maintenance: ${error.message}`)
    }

    return data as MaintenanceRecord[]
  }

  static async updateMaintenanceStatus(id: string, status: MaintenanceRecord['status']) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update maintenance status: ${error.message}`)
    }

    return data as MaintenanceRecord
  }

  static async getMaintenanceCostsByVehicle(vehicleId: string) {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('cost, service_date, maintenance_type')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'completed')
      .order('service_date', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch maintenance costs for vehicle: ${error.message}`)
    }

    return data as Pick<MaintenanceRecord, 'cost' | 'service_date' | 'maintenance_type'>[]
  }

  static async getMaintenanceStatistics() {
    const { data, error } = await supabase
      .from('maintenance_records')
      .select('status, maintenance_type, cost')

    if (error) {
      throw new Error(`Failed to fetch maintenance statistics: ${error.message}`)
    }

    const stats = {
      total: data.length,
      scheduled: data.filter(r => r.status === 'scheduled').length,
      in_progress: data.filter(r => r.status === 'in_progress').length,
      completed: data.filter(r => r.status === 'completed').length,
      cancelled: data.filter(r => r.status === 'cancelled').length,
      total_cost: data.filter(r => r.status === 'completed').reduce((sum, r) => sum + (r.cost || 0), 0),
      by_type: {
        routine: data.filter(r => r.maintenance_type === 'routine').length,
        repair: data.filter(r => r.maintenance_type === 'repair').length,
        inspection: data.filter(r => r.maintenance_type === 'inspection').length,
        emergency: data.filter(r => r.maintenance_type === 'emergency').length,
      }
    }

    return stats
  }
}
