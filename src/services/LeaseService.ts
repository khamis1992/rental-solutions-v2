import { supabase } from '@/lib/supabase'
import { Lease, CreateLeaseRequest, UpdateLeaseRequest, LeaseFilterParams } from '@/types/lease'

export class LeaseService {
  static async getLeases(params: LeaseFilterParams = {}) {
    let query = supabase
      .from('leases')
      .select(`
        *,
        profiles:customer_id(full_name, email, phone),
        vehicles:vehicle_id(make, model, license_plate)
      `)

    if (params.search) {
      query = query.or(`profiles.full_name.ilike.%${params.search}%,vehicles.license_plate.ilike.%${params.search}%`)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.customer_id) {
      query = query.eq('customer_id', params.customer_id)
    }

    if (params.vehicle_id) {
      query = query.eq('vehicle_id', params.vehicle_id)
    }

    if (params.start_date_from) {
      query = query.gte('start_date', params.start_date_from)
    }

    if (params.start_date_to) {
      query = query.lte('start_date', params.start_date_to)
    }

    if (params.end_date_from) {
      query = query.gte('end_date', params.end_date_from)
    }

    if (params.end_date_to) {
      query = query.lte('end_date', params.end_date_to)
    }

    if (params.payment_frequency) {
      query = query.eq('payment_frequency', params.payment_frequency)
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
      throw new Error(`Failed to fetch leases: ${error.message}`)
    }

    return {
      data: data as Lease[],
      count: count || 0
    }
  }

  static async getLeaseById(id: string) {
    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        profiles:customer_id(full_name, email, phone, address),
        vehicles:vehicle_id(make, model, license_plate, daily_rate)
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch lease: ${error.message}`)
    }

    return data as Lease
  }

  static async createLease(leaseData: CreateLeaseRequest) {
    const { data, error } = await supabase
      .from('leases')
      .insert([{
        ...leaseData,
        status: leaseData.status || 'active',
        payment_frequency: leaseData.payment_frequency || 'monthly',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create lease: ${error.message}`)
    }

    return data as Lease
  }

  static async updateLease(leaseData: UpdateLeaseRequest) {
    const { id, ...updateData } = leaseData
    
    const { data, error } = await supabase
      .from('leases')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update lease: ${error.message}`)
    }

    return data as Lease
  }

  static async deleteLease(id: string) {
    const { error } = await supabase
      .from('leases')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete lease: ${error.message}`)
    }

    return true
  }

  static async getActiveLeases() {
    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        profiles:customer_id(full_name, email, phone),
        vehicles:vehicle_id(make, model, license_plate)
      `)
      .eq('status', 'active')
      .order('start_date', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch active leases: ${error.message}`)
    }

    return data as Lease[]
  }

  static async getOverdueLeases() {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('leases')
      .select(`
        *,
        profiles:customer_id(full_name, email, phone),
        vehicles:vehicle_id(make, model, license_plate)
      `)
      .eq('status', 'overdue')
      .lt('end_date', today)
      .order('end_date', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch overdue leases: ${error.message}`)
    }

    return data as Lease[]
  }

  static async updateLeaseStatus(id: string, status: Lease['status']) {
    const { data, error } = await supabase
      .from('leases')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update lease status: ${error.message}`)
    }

    return data as Lease
  }

  static async getCount(params?: LeaseFilterParams): Promise<number> {
    let query = supabase.from('leases').select('*', { count: 'exact', head: true })

    if (params?.search) {
      query = query.or(`profiles.full_name.ilike.%${params.search}%,vehicles.license_plate.ilike.%${params.search}%`)
    }

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    const { count, error } = await query

    if (error) {
      throw new Error(`Failed to count leases: ${error.message}`)
    }

    return count || 0
  }
}
