import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  ChevronDown,
  ChevronRight,
  Send,
  FileText,
  Users,
  MoreHorizontal,
  Star,
  Download,
  Upload,
  History,
  GitBranch,
  Sparkles,
  Wand2,
  Bot,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { deals, theraCareCIMSections, theraCareCIMContent, theraCareCollaborators, theraCareComments } from '../mockData'

const versionHistory = [
  { version: 'v3', label: 'v3 — Current', date: 'Apr 1, 2026', author: 'Tom Martinez', source: 'imported', detail: '6 comments extracted from marked-up PowerPoint (CFO + COO feedback)' },
  { version: 'v2', label: 'v2', date: 'Mar 28, 2026', author: 'James Wilson', source: 'internal', detail: 'Internal review round — MD approved 5 of 7 sections' },
  { version: 'v1', label: 'v1 — AI Draft', date: 'Mar 25, 2026', author: 'System', source: 'system', detail: 'Initial CIM generated from 8 reference CIMs, 34 source citations' },
]

export default function CIMReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dealId = parseInt(id)

  const deal = deals.find(d => d.id === dealId)
  if (!deal) {
    return <div>Deal not found</div>
  }

  const [currentSectionId, setCurrentSectionId] = useState(1)
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterSource, setFilterSource] = useState('All')
  const [expandedThreads, setExpandedThreads] = useState({})
  const [newComment, setNewComment] = useState('')
  const [newCommentTag, setNewCommentTag] = useState('Narrative Adjustment')
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const currentVersion = versionHistory[0]

  const currentSection = theraCareCIMSections.find(s => s.id === currentSectionId)
  const sectionContent = theraCareCIMContent[currentSectionId]

  // Get collaborator map
  const collaboratorMap = useMemo(() => {
    const map = {}
    theraCareCollaborators.forEach(c => {
      map[c.id] = c
    })
    return map
  }, [])

  // Filter and sort comments for current section
  const filteredComments = useMemo(() => {
    let filtered = theraCareComments.filter(c => c.sectionId === currentSectionId)

    if (filterStatus !== 'All') {
      filtered = filtered.filter(c => c.status === filterStatus.toLowerCase())
    }

    if (filterSource !== 'All') {
      const type = filterSource === 'Internal' ? 'internal' : 'external'
      filtered = filtered.filter(c => {
        const author = collaboratorMap[c.authorId]
        return author && author.type === type
      })
    }

    // Default sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

    return filtered
  }, [currentSectionId, filterStatus, filterSource, collaboratorMap])

  // Count summary
  const allComments = theraCareComments.filter(c => c.sectionId === currentSectionId)
  const openCount = allComments.filter(c => c.status === 'open').length
  const addressedCount = allComments.filter(c => c.status === 'addressed').length
  const resolvedCount = allComments.filter(c => c.status === 'resolved').length

  // Get avatar color for priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600'
      case 'high':
        return 'text-orange-600'
      case 'medium':
        return 'text-amber-600'
      case 'low':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  const getPriorityDotColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600'
      case 'high':
        return 'bg-orange-600'
      case 'medium':
        return 'bg-amber-500'
      case 'low':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getTagColor = (tag) => {
    switch (tag) {
      case 'Financial Correction':
        return 'bg-red-100 text-red-800'
      case 'Narrative Adjustment':
        return 'bg-blue-100 text-blue-800'
      case 'Client Preference':
        return 'bg-purple-100 text-purple-800'
      case 'Positioning Change':
        return 'bg-teal-100 text-teal-800'
      case 'Factual Error':
        return 'bg-red-100 text-red-800'
      case 'Compliance Flag':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'open':
        return { label: 'Open', bgColor: 'bg-red-50', borderColor: 'border-red-300', textColor: 'text-red-700' }
      case 'addressed':
        return { label: 'Addressed', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-300', textColor: 'text-yellow-700' }
      case 'resolved':
        return { label: 'Resolved', bgColor: 'bg-green-50', borderColor: 'border-green-300', textColor: 'text-green-700' }
      default:
        return { label: 'Open', bgColor: 'bg-red-50', borderColor: 'border-red-300', textColor: 'text-red-700' }
    }
  }

  const toggleThread = (commentId) => {
    setExpandedThreads(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      // In a real app, this would send to backend
      setNewComment('')
      setNewCommentTag('Narrative Adjustment')
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/deals')}
                className="text-gray-500 hover:text-gray-900 p-1"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{deal.name}</h1>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">CIM Review</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {deal.revenue} · {deal.industry} · Sell-Side M&A
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Version Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowVersionHistory(!showVersionHistory)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <GitBranch size={14} className="text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">{currentVersion.label}</span>
                  {currentVersion.source === 'imported' && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                      <Upload size={9} />
                      Imported
                    </span>
                  )}
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {showVersionHistory && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <History size={14} className="text-gray-600" />
                        <span className="text-xs font-semibold text-gray-700 uppercase">Version History</span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {versionHistory.map((v, idx) => (
                        <button
                          key={v.version}
                          onClick={() => setShowVersionHistory(false)}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${idx === 0 ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-sm font-semibold ${idx === 0 ? 'text-glean-blue' : 'text-gray-900'}`}>{v.label}</span>
                            {v.source === 'imported' && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
                                <Upload size={9} />
                                From file
                              </span>
                            )}
                            {v.source === 'system' && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded">
                                AI Generated
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{v.detail}</p>
                          <p className="text-xs text-gray-400 mt-1">{v.date} · {v.author}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 mb-2">Last updated 2 hours ago</p>
                <div className="flex items-center space-x-2">
                  {deal.team.split(', ').slice(0, 3).map((name, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center"
                      style={{ marginLeft: idx > 0 ? '-8px' : '0' }}
                    >
                      {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  ))}
                </div>
              </div>

              <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Download size={18} />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content — 3-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Rail — CIM Sections Nav */}
          <div className="w-60 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            <div className="px-4 pt-5 pb-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">CIM Sections</p>
            </div>
            <nav className="px-2 pb-4 space-y-0.5">
              {theraCareCIMSections.map(section => {
                const sectionComments = theraCareComments.filter(c => c.sectionId === section.id)
                const sectionOpen = sectionComments.filter(c => c.status === 'open').length
                return (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSectionId(section.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                      currentSectionId === section.id
                        ? 'bg-blue-50 text-glean-blue font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        section.status === 'approved'
                          ? 'bg-green-500'
                          : section.status === 'in-review'
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`} />
                      <span>{section.title}</span>
                    </div>
                    {sectionOpen > 0 && (
                      <span className="ml-1 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                        {sectionOpen}
                      </span>
                    )}
                  </button>
                )
              })}
            </nav>
            {/* Section legend */}
            <div className="px-5 py-3 border-t border-gray-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Approved</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>In Review</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span>Pending</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center — CIM Document Content */}
          <div className="flex-1 overflow-auto border-r border-gray-200">
            <div className="px-10 py-8 max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900">{currentSection.title}</h2>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    currentSection.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : currentSection.status === 'in-review'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {currentSection.status === 'approved'
                    ? 'Approved'
                    : currentSection.status === 'in-review'
                    ? 'In Review'
                    : 'Pending'}
                </span>
              </div>

              <div className="text-[13px] text-gray-600 leading-relaxed">
                {sectionContent.split('\n\n').map((para, idx) => {
                  // Render **text** blocks as bold sub-headers
                  const boldMatch = para.match(/^\*\*(.+)\*\*$/)
                  if (boldMatch) {
                    return (
                      <h3 key={idx} className="text-sm font-bold text-gray-900 mt-5 mb-2">
                        {boldMatch[1]}
                      </h3>
                    )
                  }
                  // Render inline **bold** within paragraphs
                  const parts = para.split(/\*\*(.+?)\*\*/g)
                  return (
                    <p key={idx} className="mb-4">
                      {parts.map((part, i) =>
                        i % 2 === 1
                          ? <span key={i} className="font-semibold text-gray-800">{part}</span>
                          : <span key={i}>{part}</span>
                      )}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Panel — Comments */}
          <div className="w-[360px] bg-white overflow-hidden flex flex-col flex-shrink-0">
            {/* Comments Header + Filters */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Comments</p>
                <p className="text-[11px] font-semibold text-gray-500">
                  <span className="text-red-600">{openCount}</span>
                  {' · '}
                  <span className="text-amber-600">{addressedCount}</span>
                  {' · '}
                  <span className="text-green-600">{resolvedCount}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-2.5 py-1 border border-gray-300 rounded text-gray-700 bg-white flex-1 min-w-0"
                >
                  <option value="All">All Status</option>
                  <option>Open</option>
                  <option>Addressed</option>
                  <option>Resolved</option>
                </select>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value)}
                  className="px-2.5 py-1 border border-gray-300 rounded text-gray-700 bg-white flex-1 min-w-0"
                >
                  <option value="All">All Sources</option>
                  <option>Internal</option>
                  <option>External</option>
                </select>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {filteredComments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-600">No comments match filters</p>
                </div>
              ) : (
                filteredComments.map(comment => {
                  const author = collaboratorMap[comment.authorId]
                  if (!author) return null
                  const isInternal = author.type === 'internal'
                  const statusDisplay = getStatusDisplay(comment.status)

                  return (
                    <div
                      key={comment.id}
                      className={`rounded-lg p-3 ${
                        isInternal ? 'comment-internal' : 'comment-external'
                      }`}
                    >
                      <div className="flex items-start space-x-2 mb-2">
                        <div
                          className={`${author.color} text-white w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0`}
                        >
                          {author.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                            <p className="text-xs font-semibold text-gray-900">{author.name}</p>
                            <p className="text-xs text-gray-600">{author.role}</p>
                            {author.type === 'external' && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded ml-1">
                                <Upload size={8} />
                                Imported from file
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{comment.timestamp}</p>
                        </div>
                        <div className={`priority-dot ${getPriorityDotColor(comment.priority)} flex-shrink-0`}></div>
                      </div>

                      <p className="text-sm text-gray-700 mb-2">{comment.text}</p>

                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded ${getTagColor(comment.tag)}`}>
                          {comment.tag}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${statusDisplay.borderColor} ${statusDisplay.textColor}`}>
                          {statusDisplay.label}
                        </span>
                      </div>

                      {comment.thread && comment.thread.length > 0 && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleThread(comment.id)}
                            className="text-xs text-glean-blue hover:text-blue-700 font-semibold flex items-center space-x-1"
                          >
                            {expandedThreads[comment.id] ? (
                              <>
                                <ChevronDown size={12} />
                                <span>Hide {comment.thread.length} replies</span>
                              </>
                            ) : (
                              <>
                                <ChevronRight size={12} />
                                <span>{comment.thread.length} replies</span>
                              </>
                            )}
                          </button>

                          {expandedThreads[comment.id] && (
                            <div className="mt-2 space-y-2 border-t border-gray-200 pt-2">
                              {comment.thread.map(reply => {
                                const replyAuthor = collaboratorMap[reply.authorId]
                                if (!replyAuthor) return null
                                return (
                                  <div key={reply.id} className="flex space-x-2">
                                    <div
                                      className={`${replyAuthor.color} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0`}
                                    >
                                      {replyAuthor.initials}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-gray-900">{replyAuthor.name}</p>
                                      <p className="text-xs text-gray-600 mt-0.5">{reply.text}</p>
                                      <p className="text-xs text-gray-500 mt-0.5">{reply.timestamp}</p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {comment.status === 'open' && (
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button className="text-xs text-glean-blue hover:text-blue-700 font-semibold">
                              Mark Addressed
                            </button>
                            <span className="text-gray-300">·</span>
                            <button className="text-xs text-glean-blue hover:text-blue-700 font-semibold">
                              Resolve
                            </button>
                          </div>
                          <button
                            onClick={() => setShowAIModal(true)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2 py-1 rounded transition-colors"
                          >
                            <Wand2 size={11} />
                            AI Implement
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>

            {/* AI Chat + Comment Input */}
            <div className="border-t border-gray-200 bg-gray-50">
              {/* AI Quick Actions */}
              <div className="px-4 pt-3 pb-2 flex items-center gap-1.5 flex-wrap">
                <button className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 px-2 py-1 rounded-full transition-colors">
                  <Sparkles size={10} />
                  Implement all open
                </button>
                <button className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-1 rounded-full transition-colors">
                  <Bot size={10} />
                  Summarize feedback
                </button>
                <button className="inline-flex items-center gap-1 text-[11px] font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-2 py-1 rounded-full transition-colors">
                  <CheckCircle size={10} />
                  Draft response
                </button>
              </div>
              {/* Natural Language Input */}
              <div className="px-4 pb-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ask AI to edit this section, or leave a comment..."
                      rows={2}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-glean-blue focus:border-glean-blue"
                    />
                    <div className="absolute right-2 bottom-2">
                      <Sparkles size={14} className="text-violet-400" />
                    </div>
                  </div>
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="flex items-center justify-center w-9 h-9 bg-glean-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0 transition-colors"
                  >
                    <Send size={15} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 pl-1">
                  Try: "Update the revenue figure to $283M" or "Strengthen the ARR growth language"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Implement Modal */}
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl w-[420px] overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Wand2 size={20} className="text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">AI Implement</h3>
                    <p className="text-xs text-gray-500">Powered by Glean Intelligence</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  AI will draft a revision informed by this reviewer's past preferences and the language patterns that performed best in similar CIMs.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-violet-50 rounded-lg p-3">
                    <Users size={16} className="text-violet-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Reviewer history</p>
                      <p className="text-xs text-gray-600">Learns from this person's prior comments and which edits they approved</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
                    <Sparkles size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Winning patterns</p>
                      <p className="text-xs text-gray-600">References language and positioning from top-performing CIMs in your library</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <Wand2 size={14} />
                  Generate Draft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
