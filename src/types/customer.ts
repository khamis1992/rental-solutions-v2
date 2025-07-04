export type CustomerStatus = 'active' | 'inactive' | 'blocked' | 'pending'
export type DocumentVerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired'
export type DocumentAnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed'
export type DuplicateReviewStatus = 'pending' | 'reviewed' | 'duplicate' | 'unique'
export type CommunicationChannel = 'email' | 'sms' | 'whatsapp' | 'phone'

export interface Customer {
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
  document_verification_status: DocumentVerificationStatus
  document_analysis_status: DocumentAnalysisStatus
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
  preferred_communication_channel: CommunicationChannel
  welcome_email_sent: boolean
  last_document_reminder_sent: string | null
  is_ai_generated: boolean
  ai_confidence_score: number | null
  ai_generated_fields: any | null
  needs_review: boolean
  extracted_data: any | null
  analysis_confidence_score: number | null
  normalized_name: string | null
  duplicate_review_status: DuplicateReviewStatus
  duplicate_review_date: string | null
  merged_into: string | null
  form_data: any | null
  last_form_save: string | null
  created_at: string
  updated_at: string
  notes: string | null
  id_card_image: string | null
}

export interface CustomerFilterParams {
  search?: string
  status?: string
  document_verification_status?: DocumentVerificationStatus
  document_analysis_status?: DocumentAnalysisStatus
  duplicate_review_status?: DuplicateReviewStatus
  needs_review?: boolean
  is_ai_generated?: boolean
  role?: string
  nationality?: string
  limit?: number
  offset?: number
  sort?: 'asc' | 'desc'
  sort_by?: 'full_name' | 'created_at' | 'updated_at' | 'profile_completion_score'
}

export interface CreateCustomerRequest {
  full_name: string
  phone_number?: string
  email?: string
  address?: string
  nationality?: string
  driver_license?: string
  id_document_url?: string
  license_document_url?: string
  contract_document_url?: string
  id_document_expiry?: string
  license_document_expiry?: string
  document_verification_status?: DocumentVerificationStatus
  document_analysis_status?: DocumentAnalysisStatus
  status?: string
  role?: string
  portal_username?: string
  portal_password?: string
  location_tracking_enabled?: boolean
  preferred_communication_channel?: CommunicationChannel
  notes?: string
  id_card_image?: string
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {
  id: string
}

export interface CustomerAnalytics {
  total_customers: number
  active_customers: number
  pending_verification: number
  ai_generated_customers: number
  needs_review_count: number
  completion_score_average: number
  verification_status_breakdown: Record<DocumentVerificationStatus, number>
  communication_channel_breakdown: Record<CommunicationChannel, number>
}
