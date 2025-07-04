import { supabase } from '@/lib/supabase'
import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, VehicleFilterParams } from '@/types/vehicle'

export class VehicleService {
  static async getVehicles(params: VehicleFilterParams = {}) {
    let query = supabase
      .from('vehicles')
      .select('*')

    if (params.search) {
      query = query.or(`make.ilike.%${params.search}%,model.ilike.%${params.search}%,license_plate.ilike.%${params.search}%`)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.make) {
      query = query.eq('make', params.make)
    }

    if (params.model) {
      query = query.eq('model', params.model)
    }

    if (params.year_from) {
      query = query.gte('year', params.year_from)
    }

    if (params.year_to) {
      query = query.lte('year', params.year_to)
    }

    if (params.daily_rate_min) {
      query = query.gte('daily_rate', params.daily_rate_min)
    }

    if (params.daily_rate_max) {
      query = query.lte('daily_rate', params.daily_rate_max)
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
      throw new Error(`Failed to fetch vehicles: ${error.message}`)
    }

    return {
      data: data as Vehicle[],
      count: count || 0
    }
  }

  static async getVehicleById(id: string) {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch vehicle: ${error.message}`)
    }

    return data as Vehicle
  }

  static async createVehicle(vehicleData: CreateVehicleRequest) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert([{
        ...vehicleData,
        status: vehicleData.status || 'available',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create vehicle: ${error.message}`)
    }

    return data as Vehicle
  }

  static async updateVehicle(vehicleData: UpdateVehicleRequest) {
    const { id, ...updateData } = vehicleData
    
    const { data, error } = await supabase
      .from('vehicles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update vehicle: ${error.message}`)
    }

    return data as Vehicle
  }

  static async deleteVehicle(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete vehicle: ${error.message}`)
    }

    return true
  }

  static async getAvailableVehicles() {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('status', 'available')
      .order('make', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch available vehicles: ${error.message}`)
    }

    return data as Vehicle[]
  }

  static async updateVehicleStatus(id: string, status: Vehicle['status']) {
    const { data, error } = await supabase
      .from('vehicles')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update vehicle status: ${error.message}`)
    }

    return data as Vehicle
  }

  static async getCount(params?: VehicleFilterParams): Promise<number> {
    let query = supabase.from('vehicles').select('*', { count: 'exact', head: true })

    if (params?.search) {
      query = query.or(`make.ilike.%${params.search}%,model.ilike.%${params.search}%,license_plate.ilike.%${params.search}%`)
    }

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    const { count, error } = await query

    if (error) {
      throw new Error(`Failed to count vehicles: ${error.message}`)
    }

    return count || 0
  }
}
