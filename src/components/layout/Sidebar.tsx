'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  UsersIcon,
  TruckIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ScaleIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: HomeIcon },
  { name: 'العملاء', href: '/customers', icon: UsersIcon },
  { name: 'المركبات', href: '/vehicles', icon: TruckIcon },
  { name: 'العقود', href: '/leases', icon: DocumentTextIcon },
  { name: 'المدفوعات', href: '/payments', icon: CreditCardIcon },
  { name: 'القضايا القانونية', href: '/legal', icon: ScaleIcon },
  { name: 'الصيانة', href: '/maintenance', icon: WrenchScrewdriverIcon },
  { name: 'التقارير', href: '/reports', icon: ChartBarIcon },
  { name: 'الإعدادات', href: '/settings', icon: Cog6ToothIcon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center">
          <TruckIcon className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            نظام تأجير السيارات
          </span>
        </div>
      </div>
      
      <div className="mt-5 flex-grow flex flex-col">
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                    'ml-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
