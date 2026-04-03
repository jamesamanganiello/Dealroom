import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight, MessageSquare, CheckCircle, AlertTriangle, Sparkles, Upload, BookOpen, PlusCircle, FileText, Shield, AlertCircle, Star, TrendingUp, TrendingDown, Trophy, Target, BarChart3, Users, Clock, ChevronRight, ChevronDown, Edit3, ArrowUpRight } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { dealActivity, libraryInsightsByIndustry, libraryWinningLanguage, libraryFeedbackPatterns, libraryDealTimeline } from '../mockData'

const activityIconMap = {
  revision: Upload,
  comment: MessageSquare,
  approval: CheckCircle,
  generated: Sparkles,
  upload: Upload,
  export: FileText,
  engagement: PlusCircle,
}

const statusBadgeConfig = {
  green: 'bg-green-100 text-green-800',
  blue: 'bg-blue-100 text-blue-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  purple: 'bg-purple-100 text-purple-800',
  gray: 'bg-gray-100 text-gray-700',
}

// Derived insight summaries for dashboard cards
const topIndustry = [...libraryInsightsByIndustry].sort((a, b) => b.cimCount - a.cimCount)[0]
const topWinningTheme = libraryWinningLanguage[0]
const topFeedbackType = [...libraryFeedbackPatterns].sort((a, b) => b.count - a.count)[0]
const latestQuarter = libraryDealTimeline[libraryDealTimeline.length - 1]
const prevQuarter = libraryDealTimeline[libraryDealTimeline.length - 2]
const totalLatest = Object.values(latestQuarter).reduce((sum, v) => typeof v === 'number' ? sum + v : sum, 0)
const totalPrev = Object.values(prevQuarter).reduce((sum, v) => typeof v === 'number' ? sum + v : sum, 0)
const volumeChange = Math.round(((totalLatest - totalPrev) / totalPrev) * 100)

