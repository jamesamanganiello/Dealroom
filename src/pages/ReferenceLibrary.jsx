import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ArrowLeft, Info, ArrowUpRight, ArrowDownRight, Minus, Sparkles, Building2 } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StepIndicator from '../components/StepIndicator'
import { referenceCIMs } from '../mockData'
import { useDeal } from '../context/DealContext'

const matchExplanations = {
  1: 'Industry match (Healthcare Services), similar deal size ($380M vs target), same transaction type (Sell-Side M&A), and strong narrative overlap in Investment Highlights section.',
  2: 'Industry match (Healthcare Services), comparable revenue range ($290M), identical transaction structure, and 4 shared financial metrics formatting patterns.',
  3: 'Healthcare sub-sector alignment (Diagnostics), similar EBITDA margin profile, matching buyer universe overlap, and comparable company lifecycle stage.',
  4: 'Same broad sector (Healthcare), but larger deal size ($560M) reduces comparability. Strong match on transaction type and buyer positioning language.',
  5: 'Different industry (TMT/SaaS) but similar revenue scale ($150M) and growth-stage positioning. Equity raise structure offers template for growth narrative.',
  6: 'Different sector (Industrials) but similar deal complexity. Recapitalization structure provides useful financial presentation frameworks.',
  7: 'Consumer/Retail with comparable revenue ($280M). Sell-Side M&A structure matches. Lower score due to different industry dynamics and buyer profiles.',
  8: 'Energy sector with larger scale ($720M). Debt raise structure differs from target. Useful for financial performance section formatting only.',
  9: 'Healthcare sector match with smaller scale ($175M). Equity raise structure provides some template value for growth positioning.',
  10: 'TMT/SaaS with comparable scale ($320M). Sell-Side M&A match. Useful for technology-focused narrative patterns despite different industry.',
  11: 'Industrials sector, larger deal ($590M). Recapitalization structure. Limited direct comparability but strong financial modeling templates.',
  12: 'Consumer/Retail, smaller deal ($125M). Equity raise. Some positioning language overlap but different buyer universe.',
  13: 'Energy sector, much larger scale ($890M). Debt raise structure. Low direct comparability, useful only for specific financial formatting.',
  14: 'TMT/SaaS sector match, similar revenue ($220M). Equity raise. Moderate overlap in growth narrative and market positioning sections.',
  15: 'Industrials, mid-market ($445M). Sell-Side M&A structure matches. Some useful logistics/operations narrative patterns.',
}

