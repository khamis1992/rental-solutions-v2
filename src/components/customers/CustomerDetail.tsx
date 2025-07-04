'use client'

import React, { useState, useEffect } from 'react'
import { Customer } from '@/types/customer'
import { CustomerService } from '@/services/CustomerService'
import { Button } from '@/components/ui/Button'
import {
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  CogIcon
} from '@heroicons/react/24/outline'

interface CustomerDetailProps {
  customerId: string
  onClose?: () => void
}

export function CustomerDetail({ customerId, onClose }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchCustomer()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      const customerData = await CustomerService.getById(customerId)
      setCustomer(customerData)
    } catch (error) {
      console.error('Error fetching customer:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationStatusUpdate = async (status: string, notes?: string) => {
    if (!customer) return
    
    try {
      const updatedCustomer = await CustomerService.updateDocumentVerificationStatus(
        customer.id,
        status,
        notes
      )
      setCustomer(updatedCustomer)
    } catch (error) {
      console.error('Error updating verification status:', error)
    }
  }

  const handleMarkForReview = async (reason: string) => {
    if (!customer) return
    
    try {
      const updatedCustomer = await CustomerService.markForReview(customer.id, reason)
      setCustomer(updatedCustomer)
    } catch (error) {
      console.error('Error marking for review:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لم يتم العثور على العميل</p>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'غير محدد'
    return new Date(dateString).toLocaleDateString('ar-SA')
  }

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      default:
        return <CogIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'documents', label: 'الوثائق' },
    { id: 'ai-analysis', label: 'التحليل الذكي' },
    { id: 'activity', label: 'النشاط' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {customer.full_name || 'عميل غير محدد'}
              </h2>
              <p className="text-sm text-gray-500">
                معرف العميل: {customer.id.slice(0, 8)}...
              </p>
            </div>
          </div>
          {onClose && (
            <Button onClick={onClose} variant="ghost">
              إغلاق
            </Button>
          )}
        </div>

        <div className="mt-4 flex space-x-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">المعلومات الأساسية</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">الاسم الكامل</p>
                      <p className="text-sm text-gray-600">{customer.full_name || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">رقم الهاتف</p>
                      <p className="text-sm text-gray-600">{customer.phone_number || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">البريد الإلكتروني</p>
                      <p className="text-sm text-gray-600">{customer.email || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">العنوان</p>
                      <p className="text-sm text-gray-600">{customer.address || 'غير محدد'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">رخصة القيادة</p>
                      <p className="text-sm text-gray-600">{customer.driver_license || 'غير محدد'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">حالة الحساب</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">الحالة</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      {customer.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">التحقق من الوثائق</span>
                    <div className="flex items-center">
                      {getVerificationStatusIcon(customer.document_verification_status)}
                      <span className="mr-2 text-sm text-gray-600">
                        {customer.document_verification_status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">نقاط الإكمال</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 ml-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${customer.profile_completion_score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {customer.profile_completion_score}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">معلومات إضافية</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">الجنسية</span>
                    <span className="text-sm text-gray-600">{customer.nationality || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">الدور</span>
                    <span className="text-sm text-gray-600">{customer.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">قناة التواصل المفضلة</span>
                    <span className="text-sm text-gray-600">{customer.preferred_communication_channel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">تم إرسال بريد الترحيب</span>
                    <span className="text-sm text-gray-600">
                      {customer.welcome_email_sent ? 'نعم' : 'لا'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">تتبع الموقع</span>
                    <span className="text-sm text-gray-600">
                      {customer.location_tracking_enabled ? 'مفعل' : 'غير مفعل'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">التواريخ المهمة</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">تاريخ الإنشاء</p>
                      <p className="text-sm text-gray-600">{formatDate(customer.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-gray-400 ml-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">آخر تحديث</p>
                      <p className="text-sm text-gray-600">{formatDate(customer.updated_at)}</p>
                    </div>
                  </div>
                  {customer.last_login && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 ml-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">آخر تسجيل دخول</p>
                        <p className="text-sm text-gray-600">{formatDate(customer.last_login)}</p>
                      </div>
                    </div>
                  )}
                  {customer.id_document_expiry && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 ml-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">انتهاء صلاحية الهوية</p>
                        <p className="text-sm text-gray-600">{formatDate(customer.id_document_expiry)}</p>
                      </div>
                    </div>
                  )}
                  {customer.license_document_expiry && (
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 ml-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">انتهاء صلاحية الرخصة</p>
                        <p className="text-sm text-gray-600">{formatDate(customer.license_document_expiry)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">الوثائق</h3>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleVerificationStatusUpdate('verified')}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircleIcon className="h-4 w-4 ml-2" />
                  قبول الوثائق
                </Button>
                <Button
                  onClick={() => handleVerificationStatusUpdate('rejected', 'وثائق غير صحيحة')}
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircleIcon className="h-4 w-4 ml-2" />
                  رفض الوثائق
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">وثيقة الهوية</h4>
                {customer.id_document_url ? (
                  <div className="space-y-2">
                    <img
                      src={customer.id_document_url}
                      alt="وثيقة الهوية"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <p className="text-sm text-gray-600">
                      انتهاء الصلاحية: {formatDate(customer.id_document_expiry)}
                    </p>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">لم يتم رفع وثيقة الهوية</p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">رخصة القيادة</h4>
                {customer.license_document_url ? (
                  <div className="space-y-2">
                    <img
                      src={customer.license_document_url}
                      alt="رخصة القيادة"
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <p className="text-sm text-gray-600">
                      انتهاء الصلاحية: {formatDate(customer.license_document_expiry)}
                    </p>
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center">
                    <p className="text-gray-500">لم يتم رفع رخصة القيادة</p>
                  </div>
                )}
              </div>
            </div>

            {customer.status_notes && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h4 className="font-medium text-yellow-800 mb-2">ملاحظات الحالة</h4>
                <p className="text-sm text-yellow-700">{customer.status_notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai-analysis' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">التحليل الذكي</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">حالة التحليل</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">تم إنشاؤه بالذكاء الاصطناعي</span>
                    <span className="text-sm font-medium text-blue-900">
                      {customer.is_ai_generated ? 'نعم' : 'لا'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">نقاط الثقة</span>
                    <span className="text-sm font-medium text-blue-900">
                      {customer.ai_confidence_score ? `${customer.ai_confidence_score}%` : 'غير محدد'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-800">حالة التحليل</span>
                    <span className="text-sm font-medium text-blue-900">
                      {customer.document_analysis_status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3">مراجعة التكرار</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">حالة المراجعة</span>
                    <span className="text-sm font-medium text-green-900">
                      {customer.duplicate_review_status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-800">تاريخ المراجعة</span>
                    <span className="text-sm font-medium text-green-900">
                      {formatDate(customer.duplicate_review_date)}
                    </span>
                  </div>
                  {customer.merged_into && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-800">دُمج في</span>
                      <span className="text-sm font-medium text-green-900">
                        {customer.merged_into.slice(0, 8)}...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {customer.extracted_data && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">البيانات المستخرجة</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(customer.extracted_data, null, 2)}
                </pre>
              </div>
            )}

            {customer.needs_review && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-orange-900">يحتاج مراجعة</h4>
                  <Button
                    onClick={() => handleMarkForReview('تمت المراجعة')}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    تم المراجعة
                  </Button>
                </div>
                {customer.status_notes && (
                  <p className="text-sm text-orange-700 mt-2">{customer.status_notes}</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">سجل النشاط</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm font-medium text-gray-900">تم إنشاء الحساب</p>
                <p className="text-sm text-gray-600">{formatDate(customer.created_at)}</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="text-sm font-medium text-gray-900">آخر تحديث للملف الشخصي</p>
                <p className="text-sm text-gray-600">{formatDate(customer.updated_at)}</p>
              </div>
              {customer.last_login && (
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">آخر تسجيل دخول</p>
                  <p className="text-sm text-gray-600">{formatDate(customer.last_login)}</p>
                </div>
              )}
              {customer.welcome_email_sent && (
                <div className="border-l-4 border-purple-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">تم إرسال بريد الترحيب</p>
                  <p className="text-sm text-gray-600">تم الإرسال بنجاح</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
