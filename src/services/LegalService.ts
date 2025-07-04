import { supabase } from '@/lib/supabase'
import { LegalCase, CreateLegalCaseRequest, UpdateLegalCaseRequest, LegalCaseFilterParams } from '@/types/legal-case'

export class LegalService {
  static async getLegalCases(params: LegalCaseFilterParams = {}) {
    let query = supabase
      .from('legal_cases')
      .select(`
        *,
        profiles:customer_id(full_name, email, phone),
        leases:lease_id(
          id,
          vehicles:vehicle_id(make, model, license_plate)
        )
      `)

    if (params.search) {
      query = query.or(`description.ilike.%${params.search}%,lawyer_assigned.ilike.%${params.search}%`)
    }

    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.case_type) {
      query = query.eq('case_type', params.case_type)
    }

    if (params.customer_id) {
      query = query.eq('customer_id', params.customer_id)
    }

    if (params.lease_id) {
      query = query.eq('lease_id', params.lease_id)
    }

    if (params.court_date_from) {
      query = query.gte('court_date', params.court_date_from)
    }

    if (params.court_date_to) {
      query = query.lte('court_date', params.court_date_to)
    }

    if (params.lawyer_assigned) {
      query = query.eq('lawyer_assigned', params.lawyer_assigned)
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
      throw new Error(`Failed to fetch legal cases: ${error.message}`)
    }

    return {
      data: data as LegalCase[],
      count: count || 0
    }
  }

  static async getLegalCaseById(id: string) {
    const { data, error } = await supabase
      .from('legal_cases')
      .select(`
        *,
        profiles:customer_id(full_name, email, phone, address),
        leases:lease_id(
          id,
          vehicles:vehicle_id(make, model, license_plate),
          start_date,
          end_date,
          total_amount
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch legal case: ${error.message}`)
    }

    return data as LegalCase
  }

  static async createLegalCase(legalCaseData: CreateLegalCaseRequest) {
    const { data, error } = await supabase
      .from('legal_cases')
      .insert([{
        ...legalCaseData,
        status: legalCaseData.status || 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create legal case: ${error.message}`)
    }

    return data as LegalCase
  }

  static async updateLegalCase(legalCaseData: UpdateLegalCaseRequest) {
    const { id, ...updateData } = legalCaseData
    
    const { data, error } = await supabase
      .from('legal_cases')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update legal case: ${error.message}`)
    }

    return data as LegalCase
  }

  static async deleteLegalCase(id: string) {
    const { error } = await supabase
      .from('legal_cases')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete legal case: ${error.message}`)
    }

    return true
  }

  static async getOpenCases() {
    const { data, error } = await supabase
      .from('legal_cases')
      .select(`
        *,
        profiles:customer_id(full_name, email, phone),
        leases:lease_id(
          vehicles:vehicle_id(make, model, license_plate)
        )
      `)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch open legal cases: ${error.message}`)
    }

    return data as LegalCase[]
  }

  static async getCasesByCustomer(customerId: string) {
    const { data, error } = await supabase
      .from('legal_cases')
      .select(`
        *,
        leases:lease_id(
          vehicles:vehicle_id(make, model, license_plate)
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch legal cases for customer: ${error.message}`)
    }

    return data as LegalCase[]
  }

  static async updateCaseStatus(id: string, status: LegalCase['status']) {
    const { data, error } = await supabase
      .from('legal_cases')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update legal case status: ${error.message}`)
    }

    return data as LegalCase
  }

  static async assignLawyer(id: string, lawyerName: string) {
    const { data, error } = await supabase
      .from('legal_cases')
      .update({
        lawyer_assigned: lawyerName,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to assign lawyer to legal case: ${error.message}`)
    }

    return data as LegalCase
  }

  static async settleCaseAmount(id: string, settledAmount: number) {
    const { data, error } = await supabase
      .from('legal_cases')
      .update({
        amount_settled: settledAmount,
        status: 'resolved',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to settle legal case amount: ${error.message}`)
    }

    return data as LegalCase
  }
}
