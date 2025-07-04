'use client'

import React, { useState, useEffect } from 'react'
import { Customer, CustomerFilterParams } from '@/types/customer'
import { CustomerService } from '@/services/CustomerService'
import { Button } from '@/components/ui/Button'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  UserPlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<CustomerFilterParams>({
    limit: 20,
    offset: 0
  })
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchCustomers()
  }, [filters])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const [customersData, count] = await Promise.all([
        CustomerService.getAll(filters),
        CustomerService.getCount(filters)
      ])
      setCustomers(customersData)
      setTotalCount(count)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      offset: 0
    }))
  }

  const handleFilterChange = (key: keyof CustomerFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      blocked: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    }
    
    const statusLabels = {
      active: 'نشط',
      inactive: 'غير نشط',
      blocked: 'محظور',
      pending: 'في الانتظار'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    )
  }

  const getVerificationBadge = (status: string) => {
    const statusColors = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-orange-100 text-orange-800'
    }
    
    const statusLabels = {
      verified: 'تم التحقق',
      pending: 'في الانتظار',
      rejected: 'مرفوض',
      expired: 'منتهي الصلاحية'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA')
  }

  const handleNextPage = () => {
    setFilters(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 20)
    }))
  }

  const handlePrevPage = () => {
    setFilters(prev => ({
      ...prev,
      offset: Math.max(0, (prev.offset || 0) - (prev.limit || 20))
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">إدارة العملاء</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <UserPlusIcon className="h-5 w-5 ml-2" />
          إضافة عميل جديد
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في العملاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSearch} variant="outline">
                <MagnifyingGlassIcon className="h-4 w-4 ml-2" />
                بحث
              </Button>
              <Button variant="outline">
                <FunnelIcon className="h-4 w-4 ml-2" />
                تصفية
              </Button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">جميع الحالات</option>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
              <option value="blocked">محظور</option>
              <option value="pending">في الانتظار</option>
            </select>

            <select
              value={filters.document_verification_status || ''}
              onChange={(e) => handleFilterChange('document_verification_status', e.target.value || undefined)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">جميع حالات التحقق</option>
              <option value="pending">في انتظار التحقق</option>
              <option value="verified">تم التحقق</option>
              <option value="rejected">مرفوض</option>
              <option value="expired">منتهي الصلاحية</option>
            </select>

            <select
              value={filters.needs_review !== undefined ? filters.needs_review.toString() : ''}
              onChange={(e) => handleFilterChange('needs_review', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">جميع العملاء</option>
              <option value="true">يحتاج مراجعة</option>
              <option value="false">لا يحتاج مراجعة</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">جاري تحميل العملاء...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد عملاء مطابقة للبحث
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    معلومات الاتصال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التحقق من الوثائق
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    نقاط الإكمال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ الإنشاء
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {customer.full_name?.charAt(0) || 'ع'}
                            </span>
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.full_name || 'غير محدد'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.driver_license || 'لا يوجد رخصة'}
                          </div>
                          {customer.needs_review && (
                            <div className="flex items-center mt-1">
                              <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 ml-1" />
                              <span className="text-xs text-orange-600">يحتاج مراجعة</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.phone_number || 'لا يوجد هاتف'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.email || 'لا يوجد بريد إلكتروني'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(customer.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getVerificationBadge(customer.document_verification_status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${customer.profile_completion_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {customer.profile_completion_score}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && customers.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              عرض {(filters.offset || 0) + 1} إلى {Math.min((filters.offset || 0) + (filters.limit || 20), totalCount)} من {totalCount} عميل
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handlePrevPage}
                disabled={(filters.offset || 0) === 0}
                variant="outline"
                size="sm"
              >
                السابق
              </Button>
              <Button
                onClick={handleNextPage}
                disabled={(filters.offset || 0) + (filters.limit || 20) >= totalCount}
                variant="outline"
                size="sm"
              >
                التالي
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
