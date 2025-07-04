'use client'

import React, { useState, useEffect } from 'react'
import { VehicleService } from '@/services/VehicleService'
import { Vehicle, VehicleFilterParams } from '@/types/vehicle'
import { Button } from '@/components/ui/Button'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  TruckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

export function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<VehicleFilterParams>({
    limit: 20,
    offset: 0
  })
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    fetchVehicles()
  }, [filters])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const [vehiclesData, count] = await Promise.all([
        VehicleService.getAll(filters),
        VehicleService.getCount(filters)
      ])
      setVehicles(vehiclesData)
      setTotalCount(count)
    } catch (error) {
      console.error('Error fetching vehicles:', error)
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

  const handleFilterChange = (key: keyof VehicleFilterParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      available: 'bg-green-100 text-green-800',
      rented: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
      out_of_service: 'bg-red-100 text-red-800'
    }
    
    const statusLabels = {
      available: 'متاحة',
      rented: 'مؤجرة',
      maintenance: 'صيانة',
      out_of_service: 'خارج الخدمة'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount)
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
        <h1 className="text-2xl font-bold text-gray-900">إدارة المركبات</h1>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <TruckIcon className="h-5 w-5 ml-2" />
          إضافة مركبة جديدة
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
                  placeholder="البحث في المركبات..."
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
              <option value="available">متاحة</option>
              <option value="rented">مؤجرة</option>
              <option value="maintenance">صيانة</option>
              <option value="out_of_service">خارج الخدمة</option>
            </select>

            <select
              value={filters.vehicle_type || ''}
              onChange={(e) => handleFilterChange('vehicle_type', e.target.value || undefined)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">جميع الأنواع</option>
              <option value="sedan">سيدان</option>
              <option value="suv">SUV</option>
              <option value="truck">شاحنة</option>
              <option value="van">فان</option>
              <option value="motorcycle">دراجة نارية</option>
              <option value="other">أخرى</option>
            </select>

            <select
              value={filters.fuel_type || ''}
              onChange={(e) => handleFilterChange('fuel_type', e.target.value || undefined)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm"
            >
              <option value="">جميع أنواع الوقود</option>
              <option value="gasoline">بنزين</option>
              <option value="diesel">ديزل</option>
              <option value="hybrid">هجين</option>
              <option value="electric">كهربائي</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-500">جاري تحميل المركبات...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              لا توجد مركبات مطابقة للبحث
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المركبة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التفاصيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    السعر اليومي
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المسافة المقطوعة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <TruckIcon className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {vehicle.make} {vehicle.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {vehicle.year} - {vehicle.license_plate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {vehicle.color} - {vehicle.fuel_type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vehicle.transmission} - {vehicle.vehicle_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(vehicle.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(vehicle.daily_rate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.mileage.toLocaleString()} كم
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <WrenchScrewdriverIcon className="h-4 w-4" />
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

        {!loading && vehicles.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              عرض {(filters.offset || 0) + 1} إلى {Math.min((filters.offset || 0) + (filters.limit || 20), totalCount)} من {totalCount} مركبة
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
