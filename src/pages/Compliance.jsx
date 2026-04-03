import React, { useState } from 'react'
import { Shield, Lock, CheckCircle, XCircle, AlertTriangle, Clock, Eye, FileText, Users, ChevronDown, ChevronUp, Info, Search } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {
  complianceProfile,
  ethicalWalls,
  complianceAuditLog,
  restrictedCIMIds,
} from '../mockData'

const statusConfig = {
  cleared: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Cleared' },
  blocked: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Blocked' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Info' },
}

export default function Compliance() {
  const [expandedWall, setExpandedWall] = useState(null)
  const [auditFilter, setAuditFilter] = useState('all')
  const [auditSearch, setAuditSearch] = useState('')

  const filteredAudit = complianceAuditLog.filter((entry) => {
    const matchesFilter = auditFilter === 'all' || entry.status === auditFilter
    const matchesSearch =
      entry.detail.toLowerCase().includes(auditSearch.toLowerCase()) ||
      entry.action.toLowerCase().includes(auditSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const blockedCount = complianceAuditLog.filter((e) => e.status === 'blocked').length

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Shield size={22} className="text-emerald-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Compliance Center</h1>
                <p className="text-gray-600 mt-0.5">Ethical walls, access controls, and audit trail</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2">
              <CheckCircle size={16} className="text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">All Systems Active</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Access Summary Cards */}
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Your Access</span>
                  <Eye size={16} className="text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{complianceProfile.accessibleCIMs}</p>
                <p className="text-sm text-gray-600 mt-1">of {complianceProfile.totalCIMs} CIMs accessible</p>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(complianceProfile.accessibleCIMs / complianceProfile.totalCIMs) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Active Walls</span>
                  <Lock size={16} className="text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{complianceProfile.wallRestrictions}</p>
                <p className="text-sm text-gray-600 mt-1">ethical wall restrictions</p>
                <div className="mt-3 flex gap-1">
                  {ethicalWalls.map((_, i) => (
                    <div key={i} className="flex-1 h-2 bg-amber-400 rounded-full" />
                  ))}
                  <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full" />
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Access Denied</span>
                  <XCircle size={16} className="text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-red-600">{blockedCount}</p>
                <p className="text-sm text-gray-600 mt-1">blocked attempts (30 days)</p>
                <p className="text-xs text-gray-500 mt-3">All logged & reported to compliance</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Certification</span>
                  <FileText size={16} className="text-gray-400" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <p className="text-lg font-bold text-emerald-700">Active</p>
                </div>
                <p className="text-sm text-gray-600">Last audit: {complianceProfile.lastAudit}</p>
                <p className="text-xs text-gray-500 mt-2">Next review: {complianceProfile.nextAudit}</p>
              </div>
            </div>

            {/* Ethical Walls Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Lock size={20} className="text-gray-700" />
                <h2 className="text-xl font-bold text-gray-900">Active Ethical Walls</h2>
                <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ml-2">
                  {ethicalWalls.length} Active
                </span>
              </div>

              <div className="space-y-4">
                {ethicalWalls.map((wall) => {
                  const isExpanded = expandedWall === wall.id
                  return (
                    <div
                      key={wall.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedWall(isExpanded ? null : wall.id)}
                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Shield size={18} className="text-amber-700" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{wall.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded">
                                {wall.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                Created {wall.createdDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-red-50 text-red-700 px-2 py-1 rounded">
                            <Lock size={11} />
                            {wall.restrictedCIMs.length} CIM{wall.restrictedCIMs.length > 1 ? 's' : ''} restricted
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={18} className="text-gray-400" />
                          ) : (
                            <ChevronDown size={18} className="text-gray-400" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-6 pb-5 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-6 mt-4">
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Reason</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{wall.reason}</p>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Restricted Materials</p>
                                <div className="space-y-1.5">
                                  {wall.restrictedDeals.map((deal, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                      <Lock size={12} className="text-red-500" />
                                      <span className="text-gray-900 font-medium">{deal}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Approved By</p>
                                <p className="text-sm text-gray-700">{wall.approvedBy}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Audit Trail */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock size={20} className="text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">Audit Trail</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search audit log..."
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
                    />
                  </div>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'cleared', label: 'Cleared' },
                      { key: 'blocked', label: 'Blocked' },
                    ].map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setAuditFilter(f.key)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                          auditFilter === f.key
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-100">
                  {filteredAudit.map((entry) => {
                    const config = statusConfig[entry.status] || statusConfig.cleared
                    const StatusIcon = config.icon
                    return (
                      <div key={entry.id} className={`flex items-start gap-4 px-6 py-4 ${entry.status === 'blocked' ? 'bg-red-50/50' : ''}`}>
                        <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <StatusIcon size={15} className={config.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 uppercase">{entry.action}</span>
                            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                              entry.status === 'blocked'
                                ? 'bg-red-100 text-red-700'
                                : entry.status === 'info'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {config.label}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 mt-0.5">{entry.detail}</p>
                          <p className="text-xs text-gray-500 mt-1">{entry.user}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">{entry.timestamp}</span>
                      </div>
                    )
                  })}
                </div>
                {filteredAudit.length === 0 && (
                  <div className="p-8 text-center text-sm text-gray-500">No audit entries match your filter.</div>
                )}
              </div>
            </div>

            {/* Compliance Footer Note */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-6 py-4 flex items-start gap-3">
              <Shield size={18} className="text-emerald-700 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">All access is logged and auditable</p>
                <p className="text-sm text-emerald-800 mt-1">
                  Every CIM view, export, and share is tracked with user identity, timestamp, and document watermark ID.
                  Ethical wall violations are automatically blocked and reported to the Compliance team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
