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
          phone_number: string | null
          email: string | null
          address: string | null
          nationality: string | null
          driver_license: string | null
          id_document_url: string | null
          license_document_url: string | null
          contract_document_url: string | null
          id_document_expiry: string | null
          license_document_expiry: string | null
          document_verification_status: string
          document_analysis_status: string
          status: string
          status_updated_at: string
          status_notes: string | null
          role: string
          profile_completion_score: number
          portal_username: string | null
          portal_password: string | null
          last_login: string | null
          location_tracking_enabled: boolean
          location_tracking_consent_date: string | null
          preferred_communication_channel: string
          welcome_email_sent: boolean
          last_document_reminder_sent: string | null
          is_ai_generated: boolean
          ai_confidence_score: number | null
          ai_generated_fields: Json | null
          needs_review: boolean
          extracted_data: Json | null
          analysis_confidence_score: number | null
          normalized_name: string | null
          duplicate_review_status: string
          duplicate_review_date: string | null
          merged_into: string | null
          form_data: Json | null
          last_form_save: string | null
          created_at: string
          updated_at: string
          notes: string | null
          id_card_image: string | null
        }
        Insert: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
          email?: string | null
          address?: string | null
          nationality?: string | null
          driver_license?: string | null
          id_document_url?: string | null
          license_document_url?: string | null
          contract_document_url?: string | null
          id_document_expiry?: string | null
          license_document_expiry?: string | null
          document_verification_status?: string
          document_analysis_status?: string
          status?: string
          status_updated_at?: string
          status_notes?: string | null
          role?: string
          profile_completion_score?: number
          portal_username?: string | null
          portal_password?: string | null
          last_login?: string | null
          location_tracking_enabled?: boolean
          location_tracking_consent_date?: string | null
          preferred_communication_channel?: string
          welcome_email_sent?: boolean
          last_document_reminder_sent?: string | null
          is_ai_generated?: boolean
          ai_confidence_score?: number | null
          ai_generated_fields?: Json | null
          needs_review?: boolean
          extracted_data?: Json | null
          analysis_confidence_score?: number | null
          normalized_name?: string | null
          duplicate_review_status?: string
          duplicate_review_date?: string | null
          merged_into?: string | null
          form_data?: Json | null
          last_form_save?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
          id_card_image?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
          email?: string | null
          address?: string | null
          nationality?: string | null
          driver_license?: string | null
          id_document_url?: string | null
          license_document_url?: string | null
          contract_document_url?: string | null
          id_document_expiry?: string | null
          license_document_expiry?: string | null
          document_verification_status?: string
          document_analysis_status?: string
          status?: string
          status_updated_at?: string
          status_notes?: string | null
          role?: string
          profile_completion_score?: number
          portal_username?: string | null
          portal_password?: string | null
          last_login?: string | null
          location_tracking_enabled?: boolean
          location_tracking_consent_date?: string | null
          preferred_communication_channel?: string
          welcome_email_sent?: boolean
          last_document_reminder_sent?: string | null
          is_ai_generated?: boolean
          ai_confidence_score?: number | null
          ai_generated_fields?: Json | null
          needs_review?: boolean
          extracted_data?: Json | null
          analysis_confidence_score?: number | null
          normalized_name?: string | null
          duplicate_review_status?: string
          duplicate_review_date?: string | null
          merged_into?: string | null
          form_data?: Json | null
          last_form_save?: string | null
          created_at?: string
          updated_at?: string
          notes?: string | null
          id_card_image?: string | null
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
      agreement_documents: {
        Row: {
          id: string
          lease_id: string
          document_type: string
          document_url: string
          uploaded_by: string | null
          created_at: string
          updated_at: string
          vehicle_id: string | null
          original_filename: string | null
          file_size: number | null
          upload_status: string
          assignment_method: string
          matched_agreement_number: string | null
        }
        Insert: {
          id?: string
          lease_id: string
          document_type: string
          document_url: string
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
          vehicle_id?: string | null
          original_filename?: string | null
          file_size?: number | null
          upload_status?: string
          assignment_method?: string
          matched_agreement_number?: string | null
        }
        Update: {
          id?: string
          lease_id?: string
          document_type?: string
          document_url?: string
          uploaded_by?: string | null
          created_at?: string
          updated_at?: string
          vehicle_id?: string | null
          original_filename?: string | null
          file_size?: number | null
          upload_status?: string
          assignment_method?: string
          matched_agreement_number?: string | null
        }
      }
      ai_payment_analysis: {
        Row: {
          id: string
          payment_id: string
          analysis_type: string
          confidence_score: number
          anomaly_detected: boolean
          risk_level: string
          recommendations: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          analysis_type: string
          confidence_score: number
          anomaly_detected?: boolean
          risk_level: string
          recommendations?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          analysis_type?: string
          confidence_score?: number
          anomaly_detected?: boolean
          risk_level?: string
          recommendations?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      alerts: {
        Row: {
          id: string
          type: string
          title: string
          message: string
          priority: string
          status: string
          user_id: string | null
          entity_type: string | null
          entity_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: string
          title: string
          message: string
          priority: string
          status?: string
          user_id?: string | null
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: string
          title?: string
          message?: string
          priority?: string
          status?: string
          user_id?: string | null
          entity_type?: string | null
          entity_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          customer_id: string
          license_number: string
          license_expiry: string
          status: string
          location_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          license_number: string
          license_expiry: string
          status?: string
          location_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          license_number?: string
          license_expiry?: string
          status?: string
          location_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string
          old_values: Json | null
          new_values: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id: string
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string
          old_values?: Json | null
          new_values?: Json | null
          created_at?: string
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
