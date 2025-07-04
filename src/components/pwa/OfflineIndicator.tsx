'use client'

import React, { useState, useEffect } from 'react'
import { WifiIcon, NoSymbolIcon } from '@heroicons/react/24/outline'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [showOfflineMessage])

  if (!showOfflineMessage && isOnline) {
    return null
  }

  return (
    <div
      className={`fixed top-16 left-4 right-4 z-40 rounded-md p-4 transition-all duration-300 ${
        isOnline
          ? 'bg-green-50 border border-green-200'
          : 'bg-yellow-50 border border-yellow-200'
      }`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {isOnline ? (
            <WifiIcon className="h-5 w-5 text-green-400" />
          ) : (
            <NoSymbolIcon className="h-5 w-5 text-yellow-400" />
          )}
        </div>
        <div className="mr-3">
          <p
            className={`text-sm font-medium ${
              isOnline ? 'text-green-800' : 'text-yellow-800'
            }`}
          >
            {isOnline ? 'تم استعادة الاتصال' : 'لا يوجد اتصال بالإنترنت'}
          </p>
          <p
            className={`text-sm ${
              isOnline ? 'text-green-700' : 'text-yellow-700'
            }`}
          >
            {isOnline
              ? 'تم مزامنة البيانات المحفوظة محلياً'
              : 'يمكنك الاستمرار في العمل، سيتم مزامنة البيانات عند استعادة الاتصال'}
          </p>
        </div>
      </div>
    </div>
  )
}
