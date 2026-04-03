import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, Legend,
} from 'recharts'
import { Lightbulb, Trophy, TrendingUp, MessageSquare, Sparkles } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import {
  libraryInsightsByIndustry,
  libraryDealTimeline,
  libraryFeedbackPatterns,
  libraryTopReferencedCIMs,
  librarySectionEngagement,
  libraryWinningLanguageByIndustry,
} from '../mockData'

const INDUSTRY_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444']

const INDUSTRY_COLORS_MAP = {
  'Healthcare Services': '#3b82f6',
  'TMT/SaaS': '#8b5cf6',
  'Industrials': '#f59e0b',
  'Consumer/Retail': '#10b981',
  'Energy': '#ef4444',
}

const Insights = () => {
  // Chart Tooltips
  const IndustryChartTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{data.industry}</p>
          <p className="text-sm text-gray-700">CIM Count: {data.cimCount}</p>
          <p className="text-sm text-gray-700">Avg Revenue: ${data.avgRevenue}M</p>
          <p className="text-sm text-gray-700">Avg EBITDA: {data.avgEbitdaMargin}%</p>
          <p className="text-sm text-gray-700">Avg Growth: {data.avgGrowth}%</p>
        </div>
      )
    }
    return null
  }

  const AreaChartTooltip = ({ active, payload, label }) => {
    if (active && payload) {
      return (
        <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Deal Intelligence — Insights</h1>
          <p className="text-gray-600 mt-1">Pattern recognition across 847 CIMs — deep dives into deal patterns and trends</p>
        </div>

        {/* Charts Grid */}
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* 1. Insights by Industry */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Insights by Industry</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={libraryInsightsByIndustry} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="industry" angle={-30} textAnchor="end" height={80} tick={{ fontSize: 11 }} interval={0} />
                  <YAxis />
                  <Tooltip content={<IndustryChartTooltip />} />
                  <Bar dataKey="cimCount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 2. Deal Timeline — stacked area by industry */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">CIM Volume by Quarter</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={libraryDealTimeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quarter" />
                  <YAxis />
                  <Tooltip content={<AreaChartTooltip />} />
                  <Area type="monotone" dataKey="Healthcare" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.7} />
                  <Area type="monotone" dataKey="TMT/SaaS" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.7} />
                  <Area type="monotone" dataKey="Industrials" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.7} />
                  <Area type="monotone" dataKey="Consumer/Retail" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.7} />
                  <Area type="monotone" dataKey="Energy" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.7} />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* 3. Feedback Patterns — fixed axis labels */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">Feedback Patterns</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={libraryFeedbackPatterns} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-30} textAnchor="end" height={90} tick={{ fontSize: 11 }} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {libraryFeedbackPatterns.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 4. Buyer Comments by Section — horizontal bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-cyan-600" />
                <h3 className="text-lg font-semibold text-gray-900">Buyer Comments by Section</h3>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={librarySectionEngagement} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} unit="%" />
                  <YAxis dataKey="section" type="category" width={140} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => `${val}%`} />
                  <Bar dataKey="feedbackRate" fill="#06b6d4" name="Comment Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 5. What Language Wins Deals — industry-by-industry list */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900">What Language Wins Deals</h3>
                <span className="text-xs text-gray-500 ml-2">Themes correlated with higher close rates, by industry</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {libraryWinningLanguageByIndustry.map((ind) => (
                  <div key={ind.industry} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: INDUSTRY_COLORS_MAP[ind.industry] || '#6b7280' }} />
                      <h4 className="text-sm font-bold text-gray-900">{ind.industry}</h4>
                      <span className="ml-auto text-xs text-gray-500">{ind.cimCount} CIMs analyzed</span>
                    </div>
                    <div className="space-y-2.5">
                      {ind.themes.map((theme, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                            <Sparkles size={12} className="text-amber-500" />
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">{theme.delta}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{theme.theme}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{theme.insight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Most Referenced CIMs Banner */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Referenced CIMs</h3>
            <div className="grid grid-cols-5 gap-4">
              {libraryTopReferencedCIMs.map((cim, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-2">#{index + 1}</div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{cim.name}</h4>
                  <p className="text-xs text-gray-600 mb-3">{cim.industry}</p>
                  <div className="text-xs space-y-1">
                    <p><span className="font-medium">Referenced:</span> {cim.timesReferenced}x</p>
                    <p><span className="font-medium">Top Section:</span> {cim.topSection}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Insights
