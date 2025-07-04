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
  XMarkIcon,
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

interface MobileNavProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function MobileNav({ open, setOpen }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Background overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-gray-900/80 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TruckIcon className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              نظام تأجير السيارات
            </span>
          </div>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={() => setOpen(false)}
          >
            <span className="sr-only">إغلاق القائمة</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
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
                      'group flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-7'
                    )}
                    onClick={() => setOpen(false)}
                  >
                    <item.icon
                      className={cn(
                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                        'ml-4 h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
