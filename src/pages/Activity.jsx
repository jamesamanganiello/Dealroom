import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Upload,
  BookOpen,
  PlusCircle,
  FileText,
  Edit3,
  ArrowUpRight,
  ArrowLeft,
  ChevronRight,
  Filter,
  Shield,
  Star,
  AlertCircle,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { activityFeed } from '../mockData'

const iconMap = {
  comment: MessageSquare,
  check: CheckCircle,
  flag: AlertTriangle,
  ai: Sparkles,
  upload: Upload,
  library: BookOpen,
  plus: PlusCircle,
  export: FileText,
  edit: Edit3,
  status: ArrowUpRight,
}

const seniorityConfig = {
  executive: { label: 'Executive', badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300' },
  senior: { label: 'Senior', badgeClass: 'bg-blue-100 text-blue-800 border border-blue-300' },
  mid: { label: 'Mid-Level', badgeClass: 'bg-slate-100 text-slate-700 border border-slate-300' },
  junior: { label: 'Junior', badgeClass: 'bg-gray-100 text-gray-600 border border-gray-200' },
}

const roleDisplayMap = {
  'CFO, TheraCare': { short: 'CFO', title: 'Client CFO' },
  'CEO, TheraCare': { short: 'CEO', title: 'Client CEO' },
  'Managing Director': { short: 'MD', title: 'Managing Director' },
  'Vice President': { short: 'VP', title: 'Vice President' },
  'Associate': { short: 'Assoc', title: 'Associate' },
  'Analyst': { short: 'Analyst', title: 'Analyst' },
}

export default function Activity() {
  const [filterType, setFilterType] = useState('All')
  const [filterDeal, setFilterDeal] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')

  const filterTypes = ['All', 'Collaboration', 'Comments', 'Approvals', 'System']
  const dealNames = ['All', ...new Set(activityFeed.filter(a => a.deal).map(a => a.deal))]
  const priorityOptions = ['All', 'Critical', 'High', 'Medium', 'Low']

  const filteredActivity = useMemo(() => {
    return activityFeed.filter(item => {
      if (filterType !== 'All') {
        const typeMap = {
          'Collaboration': ['collaboration'],
          'Comments': ['comment'],
          'Approvals': ['approval'],
          'System': ['generated', 'engagement', 'library', 'upload', 'system'],
        }
        if (!typeMap[filterType]?.includes(item.type)) return false
      }
      if (filterDeal !== 'All' && item.deal !== filterDeal) return false
      if (filterPriority !== 'All' && item.priority !== filterPriority.toLowerCase()) return false
      return true
    })
  }, [filterType, filterDeal, filterPriority])

  const getIcon = (iconName) => iconMap[iconName] || MessageSquare

  // Counts
  const criticalCount = activityFeed.filter(a => a.priority === 'critical').length
  const highCount = activityFeed.filter(a => a.priority === 'high').length
  const externalCount = activityFeed.filter(a => a.source === 'external').length

  const getPriorityIndicator = (priority) => {
    switch (priority) {
      case 'critical':
        return { dotClass: 'bg-red-500', textClass: 'text-red-700', bgClass: 'bg-red-50', label: 'Critical', borderClass: 'border-l-red-500' }
      case 'high':
        return { dotClass: 'bg-orange-500', textClass: 'text-orange-700', bgClass: 'bg-orange-50', label: 'High', borderClass: 'border-l-orange-400' }
      case 'medium':
        return { dotClass: 'bg-amber-400', textClass: 'text-amber-700', bgClass: 'bg-amber-50', label: 'Medium', borderClass: 'border-l-amber-300' }
      case 'low':
        return { dotClass: 'bg-gray-300', textClass: 'text-gray-500', bgClass: '', label: 'Low', borderClass: 'border-l-gray-200' }
      default:
        return { dotClass: 'bg-gray-300', textClass: 'text-gray-500', bgClass: '', label: '', borderClass: 'border-l-gray-200' }
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-gray-900 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity</h1>
              <p className="text-gray-600 mt-1">All notifications and updates across your deals</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Urgency Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg border-l-4 border-l-red-500 border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertCircle size={16} className="text-red-600" />
                  <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                </div>
                <p className="text-sm text-gray-600">Critical — requires immediate attention</p>
              </div>
              <div className="bg-white rounded-lg border-l-4 border-l-orange-400 border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Star size={16} className="text-orange-500" />
                  <p className="text-2xl font-bold text-orange-600">{highCount}</p>
                </div>
                <p className="text-sm text-gray-600">High priority — senior leadership</p>
              </div>
              <div className="bg-white rounded-lg border-l-4 border-l-amber-500 border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Shield size={16} className="text-amber-600" />
                  <p className="text-2xl font-bold text-amber-600">{externalCount}</p>
                </div>
                <p className="text-sm text-gray-600">External client feedback</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center flex-wrap gap-3 mb-6">
              <div className="flex items-center space-x-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm font-semibold text-gray-700">Filter:</span>
              </div>
              <div className="flex items-center space-x-2">
                {filterTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterType === type
                        ? 'bg-glean-blue text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white"
              >
                {priorityOptions.map(p => (
                  <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>
                ))}
              </select>
              <select
                value={filterDeal}
                onChange={(e) => setFilterDeal(e.target.value)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white"
              >
                {dealNames.map(name => (
                  <option key={name} value={name}>{name === 'All' ? 'All Deals' : name}</option>
                ))}
              </select>
            </div>

            {/* Activity List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {filteredActivity.map((item) => {
                  const IconComponent = getIcon(item.icon)
                  const hasLink = !!item.link
                  const pri = getPriorityIndicator(item.priority)
                  const isExternal = item.source === 'external'
                  const isSenior = item.seniority === 'senior' || item.seniority === 'executive'
                  const roleInfo = roleDisplayMap[item.role]

                  return (
                    <div
                      key={item.id}
                      className={`px-6 py-5 hover:bg-gray-50 transition-colors border-l-4 ${pri.borderClass} ${pri.bgClass}`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Avatar with source indicator */}
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                            isExternal
                              ? 'bg-amber-500 text-white'
                              : isSenior
                              ? 'bg-blue-600 text-white'
                              : item.user === 'System'
                              ? `${item.color} text-gray-700`
                              : 'bg-blue-400 text-white'
                          }`}>
                            {item.user === 'System' ? (
                              <IconComponent size={18} />
                            ) : (
                              item.initials
                            )}
                          </div>
                          {/* Priority dot overlay */}
                          {(item.priority === 'critical' || item.priority === 'high') && (
                            <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 ${pri.dotClass} rounded-full border-2 border-white`} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              {/* Name + Role + Badges line */}
                              <div className="flex items-center flex-wrap gap-2 mb-1">
                                <span className="font-bold text-gray-900">{item.user}</span>

                                {/* Role badge */}
                                {roleInfo && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                    isExternal
                                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                      : seniorityConfig[item.seniority]?.badgeClass || 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {roleInfo.title}
                                  </span>
                                )}

                                {/* External flag */}
                                {isExternal && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500 text-white">
                                    <Shield size={10} />
                                    <span>External</span>
                                  </span>
                                )}

                                {/* Priority flag for critical/high */}
                                {item.priority === 'critical' && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                                    <AlertCircle size={10} />
                                    <span>Critical</span>
                                  </span>
                                )}
                                {item.priority === 'high' && (
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                                    <Star size={10} />
                                    <span>High Priority</span>
                                  </span>
                                )}
                              </div>

                              {/* Action text */}
                              <p className="text-sm text-gray-700">{item.action}</p>

                              {/* Detail text */}
                              {item.detail && (
                                <p className="text-sm text-gray-500 mt-1">{item.detail}</p>
                              )}

                              {/* Deal tag */}
                              {item.deal && (
                                <span className="inline-block mt-2 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                  {item.deal}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
                              <span className="text-sm text-gray-500 whitespace-nowrap">{item.timestamp}</span>
                              {hasLink && (
                                <Link
                                  to={item.link}
                                  className="flex items-center space-x-1 text-glean-blue hover:text-blue-700 text-sm font-medium whitespace-nowrap"
                                >
                                  <span>View</span>
                                  <ChevronRight size={14} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredActivity.length === 0 && (
                <div className="p-12 text-center">
                  <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">No activity matches your filters.</p>
                </div>
              )}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredActivity.length} of {activityFeed.length} updates
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
