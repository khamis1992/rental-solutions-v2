import { supabase } from '@/lib/supabase'
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, CustomerFilterParams, CustomerAnalytics } from '@/types/customer'

export class CustomerService {
  static async getCustomers(params?: CustomerFilterParams): Promise<{ data: Customer[], count: number }> {
    const customers = await this.getAll(params)
    const count = await this.getCount(params)
    return { data: customers, count }
  }

  static async getAll(params?: CustomerFilterParams): Promise<Customer[]> {
    let query = supabase.from('profiles').select('*')

    if (params?.search) {
      query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone_number.ilike.%${params.search}%,driver_license.ilike.%${params.search}%`)
    }

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    if (params?.document_verification_status) {
      query = query.eq('document_verification_status', params.document_verification_status)
    }

    if (params?.document_analysis_status) {
      query = query.eq('document_analysis_status', params.document_analysis_status)
    }

    if (params?.duplicate_review_status) {
      query = query.eq('duplicate_review_status', params.duplicate_review_status)
    }

    if (params?.needs_review !== undefined) {
      query = query.eq('needs_review', params.needs_review)
    }

    if (params?.is_ai_generated !== undefined) {
      query = query.eq('is_ai_generated', params.is_ai_generated)
    }

    if (params?.role) {
      query = query.eq('role', params.role)
    }

    if (params?.nationality) {
      query = query.eq('nationality', params.nationality)
    }

    if (params?.limit) {
      query = query.limit(params.limit)
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1)
    }

    const orderBy = params?.sort === 'desc' ? { ascending: false } : { ascending: true }
    const sortColumn = params?.sort_by || 'created_at'
    query = query.order(sortColumn, orderBy)

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch customers: ${error.message}`)
    }

    return data || []
  }

  static async getById(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Failed to fetch customer: ${error.message}`)
    }

    return data
  }

  static async create(customer: CreateCustomerRequest): Promise<Customer> {
    const customerData = {
      ...customer,
      document_verification_status: customer.document_verification_status || 'pending',
      document_analysis_status: customer.document_analysis_status || 'pending',
      status: customer.status || 'active',
      role: customer.role || 'customer',
      profile_completion_score: this.calculateCompletionScore(customer),
      welcome_email_sent: false,
      is_ai_generated: false,
      needs_review: false,
      duplicate_review_status: 'pending',
      location_tracking_enabled: customer.location_tracking_enabled || false,
      preferred_communication_channel: customer.preferred_communication_channel || 'email'
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert([customerData])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create customer: ${error.message}`)
    }

    return data
  }

  static async update(customer: UpdateCustomerRequest): Promise<Customer> {
    const { id, ...updateData } = customer
    
    const updatePayload: any = {
      ...updateData,
      updated_at: new Date().toISOString()
    }
    
    if (Object.keys(updateData).length > 0) {
      updatePayload.profile_completion_score = this.calculateCompletionScore(updateData)
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update customer: ${error.message}`)
    }

    return data
  }

  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete customer: ${error.message}`)
    }
  }

  static async getCount(params?: CustomerFilterParams): Promise<number> {
    let query = supabase.from('profiles').select('*', { count: 'exact', head: true })

    if (params?.search) {
      query = query.or(`full_name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone_number.ilike.%${params.search}%,driver_license.ilike.%${params.search}%`)
    }

    if (params?.status) {
      query = query.eq('status', params.status)
    }

    if (params?.document_verification_status) {
      query = query.eq('document_verification_status', params.document_verification_status)
    }

    if (params?.needs_review !== undefined) {
      query = query.eq('needs_review', params.needs_review)
    }

    const { count, error } = await query

    if (error) {
      throw new Error(`Failed to count customers: ${error.message}`)
    }

    return count || 0
  }

  static async getAnalytics(): Promise<CustomerAnalytics> {
    const { data: customers, error } = await supabase
      .from('profiles')
      .select('status, document_verification_status, preferred_communication_channel, is_ai_generated, needs_review, profile_completion_score')

    if (error) {
      throw new Error(`Failed to fetch customer analytics: ${error.message}`)
    }

    const analytics: CustomerAnalytics = {
      total_customers: customers?.length || 0,
      active_customers: customers?.filter(c => c.status === 'active').length || 0,
      pending_verification: customers?.filter(c => c.document_verification_status === 'pending').length || 0,
      ai_generated_customers: customers?.filter(c => c.is_ai_generated).length || 0,
      needs_review_count: customers?.filter(c => c.needs_review).length || 0,
      completion_score_average: customers?.reduce((sum, c) => sum + (c.profile_completion_score || 0), 0) / (customers?.length || 1) || 0,
      verification_status_breakdown: {
        pending: customers?.filter(c => c.document_verification_status === 'pending').length || 0,
        verified: customers?.filter(c => c.document_verification_status === 'verified').length || 0,
        rejected: customers?.filter(c => c.document_verification_status === 'rejected').length || 0,
        expired: customers?.filter(c => c.document_verification_status === 'expired').length || 0,
      },
      communication_channel_breakdown: {
        email: customers?.filter(c => c.preferred_communication_channel === 'email').length || 0,
        sms: customers?.filter(c => c.preferred_communication_channel === 'sms').length || 0,
        whatsapp: customers?.filter(c => c.preferred_communication_channel === 'whatsapp').length || 0,
        phone: customers?.filter(c => c.preferred_communication_channel === 'phone').length || 0,
      }
    }

    return analytics
  }

  static async updateDocumentVerificationStatus(id: string, status: string, notes?: string): Promise<Customer> {
    const updateData: any = {
      document_verification_status: status,
      updated_at: new Date().toISOString()
    }

    if (notes) {
      updateData.status_notes = notes
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update document verification status: ${error.message}`)
    }

    return data
  }

  static async markForReview(id: string, reason: string): Promise<Customer> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        needs_review: true,
        status_notes: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to mark customer for review: ${error.message}`)
    }

    return data
  }

  static async getMonthlyRevenue(): Promise<number> {
    return 0
  }

  private static calculateCompletionScore(customer: Partial<CreateCustomerRequest | UpdateCustomerRequest>): number {
    const fields = [
      'full_name', 'phone_number', 'email', 'address', 'nationality', 
      'driver_license', 'id_document_url', 'license_document_url'
    ]
    
    const completedFields = fields.filter(field => {
      const value = customer[field as keyof typeof customer]
      return value !== null && value !== undefined && value !== ''
    }).length

    return Math.round((completedFields / fields.length) * 100)
  }
}