export default function ReferenceLibrary() {
  const navigate = useNavigate()
  const { dealData } = useDeal()
  const [selectedReferences, setSelectedReferences] = useState([1, 2, 3])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    industries: [],
    dealSizes: [],
    outcomes: [],
    transactionTypes: [],
  })

  const industries = ['Healthcare', 'TMT', 'Industrials', 'Consumer/Retail', 'Energy']
  const dealSizes = ['<$100M', '$100-250M', '$250-500M', '$500M+']
  const outcomes = ['Closed', 'Active', 'Withdrawn']
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
    setFilters({ industries: [], dealSizes: [], outcomes: [], transactionTypes: [] })
    setSearchTerm('')
  }

  const getRevenueSize = (revenueStr) => {
    const value = parseInt(revenueStr.replace(/[^0-9]/g, ''))
    if (value < 100) return '<$100M'
    if (value < 250) return '$100-250M'
    if (value < 500) return '$250-500M'
    return '$500M+'
  }

  const filteredCIMs = useMemo(() => {
    return referenceCIMs.filter((cim) => {
      const matchesSearch =
        cim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cim.industry.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesIndustry =
        filters.industries.length === 0 ||
        filters.industries.some((ind) => cim.industry.includes(ind))

      const matchesDealSize =
        filters.dealSizes.length === 0 ||
        filters.dealSizes.includes(getRevenueSize(cim.revenue))

      const matchesOutcome =
        filters.outcomes.length === 0 ||
        filters.outcomes.includes(cim.outcome)

      const matchesType =
        filters.transactionTypes.length === 0 ||
        filters.transactionTypes.includes(cim.type)

      return matchesSearch && matchesIndustry && matchesDealSize && matchesOutcome && matchesType
    })
  }, [searchTerm, filters])

  const recommendedCIMs = referenceCIMs.slice(0, 3)

  const toggleReference = (id) => {
    setSelectedReferences((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        <StepIndicator currentStep={2} />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Reference CIMs</h2>

            {/* Your Deal Profile — AI Classification */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-glean-blue flex items-center justify-center">
                    <Building2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{dealData.company || 'Your Deal'}</h3>
                    <p className="text-sm text-gray-600">{dealData.transactionType || 'Sell-Side M&A'} · {dealData.industry || 'Healthcare Services'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/80 border border-blue-200 rounded-lg px-3 py-1.5">
                  <Sparkles size={14} className="text-glean-blue" />
                  <span className="text-xs font-semibold text-glean-blue">AI-Classified from Uploaded Documents</span>
                </div>
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white/70 rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Revenue (FY2025)</p>
                  <p className="text-xl font-bold text-gray-900">{dealData.revenue || '$340M'}</p>
                </div>
                <div className="bg-white/70 rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">3-Year Growth</p>
                  <p className={`text-xl font-bold inline-flex items-center gap-1 ${
                    (dealData.growth3Y || 8.5) > 5 ? 'text-green-700' : (dealData.growth3Y || 8.5) >= 0 ? 'text-gray-700' : 'text-red-600'
                  }`}>
                    {(dealData.growth3Y || 8.5) > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                    {(dealData.growth3Y || 8.5) > 0 ? '+' : ''}{dealData.growth3Y || 8.5}%
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Industry</p>
                  <p className="text-sm font-bold text-gray-900">{dealData.industry || 'Healthcare Services'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Diagnostic Testing</p>
                </div>
                <div className="bg-white/70 rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Est. Deal Size</p>
                  <p className="text-xl font-bold text-gray-900">{dealData.dealSize || '$340M'}</p>
                </div>
                <div className="bg-white/70 rounded-lg px-4 py-3 border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">EV / EBITDA</p>
                  {dealData.evEbitda ? (
                    <p className="text-xl font-bold text-gray-900">{dealData.evEbitda}x</p>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-400">Pending</p>
                      <p className="text-[10px] text-gray-400">Awaiting valuation</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                <Sparkles size={11} className="text-blue-400" />
                Matching {referenceCIMs.length} reference CIMs against this profile — sorted by relevance below
              </p>
            </div>

            <div className="flex gap-8">
              <div className="w-56 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-gray-900 uppercase">Filters</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-glean-blue hover:underline font-medium"
                    >
                      Clear All
                    </button>
                  </div>

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

                  <div>
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
                </div>
              </div>

              <div className="flex-1">
                <div className="mb-12">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    AI-Recommended Matches
                    {dealData.company && (
                      <span className="block text-sm font-normal text-gray-600 mt-1">
                        Based on {dealData.company}'s profile
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {recommendedCIMs.map((cim) => (
                      <div
                        key={cim.id}
                        className="bg-white rounded-lg border border-blue-200 bg-blue-50 p-6 card-hover"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-bold text-gray-900">{cim.name}</h4>
                            <div className="relative group">
                              <span className="badge badge-blue cursor-help flex items-center space-x-1">
                                <span>{cim.matchScore}% match</span>
                                <Info size={12} />
                              </span>
                              <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <p className="text-xs font-semibold text-gray-900 mb-1">AI Match Reasoning</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{matchExplanations[cim.id]}</p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                              cim.outcome === 'Closed' ? 'bg-green-100 text-green-800'
                              : cim.outcome === 'Active' ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-500'
                            }`}>
                              {cim.outcome}
                            </span>
                          </div>
                          <button
                            onClick={() => toggleReference(cim.id)}
                            className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedReferences.includes(cim.id)
                                ? 'bg-glean-blue text-white'
                                : 'bg-white border border-glean-blue text-glean-blue hover:bg-glean-light'
                            }`}
                          >
                            {selectedReferences.includes(cim.id) ? 'Selected ✓' : 'Select Reference'}
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-white/60 rounded-lg px-4 py-3 border border-blue-100">
                            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider mb-2">Financial Info</p>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-[11px] text-gray-500">Revenue</p>
                                <p className="font-semibold text-gray-900">{cim.revenue}</p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500">3Y Growth</p>
                                <p className={`font-semibold inline-flex items-center gap-0.5 ${
                                  cim.growth3Y > 5 ? 'text-green-700' : cim.growth3Y >= 0 ? 'text-gray-700' : 'text-red-600'
                                }`}>
                                  {cim.growth3Y > 0 ? '+' : ''}{cim.growth3Y}%
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500">Industry</p>
                                <p className="font-semibold text-gray-900 text-xs">{cim.industry}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white/60 rounded-lg px-4 py-3 border border-purple-100">
                            <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-2">Marketing Reaction</p>
                            <div className="grid grid-cols-3 gap-3 text-sm">
                              <div>
                                <p className="text-[11px] text-gray-500">Contacted</p>
                                <p className="font-semibold text-gray-900">{cim.partiesContacted}</p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500">NDAs</p>
                                <p className={`font-semibold ${cim.ndas >= 25 ? 'text-green-700' : 'text-gray-900'}`}>{cim.ndas}</p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500">Offers</p>
                                <p className="font-semibold text-gray-900">{cim.offers === null ? '—' : cim.offers}</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white/60 rounded-lg px-4 py-3 border border-amber-100">
                            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-2">Valuation Info</p>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-[11px] text-gray-500">Deal Size</p>
                                <p className="font-semibold text-gray-900">{cim.dealSize ? `$${cim.dealSize}M` : '—'}</p>
                              </div>
                              <div>
                                <p className="text-[11px] text-gray-500">EV/EBITDA</p>
                                <p className="font-semibold text-gray-900">{cim.evEbitda ? `${cim.evEbitda}x` : '—'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Search reference CIMs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">All Reference CIMs</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[1100px]">
                      <thead>
                        <tr className="bg-gray-100 border-b border-gray-300">
                          <th className="px-3 py-2" rowSpan={2}></th>
                          <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" rowSpan={2}>Company</th>
                          <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider" rowSpan={2}>Industry</th>
                          <th className="px-3 py-2 text-center text-[10px] font-bold text-blue-700 uppercase tracking-wider border-l border-gray-300" colSpan={2}>Financial Info</th>
                          <th className="px-3 py-2 text-center text-[10px] font-bold text-purple-700 uppercase tracking-wider border-l border-gray-300" colSpan={4}>Marketing Reaction</th>
                          <th className="px-3 py-2 text-center text-[10px] font-bold text-amber-700 uppercase tracking-wider border-l border-gray-300" colSpan={2}>Valuation Info</th>
                          <th className="px-3 py-2 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider border-l border-gray-300" rowSpan={2}>Match</th>
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
                        {filteredCIMs.map((cim) => (
                          <tr key={cim.id} className="hover:bg-gray-50 transition-colors section-item-hover">
                            <td className="px-3 py-3 text-center">
                              <button
                                onClick={() => toggleReference(cim.id)}
                                className={`p-1.5 rounded transition-colors ${
                                  selectedReferences.includes(cim.id)
                                    ? 'text-yellow-500'
                                    : 'text-gray-300 hover:text-gray-500'
                                }`}
                              >
                                <Star size={16} fill={selectedReferences.includes(cim.id) ? 'currentColor' : 'none'} />
                              </button>
                            </td>
                            <td className="px-3 py-3 text-sm font-medium text-gray-900 max-w-[180px] truncate">{cim.name}</td>
                            <td className="px-3 py-3 text-xs text-gray-600">{cim.industry}</td>
                            {/* Financial Info */}
                            <td className="px-3 py-3 text-sm text-gray-700 border-l border-gray-100">{cim.revenue}</td>
                            <td className="px-3 py-3 text-sm">
                              <span className={`inline-flex items-center gap-0.5 font-medium ${
                                cim.growth3Y > 5 ? 'text-green-700' : cim.growth3Y >= 0 ? 'text-gray-600' : 'text-red-600'
                              }`}>
                                {cim.growth3Y > 0 ? <ArrowUpRight size={12} /> : cim.growth3Y < 0 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                                {cim.growth3Y > 0 ? '+' : ''}{cim.growth3Y}%
                              </span>
                            </td>
                            {/* Marketing Reaction */}
                            <td className="px-3 py-3 text-sm text-center text-gray-700 border-l border-gray-100">{cim.partiesContacted}</td>
                            <td className="px-3 py-3 text-sm text-center">
                              <span className={`font-medium ${cim.ndas >= 25 ? 'text-green-700' : cim.ndas >= 15 ? 'text-gray-700' : 'text-gray-400'}`}>
                                {cim.ndas}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-center">
                              <span className={`font-medium ${cim.offers === null ? 'text-gray-300' : cim.offers >= 3 ? 'text-green-700' : 'text-gray-600'}`}>
                                {cim.offers === null ? '—' : cim.offers}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-sm text-center">
                              <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                cim.outcome === 'Closed' ? 'bg-green-100 text-green-800'
                                : cim.outcome === 'Active' ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-500'
                              }`}>
                                {cim.outcome}
                              </span>
                            </td>
                            {/* Valuation Info */}
                            <td className="px-3 py-3 text-sm text-right text-gray-700 border-l border-gray-100">
                              {cim.dealSize ? `$${cim.dealSize}M` : <span className="text-gray-300">—</span>}
                            </td>
                            <td className="px-3 py-3 text-sm text-right">
                              {cim.evEbitda ? <span className="font-medium text-gray-700">{cim.evEbitda}x</span> : <span className="text-gray-300">—</span>}
                            </td>
                            {/* Match */}
                            <td className="px-3 py-3 text-sm font-medium text-gray-900 border-l border-gray-100">
                              <div className="relative group inline-flex items-center space-x-1 cursor-help">
                                <span>{cim.matchScore}%</span>
                                <Info size={11} className="text-gray-400" />
                                <div className="absolute right-0 bottom-full mb-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                  <p className="text-xs font-semibold text-gray-900 mb-1">AI Match Reasoning</p>
                                  <p className="text-xs text-gray-600 leading-relaxed">{matchExplanations[cim.id]}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    <span className="font-bold text-glean-blue">{selectedReferences.length}</span> References Selected
                  </p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
                    >
                      <ArrowLeft size={18} />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => navigate('/deals/new/generate')}
                      className="bg-glean-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95"
                    >
                      Continue to Generation →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
