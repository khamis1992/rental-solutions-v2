'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">فتح القائمة الجانبية</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1">
          {/* Search can be added here later */}
        </div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">عرض الإشعارات</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <div className="relative">
            <div className="flex items-center gap-x-2">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <div className="hidden lg:flex lg:flex-col lg:items-start">
                <span className="text-sm font-semibold text-gray-900">
                  {user?.email || 'مستخدم'}
                </span>
                <span className="text-xs text-gray-500">مدير النظام</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700"
              >
                تسجيل الخروج
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
