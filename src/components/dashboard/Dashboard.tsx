'use client'

import React from 'react'
import { StatsCards } from './StatsCards'
import { RecentActivity } from './RecentActivity'
import { QuickActions } from './QuickActions'

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="mt-1 text-sm text-gray-500">
          نظرة عامة على أداء النظام والأنشطة الحديثة
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  )
}
