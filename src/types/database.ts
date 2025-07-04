export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
          status: 'active' | 'inactive' | 'blocked' | 'pending'
          id_card_image: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          driver_license?: string | null
          nationality?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'blocked' | 'pending'
          id_card_image?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          driver_license?: string | null
          nationality?: string | null
          notes?: string | null
          status?: 'active' | 'inactive' | 'blocked' | 'pending'
          id_card_image?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          make: string
          model: string
          year: number
          license_plate: string
          vin: string | null
          color: string | null
          mileage: number | null
          status: 'available' | 'rented' | 'maintenance' | 'out_of_service'
          daily_rate: number
          weekly_rate: number | null
          monthly_rate: number | null
          insurance_policy: string | null
          registration_expiry: string | null
          inspection_expiry: string | null
          notes: string | null
          images: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          make: string
          model: string
          year: number
          license_plate: string
          vin?: string | null
          color?: string | null
          mileage?: number | null
          status?: 'available' | 'rented' | 'maintenance' | 'out_of_service'
          daily_rate: number
          weekly_rate?: number | null
          monthly_rate?: number | null
          insurance_policy?: string | null
          registration_expiry?: string | null
          inspection_expiry?: string | null
          notes?: string | null
          images?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          make?: string
          model?: string
          year?: number
          license_plate?: string
          vin?: string | null
          color?: string | null
          mileage?: number | null
          status?: 'available' | 'rented' | 'maintenance' | 'out_of_service'
          daily_rate?: number
          weekly_rate?: number | null
          monthly_rate?: number | null
          insurance_policy?: string | null
          registration_expiry?: string | null
          inspection_expiry?: string | null
          notes?: string | null
          images?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      leases: {
        Row: {
          id: string
          customer_id: string
          vehicle_id: string
          start_date: string
          end_date: string
          total_amount: number
          security_deposit: number | null
          status: 'active' | 'completed' | 'cancelled' | 'overdue'
          payment_frequency: 'daily' | 'weekly' | 'monthly'
          notes: string | null
          contract_terms: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          vehicle_id: string
          start_date: string
          end_date: string
          total_amount: number
          security_deposit?: number | null
          status?: 'active' | 'completed' | 'cancelled' | 'overdue'
          payment_frequency?: 'daily' | 'weekly' | 'monthly'
          notes?: string | null
          contract_terms?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          vehicle_id?: string
          start_date?: string
          end_date?: string
          total_amount?: number
          security_deposit?: number | null
          status?: 'active' | 'completed' | 'cancelled' | 'overdue'
          payment_frequency?: 'daily' | 'weekly' | 'monthly'
          notes?: string | null
          contract_terms?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      unified_payments: {
        Row: {
          id: string
          lease_id: string
          amount: number
          payment_date: string
          payment_method: 'cash' | 'card' | 'bank_transfer' | 'check'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          reference_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lease_id: string
          amount: number
          payment_date: string
          payment_method: 'cash' | 'card' | 'bank_transfer' | 'check'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          reference_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lease_id?: string
          amount?: number
          payment_date?: string
          payment_method?: 'cash' | 'card' | 'bank_transfer' | 'check'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          reference_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_schedules: {
        Row: {
          id: string
          lease_id: string
          due_date: string
          amount: number
          status: 'pending' | 'paid' | 'overdue' | 'partial'
          paid_amount: number | null
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lease_id: string
          due_date: string
          amount: number
          status?: 'pending' | 'paid' | 'overdue' | 'partial'
          paid_amount?: number | null
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lease_id?: string
          due_date?: string
          amount?: number
          status?: 'pending' | 'paid' | 'overdue' | 'partial'
          paid_amount?: number | null
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      legal_cases: {
        Row: {
          id: string
          customer_id: string
          lease_id: string | null
          case_type: 'collection' | 'damage' | 'breach' | 'other'
          status: 'open' | 'in_progress' | 'resolved' | 'closed'
          description: string
          amount_claimed: number | null
          amount_settled: number | null
          court_date: string | null
          lawyer_assigned: string | null
          documents: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          lease_id?: string | null
          case_type: 'collection' | 'damage' | 'breach' | 'other'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          description: string
          amount_claimed?: number | null
          amount_settled?: number | null
          court_date?: string | null
          lawyer_assigned?: string | null
          documents?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          lease_id?: string | null
          case_type?: 'collection' | 'damage' | 'breach' | 'other'
          status?: 'open' | 'in_progress' | 'resolved' | 'closed'
          description?: string
          amount_claimed?: number | null
          amount_settled?: number | null
          court_date?: string | null
          lawyer_assigned?: string | null
          documents?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenance_records: {
        Row: {
          id: string
          vehicle_id: string
          maintenance_type: 'routine' | 'repair' | 'inspection' | 'emergency'
          description: string
          cost: number
          service_date: string
          next_service_date: string | null
          service_provider: string | null
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          maintenance_type: 'routine' | 'repair' | 'inspection' | 'emergency'
          description: string
          cost: number
          service_date: string
          next_service_date?: string | null
          service_provider?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          maintenance_type?: 'routine' | 'repair' | 'inspection' | 'emergency'
          description?: string
          cost?: number
          service_date?: string
          next_service_date?: string | null
          service_provider?: string | null
          status?: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      traffic_fines: {
        Row: {
          id: string
          vehicle_id: string
          customer_id: string | null
          lease_id: string | null
          fine_number: string
          violation_date: string
          amount: number
          status: 'pending' | 'paid' | 'disputed' | 'cancelled'
          description: string | null
          location: string | null
          paid_by: 'customer' | 'company' | null
          payment_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          customer_id?: string | null
          lease_id?: string | null
          fine_number: string
          violation_date: string
          amount: number
          status?: 'pending' | 'paid' | 'disputed' | 'cancelled'
          description?: string | null
          location?: string | null
          paid_by?: 'customer' | 'company' | null
          payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          customer_id?: string | null
          lease_id?: string | null
          fine_number?: string
          violation_date?: string
          amount?: number
          status?: 'pending' | 'paid' | 'disputed' | 'cancelled'
          description?: string | null
          location?: string | null
          paid_by?: 'customer' | 'company' | null
          payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
