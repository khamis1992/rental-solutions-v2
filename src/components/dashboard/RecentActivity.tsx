'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { PaymentService } from '@/services/PaymentService'
import { LeaseService } from '@/services/LeaseService'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import {
  CreditCardIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

interface ActivityItem {
  id: string
  type: 'payment' | 'lease'
  title: string
  description: string
  amount?: number
  timestamp: string
  href: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const [recentPayments, recentLeases] = await Promise.all([
          PaymentService.getPayments({ limit: 5, sort: 'desc' }),
          LeaseService.getLeases({ limit: 5, sort: 'desc' }),
        ])

        const paymentActivities: ActivityItem[] = recentPayments.data.map(payment => ({
          id: payment.id,
          type: 'payment',
          title: 'دفعة جديدة',
          description: `دفعة من ${payment.leases?.profiles?.full_name || 'عميل غير محدد'}`,
          amount: payment.amount,
          timestamp: payment.created_at,
          href: `/payments/${payment.id}`,
        }))

        const leaseActivities: ActivityItem[] = recentLeases.data.map(lease => ({
          id: lease.id,
          type: 'lease',
          title: 'عقد جديد',
          description: `عقد مع ${lease.profiles?.full_name || 'عميل غير محدد'}`,
          timestamp: lease.created_at,
          href: `/leases/${lease.id}`,
        }))

        const allActivities = [...paymentActivities, ...leaseActivities]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 10)

        setActivities(allActivities)
      } catch (error) {
        console.error('Error fetching recent activity:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            النشاط الأخير
          </h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          النشاط الأخير
        </h3>
        
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              لا يوجد نشاط حديث
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              ابدأ بإضافة عملاء ومركبات وعقود لرؤية النشاط هنا
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span
                        className="absolute top-4 right-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          {activity.type === 'payment' ? (
                            <CreditCardIcon className="h-4 w-4 text-white" />
                          ) : (
                            <DocumentTextIcon className="h-4 w-4 text-white" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <Link
                            href={activity.href}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600"
                          >
                            {activity.title}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {activity.description}
                          </p>
                          {activity.amount && (
                            <p className="text-sm font-medium text-green-600">
                              {formatCurrency(activity.amount)}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          {formatDateTime(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