export default function Dashboard() {
  const getDateString = () => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, James</h1>
              <p className="text-gray-600 mt-1">{getDateString()}</p>
            </div>
            <Link
              to="/deals/new"
              className="flex items-center space-x-2 bg-glean-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95"
            >
              <Plus size={20} />
              <span>New Deal</span>
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Pick Up Where You Left Off */}
            <Link
              to="/deals/5/review"
              className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 px-5 py-3 hover:shadow-md hover:border-glean-blue transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-glean-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-500 uppercase">Pick up where you left off</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5 truncate">
                  TheraCare Solutions — CIM Review · Section: Financial Performance
                </p>
              </div>
              <span className="text-xs text-gray-500 flex-shrink-0">12 min ago</span>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-glean-blue transition-colors flex-shrink-0" />
            </Link>

            {/* Active Deals Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Active Deals</h2>
                <Link to="/deals" className="flex items-center space-x-1 text-glean-blue hover:text-blue-700 font-medium">
                  <span>View All Deals</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="space-y-4">
                {dealActivity.map((deal) => {
                  const hasCritical = deal.items.some(i => i.priority === 'critical')
                  const hasHigh = deal.items.some(i => i.priority === 'high')
                  const hasImported = deal.items.some(i => i.source === 'imported')

                  return (
                    <div
                      key={deal.dealId}
                      className={`bg-white rounded-lg border overflow-hidden ${
                        hasCritical ? 'border-red-200' : hasHigh ? 'border-orange-200' : 'border-gray-200'
                      }`}
                    >
                      {/* Deal Header */}
                      <Link
                        to={deal.link}
                        className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {hasCritical && (
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                            )}
                            {!hasCritical && hasHigh && (
                              <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                            )}
                            {!hasCritical && !hasHigh && (
                              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-gray-900">{deal.dealName}</h3>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadgeConfig[deal.statusBadge] || 'bg-gray-100 text-gray-700'}`}>
                                {deal.status}
                              </span>
                              {deal.version !== '—' && (
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {deal.version}
                                </span>
                              )}
                              {hasImported && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                  <Upload size={10} />
                                  Imported feedback
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{deal.industry} · Updated {deal.lastUpdated}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{deal.items.length} update{deal.items.length > 1 ? 's' : ''}</span>
                          <ChevronRight size={16} className="text-gray-400 group-hover:text-glean-blue transition-colors" />
                        </div>
                      </Link>

                      {/* Nested Activity Items */}
                      <div className="border-t border-gray-100 divide-y divide-gray-50">
                        {deal.items.slice(0, 3).map((item) => {
                          const Icon = activityIconMap[item.type] || MessageSquare
                          const isImported = item.source === 'imported'
                          const isSystem = item.source === 'system'

                          return (
                            <div key={item.id} className="flex items-start gap-3 px-5 py-3 pl-10">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                isImported
                                  ? 'bg-amber-100 text-amber-700'
                                  : isSystem
                                  ? 'bg-gray-100 text-gray-500'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {isSystem || isImported ? (
                                  <Icon size={14} />
                                ) : (
                                  item.initials
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {!isSystem && <span className="text-xs font-semibold text-gray-900">{item.user}</span>}
                                  {item.role && <span className="text-xs text-gray-500">{item.role}</span>}
                                  {item.priority === 'critical' && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                      <AlertCircle size={9} />
                                      Critical
                                    </span>
                                  )}
                                  {isImported && (
                                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                                      <Upload size={9} />
                                      From file
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">{item.action}</p>
                              </div>
                              <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0">{item.timestamp}</span>
                            </div>
                          )
                        })}
                        {deal.items.length > 3 && (
                          <Link
                            to={deal.link}
                            className="block px-5 py-2.5 pl-10 text-xs font-medium text-glean-blue hover:text-blue-700 hover:bg-gray-50 transition-colors"
                          >
                            +{deal.items.length - 3} more update{deal.items.length - 3 > 1 ? 's' : ''} →
                          </Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Library Insights Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Deal Intelligence</h2>
                <Link to="/library" className="flex items-center space-x-1 text-glean-blue hover:text-blue-700 font-medium">
                  <span>View All Insights</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {/* Card 1: CIM Volume Trend → links to CIM Volume chart */}
                <Link to="/library" className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-glean-blue transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">CIM Volume</span>
                    <BarChart3 size={16} className="text-gray-400 group-hover:text-glean-blue transition-colors" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">847</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={14} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-600">+{volumeChange}%</span>
                    <span className="text-xs text-gray-500 ml-1">vs last quarter</span>
                  </div>
                  {/* Mini sparkline bars */}
                  <div className="flex items-end gap-1 mt-3 h-6">
                    {libraryDealTimeline.slice(-6).map((q, i) => {
                      const total = Object.values(q).reduce((s, v) => typeof v === 'number' ? s + v : s, 0)
                      const maxH = 24
                      const h = Math.max(4, (total / 70) * maxH)
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-blue-400 group-hover:bg-blue-500 transition-colors"
                          style={{ height: `${h}px` }}
                        />
                      )
                    })}
                  </div>
                </Link>

                {/* Card 2: Top Industry → links to Portfolio by Industry chart */}
                <Link to="/library" className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-glean-blue transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Top Sector</span>
                    <Users size={16} className="text-gray-400 group-hover:text-glean-blue transition-colors" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{topIndustry.industry}</p>
                  <p className="text-sm text-gray-600 mt-1">{topIndustry.cimCount} CIMs · ${topIndustry.avgRevenue}M avg</p>
                  {/* Mini industry distribution */}
                  <div className="flex gap-0.5 mt-3 h-3 rounded-full overflow-hidden">
                    {libraryInsightsByIndustry.map((ind, i) => (
                      <div
                        key={i}
                        className="h-full transition-all"
                        style={{
                          flex: ind.cimCount,
                          backgroundColor: ind.color,
                          opacity: 0.8,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {libraryInsightsByIndustry.slice(0, 3).map((ind, i) => (
                      <span key={i} className="text-[10px] text-gray-500">{i > 0 ? '·' : ''} {ind.industry}</span>
                    ))}
                  </div>
                </Link>

                {/* Card 3: Winning Language → links to What Language Wins chart */}
                <Link to="/library" className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-glean-blue transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Winning Pattern</span>
                    <Trophy size={16} className="text-amber-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{topWinningTheme.theme}</p>
                  <p className="text-sm text-gray-600 mt-1">{topWinningTheme.delta} higher in winning CIMs</p>
                  {/* Mini comparison bars */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Win</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${topWinningTheme.winRate}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-green-700 w-8 text-right">{topWinningTheme.winRate}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">All</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-400 rounded-full" style={{ width: `${topWinningTheme.allCIMRate}%` }} />
                      </div>
                      <span className="text-[10px] font-semibold text-gray-500 w-8 text-right">{topWinningTheme.allCIMRate}%</span>
                    </div>
                  </div>
                </Link>

                {/* Card 4: Top Feedback → links to Feedback Patterns chart */}
                <Link to="/library" className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md hover:border-glean-blue transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">#1 Revision Type</span>
                    <Target size={16} className="text-gray-400 group-hover:text-glean-blue transition-colors" />
                  </div>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{topFeedbackType.type}</p>
                  <p className="text-sm text-gray-600 mt-1">{topFeedbackType.count} revisions across all CIMs</p>
                  {/* Mini stacked bar showing all feedback types */}
                  <div className="mt-3 space-y-1.5">
                    {libraryFeedbackPatterns.slice(0, 3).map((fb, i) => {
                      const maxCount = libraryFeedbackPatterns[0].count
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 truncate w-16">{fb.type.split(' ')[0]}</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(fb.count / maxCount) * 100}%`, backgroundColor: fb.color }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
