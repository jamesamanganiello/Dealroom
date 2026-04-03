import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, File, CheckCircle, Building, Users, Eye, X, Search, UserPlus, Shield, Lock, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import StepIndicator from '../components/StepIndicator'
import { uploadedFiles, extractedData, teamDirectory, ethicalWalls } from '../mockData'
import { useDeal } from '../context/DealContext'

export default function DataIngestion() {
  const navigate = useNavigate()
  const { updateDealData } = useDeal()
  const [companyName, setCompanyName] = useState('NovaCare Diagnostics')
  const [industry, setIndustry] = useState('Healthcare Services')
  const [transactionType, setTransactionType] = useState('Sell-Side M&A')
  const [dealSize, setDealSize] = useState('$340M')
  const [description, setDescription] = useState('Leading provider of specialized diagnostic testing services with differentiated focus on molecular diagnostics.')
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [files, setFiles] = useState([])

  // Collaborators & Watchers state
  const [collaborators, setCollaborators] = useState([teamDirectory[0], teamDirectory[1]]) // pre-seed Sarah & Marcus
  const [watchers, setWatchers] = useState([teamDirectory[7]]) // pre-seed Rachel Kim (Legal)
  const [collabSearch, setCollabSearch] = useState('')
  const [watcherSearch, setWatcherSearch] = useState('')
  const [showCollabDropdown, setShowCollabDropdown] = useState(false)
  const [showWatcherDropdown, setShowWatcherDropdown] = useState(false)
  const collabRef = useRef(null)
  const watcherRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (collabRef.current && !collabRef.current.contains(e.target)) setShowCollabDropdown(false)
      if (watcherRef.current && !watcherRef.current.contains(e.target)) setShowWatcherDropdown(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const allSelected = [...collaborators, ...watchers]
  const filterTeam = (query) =>
    teamDirectory.filter(
      (p) =>
        !allSelected.some((s) => s.id === p.id) &&
        (p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.role.toLowerCase().includes(query.toLowerCase()) ||
          p.department.toLowerCase().includes(query.toLowerCase()))
    )

  const addCollaborator = (person) => {
    setCollaborators((prev) => [...prev, person])
    setCollabSearch('')
    setShowCollabDropdown(false)
  }
  const removeCollaborator = (id) => setCollaborators((prev) => prev.filter((p) => p.id !== id))

  const addWatcher = (person) => {
    setWatchers((prev) => [...prev, person])
    setWatcherSearch('')
    setShowWatcherDropdown(false)
  }
  const removeWatcher = (id) => setWatchers((prev) => prev.filter((p) => p.id !== id))

  // Wall check state
  const [wallCheckStatus, setWallCheckStatus] = useState('idle') // idle | checking | passed | flagged
  const [wallCheckConflicts, setWallCheckConflicts] = useState([])

  const runWallCheck = () => {
    setWallCheckStatus('checking')
    // Simulate async compliance check
    setTimeout(() => {
      // Check if industry or company name overlaps with any active wall
      const conflicts = ethicalWalls.filter((wall) =>
        wall.restrictedDeals.some(
          (deal) =>
            deal.toLowerCase().includes(companyName.toLowerCase()) ||
            companyName.toLowerCase().includes(deal.toLowerCase().split(' ')[0])
        )
      )
      if (conflicts.length > 0) {
        setWallCheckConflicts(conflicts)
        setWallCheckStatus('flagged')
      } else {
        setWallCheckStatus('passed')
      }
    }, 1200)
  }

  const handleUploadClick = () => {
    setUploading(true)
    setTimeout(() => {
      setFiles(uploadedFiles)
      setUploading(false)
      setUploadComplete(true)
    }, 1500)
  }

  const handleCreateDeal = () => {
    updateDealData({
      company: companyName,
      industry: industry,
      dealSize: dealSize,
      transactionType: transactionType,
      description: description,
    })
    navigate('/deals/new/references')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        <StepIndicator currentStep={1} />

        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create New Deal</h1>
              <p className="text-gray-600 mt-2">Set up a new workspace to generate a CIM.</p>
            </div>

            {/* Deal Details Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Deal Details</h2>
              <p className="text-gray-600 text-sm mb-6">Enter the primary information for the subject company.</p>

              <div className="space-y-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Acme Corp"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                    />
                  </div>
                </div>

                {/* Industry and Transaction Type - Side by Side */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                    >
                      <option>Healthcare Services</option>
                      <option>TMT/SaaS</option>
                      <option>Industrials</option>
                      <option>Consumer/Retail</option>
                      <option>Energy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={transactionType}
                      onChange={(e) => setTransactionType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                    >
                      <option>Sell-Side M&A</option>
                      <option>Buy-Side M&A</option>
                      <option>Recapitalization</option>
                      <option>Debt Raise</option>
                      <option>Equity Raise</option>
                    </select>
                  </div>
                </div>

                {/* Deal Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Estimated Deal Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $50M - $100M"
                    value={dealSize}
                    onChange={(e) => setDealSize(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                  />
                  <p className="text-xs text-gray-600 mt-1">For matching with similar past deals.</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Brief Description
                  </label>
                  <textarea
                    placeholder="Key highlights or context about the deal..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                  />
                </div>
              </div>
            </div>

            {/* Wall Check Card */}
            <div className={`rounded-lg border p-6 mb-8 transition-all ${
              wallCheckStatus === 'passed'
                ? 'bg-emerald-50 border-emerald-200'
                : wallCheckStatus === 'flagged'
                ? 'bg-red-50 border-red-200'
                : wallCheckStatus === 'checking'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    wallCheckStatus === 'passed'
                      ? 'bg-emerald-200'
                      : wallCheckStatus === 'flagged'
                      ? 'bg-red-200'
                      : wallCheckStatus === 'checking'
                      ? 'bg-blue-200'
                      : 'bg-gray-100'
                  }`}>
                    {wallCheckStatus === 'passed' ? (
                      <CheckCircle size={18} className="text-emerald-700" />
                    ) : wallCheckStatus === 'flagged' ? (
                      <AlertTriangle size={18} className="text-red-700" />
                    ) : wallCheckStatus === 'checking' ? (
                      <Shield size={18} className="text-blue-700 animate-pulse" />
                    ) : (
                      <Shield size={18} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Ethical Wall Check</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {wallCheckStatus === 'idle' && 'Run a compliance check before proceeding'}
                      {wallCheckStatus === 'checking' && 'Scanning active walls and restrictions...'}
                      {wallCheckStatus === 'passed' && 'No conflicts detected — cleared to proceed'}
                      {wallCheckStatus === 'flagged' && `${wallCheckConflicts.length} potential conflict(s) detected`}
                    </p>
                  </div>
                </div>

                {wallCheckStatus === 'idle' && (
                  <button
                    onClick={runWallCheck}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all"
                  >
                    <Shield size={15} />
                    Run Check
                  </button>
                )}
                {wallCheckStatus === 'passed' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-200 px-3 py-1.5 rounded-full">
                    <CheckCircle size={13} />
                    Cleared
                  </span>
                )}
                {wallCheckStatus === 'checking' && (
                  <span className="text-xs font-semibold text-blue-700 animate-pulse">Checking...</span>
                )}
              </div>

              {/* Flagged conflicts detail */}
              {wallCheckStatus === 'flagged' && wallCheckConflicts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-red-200 space-y-3">
                  {wallCheckConflicts.map((conflict) => (
                    <div key={conflict.id} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-red-100">
                      <Lock size={14} className="text-red-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{conflict.name}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{conflict.reason}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between">
                    <Link to="/compliance" className="text-xs font-medium text-red-700 hover:underline">
                      View in Compliance Center →
                    </Link>
                    <button
                      onClick={() => { setWallCheckStatus('idle'); setWallCheckConflicts([]) }}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Reset check
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Deal Team Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Deal Team</h2>
              <p className="text-gray-600 text-sm mb-6">Add collaborators who can edit and comment, and watchers who receive notifications.</p>

              <div className="grid grid-cols-2 gap-8">
                {/* Collaborators */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <UserPlus size={16} className="text-blue-600" />
                    <span className="text-sm font-semibold text-gray-900">Collaborators</span>
                    <span className="text-xs text-gray-500">can edit & comment</span>
                  </div>

                  {/* Collaborator chips */}
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
                    {collaborators.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 text-sm font-medium pl-2 pr-1 py-1 rounded-full"
                      >
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {p.avatar}
                        </span>
                        {p.name}
                        <button
                          onClick={() => removeCollaborator(p.id)}
                          className="ml-0.5 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Collaborator search */}
                  <div className="relative" ref={collabRef}>
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by name, role, or team..."
                      value={collabSearch}
                      onChange={(e) => {
                        setCollabSearch(e.target.value)
                        setShowCollabDropdown(true)
                      }}
                      onFocus={() => setShowCollabDropdown(true)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {showCollabDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filterTeam(collabSearch).length === 0 ? (
                          <p className="px-4 py-3 text-sm text-gray-500">No results</p>
                        ) : (
                          filterTeam(collabSearch).map((p) => (
                            <button
                              key={p.id}
                              onClick={() => addCollaborator(p)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {p.avatar}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                <p className="text-xs text-gray-500 truncate">{p.role} · {p.department}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Watchers */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye size={16} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-900">Watchers</span>
                    <span className="text-xs text-gray-500">receive notifications only</span>
                  </div>

                  {/* Watcher chips */}
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
                    {watchers.map((p) => (
                      <span
                        key={p.id}
                        className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-300 text-gray-800 text-sm font-medium pl-2 pr-1 py-1 rounded-full"
                      >
                        <span className="w-5 h-5 rounded-full bg-gray-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {p.avatar}
                        </span>
                        {p.name}
                        <button
                          onClick={() => removeWatcher(p.id)}
                          className="ml-0.5 p-0.5 rounded-full hover:bg-gray-300 transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Watcher search */}
                  <div className="relative" ref={watcherRef}>
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Search by name, role, or team..."
                      value={watcherSearch}
                      onChange={(e) => {
                        setWatcherSearch(e.target.value)
                        setShowWatcherDropdown(true)
                      }}
                      onFocus={() => setShowWatcherDropdown(true)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {showWatcherDropdown && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filterTeam(watcherSearch).length === 0 ? (
                          <p className="px-4 py-3 text-sm text-gray-500">No results</p>
                        ) : (
                          filterTeam(watcherSearch).map((p) => (
                            <button
                              key={p.id}
                              onClick={() => addWatcher(p)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                            >
                              <span className="w-7 h-7 rounded-full bg-gray-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {p.avatar}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                                <p className="text-xs text-gray-500 truncate">{p.role} · {p.department}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Documents Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h2>
              <p className="text-gray-600 text-sm mb-6">Upload client materials for AI-powered extraction and CIM generation.</p>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-glean-blue transition-colors cursor-pointer"
                onClick={handleUploadClick}
              >
                <div className="flex justify-center mb-4">
                  <Upload size={48} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {uploading ? 'Uploading files...' : 'Drag and drop files or click to browse'}
                </p>
                <p className="text-sm text-gray-600">
                  {uploading ? 'Processing...' : 'PDF, PPTX, XLSX files accepted'}
                </p>
              </div>

              {uploadComplete && (
                <div className="mt-6 animate-slide-in">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle size={20} className="text-green-600 mr-2" />
                    Uploaded Files
                  </h3>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <File size={20} className="text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-600">{file.size}</p>
                          </div>
                        </div>
                        <span className="tag tag-blue">{file.tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Extracted Data Preview */}
            {uploadComplete && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 animate-slide-in">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Extracted Data Preview</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Company</p>
                    <p className="text-gray-900 font-semibold">{extractedData.company}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Revenue (FY2025)</p>
                    <p className="text-gray-900 font-semibold">{extractedData.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">EBITDA</p>
                    <p className="text-gray-900 font-semibold">{extractedData.ebitda} ({extractedData.ebitdaMargin} margin)</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Industry</p>
                    <p className="text-gray-900 font-semibold text-sm">{extractedData.industry}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Employees</p>
                    <p className="text-gray-900 font-semibold">{extractedData.employees}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Founded</p>
                    <p className="text-gray-900 font-semibold">{extractedData.founded}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Headquarters</p>
                    <p className="text-gray-900 font-semibold">{extractedData.headquarters}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Business Description</p>
                    <p className="text-gray-900 text-sm">{extractedData.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end">
              {uploadComplete ? (
                <button
                  onClick={handleCreateDeal}
                  className="bg-glean-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95"
                >
                  Continue to Reference Selection →
                </button>
              ) : (
                <button
                  onClick={handleCreateDeal}
                  className="bg-glean-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95"
                >
                  Create Deal Workspace
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
