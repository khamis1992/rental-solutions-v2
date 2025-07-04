'use client'

import React, { useEffect, useState } from 'react'
import { CustomerService } from '@/services/CustomerService'
import { VehicleService } from '@/services/VehicleService'
import { LeaseService } from '@/services/LeaseService'
import { PaymentService } from '@/services/PaymentService'
import { formatCurrency } from '@/lib/utils'
import {
  UsersIcon,
  TruckIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'

interface StatsData {
  totalCustomers: number
  totalVehicles: number
  activeLeases: number
  monthlyRevenue: number
  loading: boolean
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData>({
    totalCustomers: 0,
    totalVehicles: 0,
    activeLeases: 0,
    monthlyRevenue: 0,
    loading: true,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customers, vehicles, leases, payments] = await Promise.all([
          CustomerService.getCustomers({ limit: 1 }),
          VehicleService.getVehicles({ limit: 1 }),
          LeaseService.getActiveLeases(),
          PaymentService.getPayments({ 
            limit: 100,
            date_from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
          }),
        ])

        const monthlyRevenue = payments.data.reduce((sum, payment) => sum + (payment.amount || 0), 0)

        setStats({
          totalCustomers: customers.count,
          totalVehicles: vehicles.count,
          activeLeases: leases.length,
          monthlyRevenue,
          loading: false,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
        setStats(prev => ({ ...prev, loading: false }))
      }
    }

    fetchStats()
  }, [])

  const statsCards = [
    {
      name: 'إجمالي العملاء',
      value: stats.totalCustomers,
      icon: UsersIcon,
      color: 'bg-blue-500',
      loading: stats.loading,
    },
    {
      name: 'إجمالي المركبات',
      value: stats.totalVehicles,
      icon: TruckIcon,
      color: 'bg-green-500',
      loading: stats.loading,
    },
    {
      name: 'العقود النشطة',
      value: stats.activeLeases,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
      loading: stats.loading,
    },
    {
      name: 'إيرادات الشهر',
      value: formatCurrency(stats.monthlyRevenue),
      icon: CreditCardIcon,
      color: 'bg-purple-500',
      loading: stats.loading,
      isRevenue: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((card) => (
        <div
          key={card.name}
          className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
        >
          <div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <card.icon
                  className={`h-8 w-8 text-white p-2 rounded-md ${card.color}`}
                  aria-hidden="true"
                />
              </div>
              <div className="mr-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {card.name}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {card.loading ? (
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                    ) : card.isRevenue ? (
                      card.value
                    ) : (
                      card.value.toLocaleString('ar-SA')
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
