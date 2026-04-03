import React, { useState, useMemo } from 'react'
import { Eye, TrendingUp, MessageSquare, Trophy, AlertTriangle, Lock, Shield, ArrowUpRight, ArrowDownRight, Minus, BarChart3, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import {
  referenceCIMs,
  libraryFeedbackPatterns,
  libraryTopReferencedCIMs,
  librarySectionEngagement,
  libraryWinningLanguage,
  restrictedCIMIds,
  complianceProfile,
} from '../mockData'

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    industries: [],
    dealSizes: [],
    outcomes: [],
    growthBuckets: [],
    transactionTypes: [],
  })
  const [activeInsightFilter, setActiveInsightFilter] = useState(null)

  const industries = ['Healthcare', 'TMT', 'Industrials', 'Consumer/Retail', 'Energy']
  const dealSizes = ['<$100M', '$100-250M', '$250-500M', '$500M+']
  const outcomes = ['Closed', 'Active', 'Withdrawn']
  const growthBuckets = ['Growing (>5%)', 'Flat (0-5%)', 'Declining (<0%)']
  const transactionTypes = ['Sell-Side M&A', 'Equity Raise', 'Recapitalization', 'Debt Raise']

  const toggleFilter = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }))
  }

  const clearAllFilters = () => {
    setFilters({ industries: [], dealSizes: [], outcomes: [], growthBuckets: [], transactionTypes: [] })
    setSearchTerm('')
    setActiveInsightFilter(null)
  }

  const getRevenueSize = (revenueStr) => {
    const value = parseInt(revenueStr.replace(/[^0-9]/g, ''))
    if (value < 100) return '<$100M'
    if (value < 250) return '$100-250M'
    if (value < 500) return '$250-500M'
    return '$500M+'
  }

  // Insight card click handlers — auto-filter the table
  const handleInsightClick = (type, filterConfig) => {
    if (activeInsightFilter === type) {
      // Toggle off
      setActiveInsightFilter(null)
      clearAllFilters()
    } else {
      setActiveInsightFilter(type)
      setFilters({ ...filters, ...filterConfig })
      if (filterConfig.search) {
        setSearchTerm(filterConfig.search)
      }
    }
  }

  const filteredCIMs = useMemo(() => {
    return referenceCIMs.filter((cim) => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        cim.name.toLowerCase().includes(searchLower) ||
        cim.industry.toLowerCase().includes(searchLower)

      const matchesIndustry =
        filters.industries.length === 0 ||
        filters.industries.some((ind) => cim.industry.includes(ind))

      const matchesDealSize =
        filters.dealSizes.length === 0 ||
        filters.dealSizes.includes(getRevenueSize(cim.revenue))

      const matchesOutcome =
        filters.outcomes.length === 0 ||
        filters.outcomes.includes(cim.outcome)

      const getGrowthBucket = (g) => {
        if (g > 5) return 'Growing (>5%)'
        if (g >= 0) return 'Flat (0-5%)'
        return 'Declining (<0%)'
      }
      const matchesGrowth =
        filters.growthBuckets.length === 0 ||
        filters.growthBuckets.includes(getGrowthBucket(cim.growth3Y))

      const matchesType =
        filters.transactionTypes.length === 0 ||
        filters.transactionTypes.includes(cim.type)

      return matchesSearch && matchesIndustry && matchesDealSize && matchesOutcome && matchesGrowth && matchesType
    })
  }, [searchTerm, filters])

  // Derive insight card data
  const topFeedback = libraryFeedbackPatterns[0] // "Financial Corrections" — most common
  const topWinningTheme = libraryWinningLanguage[0] // "Recurring Revenue Emphasis"
  const topEngagementSection = librarySectionEngagement.reduce((a, b) => a.buyerInterest > b.buyerInterest ? a : b)
  const closedDeals = referenceCIMs.filter(c => c.outcome === 'Closed')
  const avgDealSize = Math.round(closedDeals.filter(c => c.dealSize).reduce((sum, c) => sum + c.dealSize, 0) / closedDeals.filter(c => c.dealSize).length)

  // Handle referenced CIM click
  const handleReferencedCIMClick = (cimName) => {
    setSearchTerm(cimName)
    setActiveInsightFilter(null)
  }

  const insightCards = [
    {
      id: 'most-corrected',
      label: 'Most Corrected',
      value: topFeedback.type,
      detail: `${topFeedback.count} corrections across all CIMs`,
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      bgColor: activeInsightFilter === 'most-corrected' ? 'bg-red-50 border-red-300 ring-2 ring-red-200' : 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50/50',
      onClick: () => handleInsightClick('most-corrected', {}),
    },
    {
      id: 'winning-language',
      label: 'Top Winning Theme',
      value: topWinningTheme.theme,
      detail: `${topWinningTheme.delta} higher close rate vs. all CIMs`,
      icon: Trophy,
      iconColor: 'text-amber-500',
      bgColor: activeInsightFilter === 'winning-language' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-200' : 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/50',
      onClick: () => handleInsightClick('winning-language', { outcomes: ['Closed'] }),
    },
    {
      id: 'buyer-focus',
      label: 'Top Buyer Focus',
      value: topEngagementSection.section,
      detail: `${topEngagementSection.buyerInterest}% buyer interest · ${topEngagementSection.avgTimeSpent} min avg`,
      icon: TrendingUp,
      iconColor: 'text-blue-500',
      bgColor: activeInsightFilter === 'buyer-focus' ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/50',
      onClick: () => handleInsightClick('buyer-focus', {}),
    },
    {
      id: 'avg-deal-size',
      label: 'Avg Closed Deal Size',
      value: `$${avgDealSize}M`,
      detail: `${closedDeals.length} closed deals in library`,
      icon: MessageSquare,
      iconColor: 'text-green-500',
      bgColor: activeInsightFilter === 'avg-deal-size' ? 'bg-green-50 border-green-300 ring-2 ring-green-200' : 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50/50',
      onClick: () => handleInsightClick('avg-deal-size', { outcomes: ['Closed'] }),
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CIM Library</h1>
              <p className="text-gray-600 mt-1">Search and explore {complianceProfile.accessibleCIMs} CIMs across your firm's deal history</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/compliance"
                className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-100 transition-colors"
              >
                <Shield size={14} className="text-emerald-700" />
                <span className="text-xs font-semibold text-emerald-800">
                  {restrictedCIMIds.length} wall-restricted
                </span>
                <Lock size={11} className="text-emerald-600" />
              </Link>
              <Link
                to="/insights"
                className="flex items-center gap-2 bg-glean-light border border-blue-200 rounded-lg px-4 py-1.5 hover:bg-blue-100 transition-colors"
              >
                <BarChart3 size={14} className="text-glean-blue" />
                <span className="text-sm font-medium text-glean-blue">View Insights</span>
                <ChevronRight size={14} className="text-glean-blue" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Row 1: Most Referenced CIMs */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Most Referenced CIMs</h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {libraryTopReferencedCIMs.map((cim, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleReferencedCIMClick(cim.name)}
                    className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-4 w-52 hover:shadow-md hover:border-glean-blue transition-all text-left"
                  >
                    <p className="font-semibold text-gray-900 text-sm mb-1.5 truncate">{cim.name}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-glean-blue">{cim.timesReferenced}</span>
                      <span className="text-xs text-gray-500">references</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                        {cim.industry}
                      </span>
                      <span className="text-gray-400 truncate">Top: {cim.topSection}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Quick Insight Cards */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Insights</h3>
              <div className="grid grid-cols-4 gap-3">
                {insightCards.map((card) => {
                  const Icon = card.icon
                  return (
                    <button
                      key={card.id}
                      onClick={card.onClick}
                      className={`rounded-lg border p-4 text-left transition-all cursor-pointer ${card.bgColor}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Icon size={16} className={card.iconColor} />
                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{card.label}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1">{card.value}</p>
                      <p className="text-xs text-gray-500">{card.detail}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex gap-8">
              {/* Filter Sidebar */}
              <div className="w-56 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase">Filters</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-glean-blue hover:underline font-medium"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Active Insight Filter Badge */}
                  {activeInsightFilter && (
                    <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-700">Insight filter active</p>
                        <button
                          onClick={() => { setActiveInsightFilter(null); clearAllFilters() }}
                          className="text-xs text-glean-blue hover:underline"
                        >
                          Clear
                        </button>
                      </div>
                      <p className="text-sm font-medium text-glean-blue mt-1 capitalize">
                        {activeInsightFilter.replace(/-/g, ' ')}
                      </p>
                    </div>
                  )}

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Industry</p>
                    <div className="space-y-2">
                      {industries.map((ind) => (
                        <label key={ind} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.industries.includes(ind)}
                            onChange={() => toggleFilter('industries', ind)}
                            className="w-4 h-4 accent-glean-blue"
                          />
                          <span className="text-sm text-gray-700">{ind}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Deal Size</p>
                    <div className="space-y-2">
                      {dealSizes.map((size) => (
                        <label key={size} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.dealSizes.includes(size)}
                            onChange={() => toggleFilter('dealSizes', size)}
                            className="w-4 h-4 accent-glean-blue"
                          />
                          <span className="text-sm text-gray-700">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Transaction Type</p>
                    <div className="space-y-2">
                      {transactionTypes.map((tt) => (
                        <label key={tt} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.transactionTypes.includes(tt)}
                            onChange={() => toggleFilter('transactionTypes', tt)}
                            className="w-4 h-4 accent-glean-blue"
                          />
                          <span className="text-sm text-gray-700">{tt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Outcome</p>
                    <div className="space-y-2">
                      {outcomes.map((outcome) => (
                        <label key={outcome} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.outcomes.includes(outcome)}
                            onChange={() => toggleFilter('outcomes', outcome)}
                            className="w-4 h-4 accent-glean-blue"
                          />
                          <span className="text-sm text-gray-700 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${
                              outcome === 'Closed' ? 'bg-green-500' : outcome === 'Active' ? 'bg-blue-500' : 'bg-gray-400'
                            }`} />
                            {outcome}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-3">Growth (3Y)</p>
                    <div className="space-y-2">
                      {growthBuckets.map((bucket) => (
                        <label key={bucket} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.growthBuckets.includes(bucket)}
                            onChange={() => toggleFilter('growthBuckets', bucket)}
                            className="w-4 h-4 accent-glean-blue"
                          />
                          <span className="text-sm text-gray-700">{bucket}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Search Bar */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search CIMs by company name or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                  />
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-300">
                        <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" rowSpan={2}>Company</th>
                        <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" rowSpan={2}>Industry</th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-blue-700 uppercase tracking-wider border-l border-gray-300" colSpan={2}>Financial Info</th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-purple-700 uppercase tracking-wider border-l border-gray-300" colSpan={4}>Marketing Reaction</th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-amber-700 uppercase tracking-wider border-l border-gray-300" colSpan={2}>Valuation Info</th>
                        <th className="px-3 py-2 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider border-l border-gray-300" rowSpan={2}>Action</th>
                      </tr>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase border-l border-gray-300">Revenue</th>
                        <th className="px-3 py-2 text-left text-[10px] font-semibold text-gray-600 uppercase">3Y Growth</th>
                        <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase border-l border-gray-300">Contacted</th>
                        <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">NDAs</th>
                        <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Offers</th>
                        <th className="px-3 py-2 text-center text-[10px] font-semibold text-gray-600 uppercase">Outcome</th>
                        <th className="px-3 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase border-l border-gray-300">Deal Size</th>
                        <th className="px-3 py-2 text-right text-[10px] font-semibold text-gray-600 uppercase">EV/EBITDA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCIMs.map((cim) => {
                        const isRestricted = restrictedCIMIds.includes(cim.id)
                        return (
                        <tr key={cim.id} className={`transition-colors ${isRestricted ? 'bg-gray-50/80' : 'hover:bg-gray-50'}`}>
                          <td className="px-3 py-3 text-sm font-medium max-w-[180px]">
                            <div className="flex items-center gap-2">
                              {isRestricted && <Lock size={12} className="text-amber-600 flex-shrink-0" />}
                              <span className={`truncate ${isRestricted ? 'text-gray-400' : 'text-gray-900'}`}>{cim.name}</span>
                              {isRestricted && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex-shrink-0">
                                  <Shield size={8} />
                                  Wall
                                </span>
                              )}
                            </div>
                          </td>
                          <td className={`px-3 py-3 text-xs ${isRestricted ? 'text-gray-400' : 'text-gray-600'}`}>{cim.industry}</td>
                          {/* Financial Info */}
                          <td className={`px-3 py-3 text-sm border-l border-gray-100 ${isRestricted ? 'text-gray-400' : 'text-gray-700'}`}>{isRestricted ? '—' : cim.revenue}</td>
                          <td className={`px-3 py-3 text-sm ${isRestricted ? 'text-gray-400' : ''}`}>
                            {isRestricted ? '—' : (
                              <span className={`inline-flex items-center gap-0.5 font-medium ${
                                cim.growth3Y > 5 ? 'text-green-700' : cim.growth3Y >= 0 ? 'text-gray-600' : 'text-red-600'
                              }`}>
                                {cim.growth3Y > 0 ? <ArrowUpRight size={12} /> : cim.growth3Y < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                                {cim.growth3Y > 0 ? '+' : ''}{cim.growth3Y}%
                              </span>
                            )}
                          </td>
                          {/* Marketing Reaction */}
                          <td className={`px-3 py-3 text-sm text-center border-l border-gray-100 ${isRestricted ? 'text-gray-400' : 'text-gray-700'}`}>
                            {isRestricted ? '—' : cim.partiesContacted}
                          </td>
                          <td className={`px-3 py-3 text-sm text-center ${isRestricted ? 'text-gray-400' : ''}`}>
                            {isRestricted ? '—' : (
                              <span className={`font-medium ${cim.ndas >= 25 ? 'text-green-700' : cim.ndas >= 15 ? 'text-gray-700' : 'text-gray-400'}`}>
                                {cim.ndas}
                              </span>
                            )}
                          </td>
                          <td className={`px-3 py-3 text-sm text-center ${isRestricted ? 'text-gray-400' : ''}`}>
                            {isRestricted ? '—' : (
                              <span className={`font-medium ${cim.offers === null ? 'text-gray-300' : cim.offers >= 3 ? 'text-green-700' : 'text-gray-600'}`}>
                                {cim.offers === null ? '—' : cim.offers}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3 text-sm text-center">
                            {isRestricted ? <span className="text-gray-400">—</span> : (
                              <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                cim.outcome === 'Closed' ? 'bg-green-100 text-green-800'
                                : cim.outcome === 'Active' ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-500'
                              }`}>
                                {cim.outcome}
                              </span>
                            )}
                          </td>
                          {/* Valuation Info */}
                          <td className={`px-3 py-3 text-sm text-right border-l border-gray-100 ${isRestricted ? 'text-gray-400' : 'text-gray-700'}`}>
                            {isRestricted ? '—' : cim.dealSize ? `$${cim.dealSize}M` : <span className="text-gray-300">—</span>}
                          </td>
                          <td className={`px-3 py-3 text-sm text-right ${isRestricted ? 'text-gray-400' : ''}`}>
                            {isRestricted ? '—' : cim.evEbitda ? <span className="font-medium text-gray-700">{cim.evEbitda}x</span> : <span className="text-gray-300">—</span>}
                          </td>
                          {/* Action */}
                          <td className="px-3 py-3 text-center border-l border-gray-100">
                            {isRestricted ? (
                              <Link
                                to="/compliance"
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-gray-100 text-gray-500 rounded font-medium hover:bg-gray-200 transition-colors text-xs"
                              >
                                <Lock size={12} />
                                <span>Restricted</span>
                              </Link>
                            ) : (
                              <button className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-glean-light text-glean-blue rounded font-medium hover:bg-glean-lighter transition-colors text-sm">
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                            )}
                          </td>
                        </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {filteredCIMs.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-gray-600">No CIMs found matching your filters.</p>
                    </div>
                  )}
                </div>

                {/* Results Count */}
                <div className="mt-6 text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredCIMs.length}</span> of{' '}
                  <span className="font-semibold text-gray-900">{referenceCIMs.length}</span> CIMs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
