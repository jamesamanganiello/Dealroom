import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download, FileText, ArrowLeft, CheckCircle, AlertCircle,
  Building2, TrendingUp, DollarSign, Users, MapPin, Sparkles, Brain, BarChart3
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StepIndicator from '../components/StepIndicator'
import { cimSections } from '../mockData'
import { useDeal } from '../context/DealContext'

export default function Export() {
  const navigate = useNavigate()
  const { dealData, acceptedSections, sectionStatuses } = useDeal()
  const [rating, setRating] = useState(0)
  const [showFeedbackThank, setShowFeedbackThank] = useState(false)
  const [showDownloadNotification, setShowDownloadNotification] = useState(false)

  // Calculate human review stats
  const humanEditedCount = acceptedSections.length
  const totalSections = cimSections.length
  const autoOnlyCount = totalSections - humanEditedCount
  const humanCoverage = Math.round((humanEditedCount / totalSections) * 100)

  const handleStarClick = (value) => {
    setRating(value)
    setShowFeedbackThank(true)
    setTimeout(() => setShowFeedbackThank(false), 3000)
  }

  const handleDownload = (format) => {
    const filename = format === 'pptx' ? 'NovaCare_Diagnostics_CIM.pptx' : 'NovaCare_Diagnostics_CIM.pdf'
    const content = 'CIM Content - Exported on ' + new Date().toLocaleDateString()
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    setShowDownloadNotification(true)
    setTimeout(() => setShowDownloadNotification(false), 3000)
  }

  // Mock insights gathered during the flow
  const insightsGathered = [
    'Healthcare recurring revenue emphasis preferred for $300-500M deals',
    'Molecular/genomic positioning resonates stronger than general diagnostics',
    'Meridian narrative style preferred 3x over competitor templates',
    'Client retention metrics are top-cited stats in comparable CIMs',
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        <StepIndicator currentStep={5} />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* Completion banner */}
            <div className="bg-gradient-to-r from-glean-light to-blue-100 rounded-xl border border-blue-200 p-8 mb-8 text-center animate-slide-in">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-glean-blue flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-glean-blue" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">CIM Generation Complete</h2>
              <p className="text-gray-600">Your {dealData.company} CIM is ready to download and share.</p>
            </div>

            {/* Deal Profile Summary Card — mirrors Reference Library card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <Building2 size={18} className="text-glean-blue" />
                <h3 className="text-lg font-bold text-gray-900">Deal Summary</h3>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase font-medium">Company</p>
                    <p className="text-sm font-semibold text-gray-900">{dealData.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <DollarSign size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase font-medium">Revenue (FY2025)</p>
                    <p className="text-sm font-semibold text-gray-900">{dealData.revenue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase font-medium">EBITDA</p>
                    <p className="text-sm font-semibold text-gray-900">{dealData.ebitda} ({dealData.ebitdaMargin} margin)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase font-medium">3Y Growth</p>
                    <p className="text-sm font-semibold text-gray-900">{dealData.growth3Y}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
                    <Users size={16} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase font-medium">Employees</p>
                    <p className="text-sm font-semibold text-gray-900">{dealData.employees?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-rose-600" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase font-medium">Headquarters</p>
                    <p className="text-sm font-semibold text-gray-900">{dealData.headquarters}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{dealData.industry}</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{dealData.transactionType}</span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{dealData.dealSize} est.</span>
              </div>
            </div>

            {/* Stats row — emphasizing HITL */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-glean-blue mb-1">3.8 hrs</p>
                <p className="text-xs font-medium text-gray-700">Time to First Draft</p>
                <p className="text-[10px] text-gray-500 mt-0.5">vs. 2-3 weeks manually</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-glean-blue mb-1">8</p>
                <p className="text-xs font-medium text-gray-700">Reference CIMs Used</p>
              </div>
              <div className={`rounded-xl border p-5 text-center ${
                autoOnlyCount > 0
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-green-50 border-green-200'
              }`}>
                <p className={`text-3xl font-bold mb-1 ${
                  autoOnlyCount > 0 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {autoOnlyCount > 0 ? `${autoOnlyCount}/${totalSections}` : `${totalSections}/${totalSections}`}
                </p>
                <p className="text-xs font-medium text-gray-700">
                  {autoOnlyCount > 0 ? 'Sections Not Manually Edited' : 'All Sections Human-Reviewed'}
                </p>
                {autoOnlyCount > 0 && (
                  <p className="text-[10px] text-amber-600 mt-0.5 font-medium">Review recommended</p>
                )}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
                <p className="text-3xl font-bold text-glean-blue mb-1">34</p>
                <p className="text-xs font-medium text-gray-700">Source Citations</p>
              </div>
            </div>

            {/* Human review coverage — section-level detail */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain size={16} className="text-glean-blue" />
                  <h3 className="text-sm font-bold text-gray-900">Human-in-the-Loop Coverage</h3>
                </div>
                <span className="text-xs font-medium text-gray-500">{humanEditedCount} of {totalSections} sections manually edited</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {cimSections.map((section) => {
                  const wasEdited = acceptedSections.includes(section.id)
                  return (
                    <div
                      key={section.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                        wasEdited
                          ? 'bg-green-50 border border-green-200 text-green-700'
                          : 'bg-amber-50 border border-amber-200 text-amber-700'
                      }`}
                    >
                      {wasEdited ? (
                        <CheckCircle size={12} className="flex-shrink-0" />
                      ) : (
                        <AlertCircle size={12} className="flex-shrink-0" />
                      )}
                      <span className="truncate font-medium">{section.title}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Intelligence gathered */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-glean-blue" />
                <h3 className="text-sm font-bold text-gray-900">Intelligence Captured During This CIM</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {insightsGathered.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-3 pt-3 border-t border-gray-100">
                These insights are now available to improve future CIM generation for all Meridian Partners deal teams.
              </p>
            </div>

            {/* Download buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleDownload('pptx')}
                className="w-full flex items-center justify-center space-x-3 bg-glean-blue text-white py-4 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.99] text-lg transition-all"
              >
                <Download size={22} />
                <span>Download as PowerPoint (.pptx)</span>
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="w-full flex items-center justify-center space-x-3 border-2 border-glean-blue text-glean-blue py-4 rounded-xl font-semibold hover:bg-glean-light active:scale-[0.99] text-lg transition-all"
              >
                <FileText size={22} />
                <span>Download as PDF</span>
              </button>
            </div>

            {showDownloadNotification && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-in">
                <p className="text-sm text-green-700 font-medium">CIM exported successfully</p>
              </div>
            )}

            {/* Rating */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-4">How useful was this generated CIM?</h3>
              <div className="flex items-center space-x-3 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className="text-3xl transition-transform hover:scale-110 active:scale-95"
                  >
                    <span className={`${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                  </button>
                ))}
              </div>
              {showFeedbackThank && (
                <p className="text-sm text-green-600 font-medium animate-slide-in">
                  Thank you for your feedback! This helps improve DealRoom.
                </p>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              <button
                onClick={() => navigate('/deals')}
                className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-800 active:scale-95"
              >
                Return to Active Deals
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
