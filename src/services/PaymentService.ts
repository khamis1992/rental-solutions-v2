import { supabase } from '@/lib/supabase'
import { Payment, PaymentSchedule, CreatePaymentRequest, UpdatePaymentRequest, PaymentFilterParams } from '@/types/payment'

export class PaymentService {
  static async getPayments(params: PaymentFilterParams = {}) {
    let query = supabase
      .from('unified_payments')
      .select(`
        *,
        leases:lease_id(
          id,
          profiles:customer_id(full_name),
          vehicles:vehicle_id(make, model, license_plate)
        )
      `)

    if (params.search) {
      query = query.or(`reference_number.ilike.%${params.search}%,notes.ilike.%${params.search}%`)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.payment_method) {
      query = query.eq('payment_method', params.payment_method)
    }

    if (params.lease_id) {
      query = query.eq('lease_id', params.lease_id)
    }

    if (params.payment_date_from) {
      query = query.gte('payment_date', params.payment_date_from)
    }

    if (params.payment_date_to) {
      query = query.lte('payment_date', params.payment_date_to)
    }

    if (params.amount_min) {
      query = query.gte('amount', params.amount_min)
    }

    if (params.amount_max) {
      query = query.lte('amount', params.amount_max)
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
      throw new Error(`Failed to fetch payments: ${error.message}`)
    }

    return {
      data: data as Payment[],
      count: count || 0
    }
  }

  static async getPaymentById(id: string) {
    const { data, error } = await supabase
      .from('unified_payments')
      .select(`
        *,
        leases:lease_id(
          id,
          profiles:customer_id(full_name, email, phone),
          vehicles:vehicle_id(make, model, license_plate)
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch payment: ${error.message}`)
    }

    return data as Payment
  }

  static async createPayment(paymentData: CreatePaymentRequest) {
    const { data, error } = await supabase
      .from('unified_payments')
      .insert([{
        ...paymentData,
        status: paymentData.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create payment: ${error.message}`)
    }

    return data as Payment
  }

  static async updatePayment(paymentData: UpdatePaymentRequest) {
    const { id, ...updateData } = paymentData
    
    const { data, error } = await supabase
      .from('unified_payments')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update payment: ${error.message}`)
    }

    return data as Payment
  }

  static async deletePayment(id: string) {
    const { error } = await supabase
      .from('unified_payments')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete payment: ${error.message}`)
    }

    return true
  }

  static async getPaymentSchedules(leaseId?: string) {
    let query = supabase
      .from('payment_schedules')
      .select(`
        *,
        leases:lease_id(
          profiles:customer_id(full_name),
          vehicles:vehicle_id(make, model, license_plate)
        )
      `)

    if (leaseId) {
      query = query.eq('lease_id', leaseId)
    }

    query = query.order('due_date', { ascending: true })

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch payment schedules: ${error.message}`)
    }

    return data as PaymentSchedule[]
  }

  static async getOverduePayments() {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('payment_schedules')
      .select(`
        *,
        leases:lease_id(
          profiles:customer_id(full_name, email, phone),
          vehicles:vehicle_id(make, model, license_plate)
        )
      `)
      .eq('status', 'overdue')
      .lt('due_date', today)
      .order('due_date', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch overdue payments: ${error.message}`)
    }

    return data as PaymentSchedule[]
  }

  static async processPayment(paymentId: string, amount: number) {
    const { data, error } = await supabase
      .from('unified_payments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to process payment: ${error.message}`)
    }

    return data as Payment
  }

  static async getPaymentsByLeaseId(leaseId: string) {
    const { data, error } = await supabase
      .from('unified_payments')
      .select('*')
      .eq('lease_id', leaseId)
      .order('payment_date', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch payments for lease: ${error.message}`)
    }

    return data as Payment[]
  }

  static async getMonthlyRevenue(): Promise<number> {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    
    const { data, error } = await supabase
      .from('unified_payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('payment_date', startOfMonth)

    if (error) {
      throw new Error(`Failed to fetch monthly revenue: ${error.message}`)
    }

    return data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0
  }

  static async getCount(params?: PaymentFilterParams): Promise<number> {
    let query = supabase.from('unified_payments').select('*', { count: 'exact', head: true })

    if (params?.search) {
      query = query.or(`reference_number.ilike.%${params.search}%,notes.ilike.%${params.search}%`)
    }

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    const { count, error } = await query

    if (error) {
      throw new Error(`Failed to count payments: ${error.message}`)
    }

    return count || 0
  }
}
