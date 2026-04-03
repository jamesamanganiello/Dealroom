import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Sparkles, TrendingUp, MapPin, Users, Building, ChevronDown, ChevronUp,
  Bell, BellOff, Plug, CheckCircle, ArrowRight, Filter, Radar,
  Clock, Zap, Target, Bookmark, RefreshCw, History, Award, BarChart3,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {
  prospectingTargets,
  savedSearches,
  dataIntegrations,
  referenceCIMs,
} from '../mockData'

const statusBadge = {
  new: { label: 'New', bg: 'bg-blue-100', text: 'text-blue-800' },
  contacted: { label: 'Contacted', bg: 'bg-amber-100', text: 'text-amber-800' },
  saved: { label: 'Saved', bg: 'bg-gray-100', text: 'text-gray-700' },
}

const tagColors = {
  'High Conviction': 'bg-green-100 text-green-800',
  'Founder Succession': 'bg-purple-100 text-purple-800',
  'Growth Equity': 'bg-blue-100 text-blue-800',
  'Tech-Enabled': 'bg-cyan-100 text-cyan-800',
  'Platform Acquisition': 'bg-indigo-100 text-indigo-800',
  'Consolidation Play': 'bg-orange-100 text-orange-800',
  'Sponsor Exit': 'bg-amber-100 text-amber-800',
  'Regulatory Tailwind': 'bg-emerald-100 text-emerald-800',
}

