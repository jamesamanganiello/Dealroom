import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Briefcase, PlusCircle, BookOpen, BarChart3, Shield, Radar, Settings, LogOut } from 'lucide-react'

export default function Sidebar() {
  const location = useLocation()

  const workspaceItems = [
    { label: 'Active Deals', icon: Briefcase, path: '/deals' },
    { label: 'New Deal', icon: PlusCircle, path: '/deals/new' },
    { label: 'CIM Library', icon: BookOpen, path: '/library' },
    { label: 'Insights', icon: BarChart3, path: '/insights' },
  ]

  const newBusinessItems = [
    { label: 'Deal Sourcing', icon: Radar, path: '/sourcing' },
  ]

  const securityItems = [
    { label: 'Compliance', icon: Shield, path: '/compliance' },
  ]

  const bottomNavItems = [
    { label: 'Settings', icon: Settings, path: null },
    { label: 'Log out', icon: LogOut, path: null },
  ]

  const isActive = (itemPath) => {
    if (!itemPath) return false
    if (itemPath === '/deals/new') {
      return location.pathname.startsWith('/deals/new')
    }
    return location.pathname === itemPath || (itemPath === '/deals' && location.pathname === '/')
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-glean-blue">DealRoom</h1>
        <p className="text-xs text-gray-500 mt-1">Meridian Partners</p>
      </div>

      <nav className="flex-1 p-4 flex flex-col overflow-y-auto">
        <div>
          {/* Workspace Section */}
          <p className="text-xs font-semibold text-gray-500 uppercase px-4 py-2 mb-1">Workspace</p>
          <div className="space-y-0.5">
            {workspaceItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                    active
                      ? 'bg-glean-light text-glean-blue font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* New Business Section */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase px-4 py-2 mb-1">New Business</p>
            <div className="space-y-0.5">
              {newBusinessItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                      active
                        ? 'bg-violet-50 text-violet-700 font-medium'
                        : 'text-gray-700 hover:bg-violet-50/50'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-violet-600' : ''} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Security Section */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-500 uppercase px-4 py-2 mb-1">Security</p>
            <div className="space-y-0.5">
              {securityItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 font-medium'
                        : 'text-gray-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-emerald-600' : ''} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Bottom Actions */}
        <div className="space-y-0.5 border-t border-gray-200 pt-3">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.label}
                className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-left text-sm"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 pt-4 mt-3 px-2">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-glean-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              SC
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Sarah Chen</p>
              <p className="text-xs text-gray-500 truncate">Vice President · Healthcare M&A</p>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
