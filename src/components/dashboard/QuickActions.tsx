'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import {
  PlusIcon,
  UserPlusIcon,
  TruckIcon,
  DocumentPlusIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    name: 'إضافة عميل جديد',
    href: '/customers/new',
    icon: UserPlusIcon,
    color: 'bg-blue-600 hover:bg-blue-700',
  },
  {
    name: 'إضافة مركبة جديدة',
    href: '/vehicles/new',
    icon: TruckIcon,
    color: 'bg-green-600 hover:bg-green-700',
  },
  {
    name: 'إنشاء عقد جديد',
    href: '/leases/new',
    icon: DocumentPlusIcon,
    color: 'bg-yellow-600 hover:bg-yellow-700',
  },
  {
    name: 'تسجيل دفعة',
    href: '/payments/new',
    icon: CreditCardIcon,
    color: 'bg-purple-600 hover:bg-purple-700',
  },
]

export function QuickActions() {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          الإجراءات السريعة
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Button
                className={`w-full h-auto p-4 flex flex-col items-center space-y-2 text-white ${action.color}`}
              >
                <action.icon className="h-8 w-8" />
                <span className="text-sm font-medium text-center">
                  {action.name}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