export default function DealSourcing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSubmitted, setSearchSubmitted] = useState(false)
  const [expandedTarget, setExpandedTarget] = useState(null)
  const [filterTag, setFilterTag] = useState('all')
  const [showIntegrations, setShowIntegrations] = useState(true)
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchSubmitted(true)
    }
  }

  const allTags = [...new Set(prospectingTargets.flatMap((t) => t.tags))]

  const filteredTargets = filterTag === 'all'
    ? prospectingTargets
    : prospectingTargets.filter((t) => t.tags.includes(filterTag))

  const connectedCount = dataIntegrations.filter((d) => d.status === 'connected').length
  const totalRecords = dataIntegrations.reduce((sum, d) => sum + d.recordsEnriched, 0)

  // Compute provenance stats from actual referenceCIMs data
  const closedDeals = referenceCIMs.filter((c) => c.outcome === 'Closed')
  const closeRate = Math.round((closedDeals.length / referenceCIMs.length) * 100)
  const avgNDAs = Math.round(closedDeals.reduce((s, c) => s + c.ndas, 0) / closedDeals.length)

  // Map each target to its most relevant comparable closed deals
  const comparableDeals = {
    'pt-1': ['Meridian Healthcare Services', 'Apex Medical Group', 'Pacific Diagnostics'],
    'pt-2': ['CloudBridge Analytics', 'Apex Medical Group'],
    'pt-3': ['Meridian Healthcare Services', 'Pacific Diagnostics'],
    'pt-4': ['CloudBridge Analytics', 'DataStream Networks'],
    'pt-5': ['Steelpoint Industries', 'Keystone Manufacturing'],
    'pt-6': ['Meridian Healthcare Services', 'Summit Orthopedics'],
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                <Radar size={22} className="text-violet-700" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Deal Sourcing</h1>
                <p className="text-gray-600 mt-0.5">Recommendations ranked by patterns from your firm's {referenceCIMs.length} historical CIMs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-lg px-4 py-2">
                <Zap size={14} className="text-violet-600" />
                <span className="font-semibold text-violet-800">{connectedCount} sources connected</span>
                <span className="text-violet-600">·</span>
                <span className="text-violet-700">{totalRecords.toLocaleString()} records</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">

            {/* AI Search Section */}
            <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border border-violet-200 p-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={20} className="text-violet-600" />
                <h2 className="text-lg font-semibold text-gray-900">Intelligent Company Search</h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Describe what you're looking for in natural language. Results are ranked by Deal Fit Score — learned from your firm's {closedDeals.length} successfully closed deals.
              </p>
              <form onSubmit={handleSearch} className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder='Try: "healthcare services, $150-400M revenue, recurring revenue model, Southeast"'
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchSubmitted(false) }}
                    className="w-full pl-12 pr-4 py-3 border border-violet-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-violet-700 active:scale-95 transition-all"
                >
                  <Sparkles size={16} />
                  Search
                </button>
              </form>

              {searchSubmitted && (
                <div className="mt-4 bg-white rounded-lg border border-violet-200 p-4 animate-slide-in">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      Found {filteredTargets.length} companies matching your criteria
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Results ranked by Deal Fit Score — combining firmographic match, deal intelligence patterns, and market signal strength.
                    Data enriched from D&B Hoovers and PitchBook.
                  </p>
                </div>
              )}
            </div>

            {/* Firm Deal Intelligence Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <History size={16} className="text-violet-600" />
                <p className="text-xs font-semibold text-gray-500 uppercase">Recommendations powered by your deal history</p>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-violet-50 rounded-lg">
                  <p className="text-2xl font-bold text-violet-800">{referenceCIMs.length}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Historical CIMs</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-800">{closeRate}%</p>
                  <p className="text-xs text-gray-600 mt-0.5">Close Rate</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-800">{avgNDAs}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Avg NDAs (Closed)</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-800">{closedDeals.length}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Closed Deals Analyzed</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Deal Fit Scores are computed by matching target firmographics, growth trajectory, and market position against patterns from your firm's successfully closed transactions.
              </p>
            </div>

            {/* Saved Searches */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Saved Searches</h2>
                <span className="text-xs text-gray-500 ml-1">Monitoring in background</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className={`bg-white rounded-lg border p-4 transition-all hover:shadow-md ${
                      search.isActive ? 'border-violet-200' : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 leading-tight pr-2">{search.name}</p>
                      {search.isActive ? (
                        <Bell size={14} className="text-violet-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <BellOff size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="font-semibold text-violet-700">{search.matches} matches</span>
                      <span>·</span>
                      <span>Last run {search.lastRun}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Targets */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Target size={20} className="text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">Recommended Targets</h2>
                  <span className="text-xs font-semibold bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-full ml-1 flex items-center gap-1">
                    <History size={11} />
                    Ranked by Deal History
                  </span>
                </div>
                {/* Compact Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      filterTag !== 'all'
                        ? 'bg-violet-50 border-violet-300 text-violet-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Filter size={14} />
                    {filterTag === 'all' ? 'Filter' : filterTag}
                    {filterTag !== 'all' && (
                      <span
                        onClick={(e) => { e.stopPropagation(); setFilterTag('all'); setShowFilterMenu(false) }}
                        className="ml-1 text-violet-400 hover:text-violet-700 font-bold"
                      >
                        ×
                      </span>
                    )}
                    <ChevronDown size={14} />
                  </button>

                  {showFilterMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 w-52">
                        <button
                          onClick={() => { setFilterTag('all'); setShowFilterMenu(false) }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            filterTag === 'all' ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          All targets
                        </button>
                        <div className="border-t border-gray-100 my-1" />
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => { setFilterTag(tag); setShowFilterMenu(false) }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                              filterTag === tag ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${tagColors[tag]?.split(' ')[0] || 'bg-gray-300'}`} />
                            {tag}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {filteredTargets.map((target) => {
                  const isExpanded = expandedTarget === target.id
                  const badge = statusBadge[target.status]
                  return (
                    <div
                      key={target.id}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                    >
                      {/* Collapsed Card */}
                      <button
                        onClick={() => setExpandedTarget(isExpanded ? null : target.id)}
                        className="w-full text-left px-6 py-5"
                      >
                        <div className="flex items-start gap-5">
                          {/* Deal Fit Score */}
                          <div className="flex-shrink-0 text-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${
                              target.dealFitScore >= 90
                                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                                : target.dealFitScore >= 80
                                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                : 'bg-gray-100 text-gray-700 border-2 border-gray-300'
                            }`}>
                              {target.dealFitScore}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1 font-medium">Deal Fit</p>
                          </div>

                          {/* Company Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{target.name}</h3>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {target.subIndustry} · {target.location}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-700">
                                <span className="font-semibold">{target.revenue}</span> revenue
                              </span>
                              <span className="text-gray-400">|</span>
                              <span className="text-gray-700">
                                <span className="font-semibold">{target.ebitda}</span> EBITDA
                                <span className="text-gray-500 ml-1">({target.ebitdaMargin})</span>
                              </span>
                              <span className="text-gray-400">|</span>
                              <span className="flex items-center gap-1 text-green-700 font-semibold">
                                <TrendingUp size={13} />
                                {target.growth} growth
                              </span>
                            </div>
                          </div>

                          {/* Expand Toggle */}
                          <div className="flex items-center flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp size={18} className="text-gray-400" />
                            ) : (
                              <ChevronDown size={18} className="text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="px-6 pb-6 border-t border-gray-100">
                          <div className="grid grid-cols-3 gap-6 mt-5">
                            {/* AI Reasoning */}
                            <div className="col-span-2">
                              <div className="flex items-center gap-2 mb-3">
                                <Sparkles size={15} className="text-violet-600" />
                                <p className="text-xs font-semibold text-gray-500 uppercase">Why This Company</p>
                              </div>
                              <p className="text-sm text-gray-700 leading-relaxed">{target.fitReason}</p>

                              {/* Comparable Closed Deals */}
                              {comparableDeals[target.id] && (
                                <div className="mt-4 bg-violet-50 rounded-lg p-3">
                                  <div className="flex items-center gap-1.5 mb-2">
                                    <Award size={12} className="text-violet-600" />
                                    <p className="text-[10px] font-semibold text-violet-700 uppercase">Based on closed deals</p>
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {comparableDeals[target.id].map((deal) => (
                                      <span key={deal} className="inline-flex items-center gap-1 text-xs bg-white border border-violet-200 text-violet-800 px-2 py-0.5 rounded-full">
                                        <CheckCircle size={10} className="text-green-600" />
                                        {deal}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 flex items-center gap-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase">Market Signals</p>
                              </div>
                              <div className="mt-2 space-y-2">
                                {target.signals.map((signal, i) => (
                                  <div key={i} className="flex items-start gap-2">
                                    <Zap size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{signal}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="space-y-4">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Company Profile</p>
                                <div className="space-y-2.5 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Building size={13} className="text-gray-400" />
                                    <span className="text-gray-600">Industry:</span>
                                    <span className="font-medium text-gray-900 ml-auto">{target.industry}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <MapPin size={13} className="text-gray-400" />
                                    <span className="text-gray-600">HQ:</span>
                                    <span className="font-medium text-gray-900 ml-auto">{target.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Users size={13} className="text-gray-400" />
                                    <span className="text-gray-600">Employees:</span>
                                    <span className="font-medium text-gray-900 ml-auto">{target.employees.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock size={13} className="text-gray-400" />
                                    <span className="text-gray-600">Founded:</span>
                                    <span className="font-medium text-gray-900 ml-auto">{target.founded}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Tags */}
                              {target.tags.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Tags</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {target.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tagColors[tag] || 'bg-gray-100 text-gray-700'}`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-1.5 bg-violet-600 text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 active:scale-95 transition-all">
                                  <ArrowRight size={14} />
                                  Start Outreach
                                </button>
                                <button className="flex items-center justify-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all">
                                  <Bookmark size={14} />
                                </button>
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

            {/* Data Integrations Section */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Plug size={20} className="text-gray-700" />
                  <h2 className="text-xl font-bold text-gray-900">Data Sources</h2>
                  <span className="text-xs text-gray-500 ml-1">Enrich your pipeline with external intelligence</span>
                </div>
                <button
                  onClick={() => setShowIntegrations(!showIntegrations)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1"
                >
                  {showIntegrations ? 'Collapse' : 'Expand'}
                  {showIntegrations ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {showIntegrations && (
                <div className="grid grid-cols-3 gap-5">
                  {dataIntegrations.map((integration) => {
                    const isConnected = integration.status === 'connected'
                    return (
                      <div
                        key={integration.id}
                        className={`bg-white rounded-lg border p-5 transition-all hover:shadow-md ${
                          isConnected ? 'border-green-200' : 'border-gray-200'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                              style={{ backgroundColor: integration.color }}
                            >
                              {integration.icon}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{integration.name}</p>
                              {isConnected ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700">
                                  <CheckCircle size={10} />
                                  Connected
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-gray-500">Available</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-600 leading-relaxed mb-4">{integration.description}</p>

                        {/* Footer */}
                        {isConnected ? (
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-500">
                              <p><span className="font-semibold text-gray-700">{integration.recordsEnriched.toLocaleString()}</span> records enriched</p>
                              <p className="mt-0.5 flex items-center gap-1">
                                <RefreshCw size={10} />
                                Synced {integration.lastSync}
                              </p>
                            </div>
                            <button className="text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                              Settings
                            </button>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-gray-100">
                            <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-violet-100 hover:text-violet-700 transition-all">
                              <Plug size={14} />
                              Connect
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-violet-50 to-blue-50 border border-violet-200 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-violet-600" />
                <div>
                  <p className="font-semibold text-gray-900">Recommendations improve with every closed deal</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Deal Fit Scores are retrained as new CIMs close. 3 deals closed this quarter sharpened Healthcare M&A accuracy by 2.1%.
                  </p>
                </div>
              </div>
              <Link
                to="/library"
                className="flex items-center gap-2 bg-white border border-violet-200 text-violet-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-50 transition-colors flex-shrink-0"
              >
                View Deal Intelligence
                <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
