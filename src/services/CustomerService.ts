import { supabase } from '@/lib/supabase'
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerFilterParams } from '@/types/customer'

export class CustomerService {
  static async getCustomers(params: CustomerFilterParams = {}) {
    let query = supabase
      .from('profiles')
      .select('*')

    if (params.search) {
      query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%`)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    const sortColumn = 'created_at'
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
      throw new Error(`Failed to fetch customers: ${error.message}`)
    }

    return {
      data: data as Customer[],
      count: count || 0
    }
  }

  static async getCustomerById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch customer: ${error.message}`)
    }

    return data as Customer
  }

  static async createCustomer(customerData: CreateCustomerRequest) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        ...customerData,
        status: customerData.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create customer: ${error.message}`)
    }

    return data as Customer
  }

  static async updateCustomer(customerData: UpdateCustomerRequest) {
    const { id, ...updateData } = customerData
    
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update customer: ${error.message}`)
    }

    return data as Customer
  }

  static async deleteCustomer(id: string) {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete customer: ${error.message}`)
    }

    return true
  }

  static async searchCustomers(searchTerm: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,driver_license.ilike.%${searchTerm}%`)
      .limit(10)

    if (error) {
      throw new Error(`Failed to search customers: ${error.message}`)
    }

    return data as Customer[]
  }
}
