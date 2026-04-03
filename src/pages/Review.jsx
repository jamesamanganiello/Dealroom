import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, X, ArrowLeft, AlertCircle, CheckCircle, Eye } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StepIndicator from '../components/StepIndicator'
import { cimSections, intelligenceInsights } from '../mockData'
import { useDeal } from '../context/DealContext'

export default function Review() {
  const navigate = useNavigate()
  const { sectionStatuses, acceptedSections } = useDeal()
  const [comments, setComments] = useState([])
  const [expandedSection, setExpandedSection] = useState(null)
  const [showCommentForm, setShowCommentForm] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [selectedTag, setSelectedTag] = useState('Narrative Adjustment')
  const [showInsights, setShowInsights] = useState(true)
  const [reviewedSections, setReviewedSections] = useState(new Set())

  const tagOptions = [
    { label: 'Narrative Adjustment', color: 'blue' },
    { label: 'Financial Correction', color: 'red' },
    { label: 'Client Preference', color: 'purple' },
    { label: 'Positioning Change', color: 'green' },
  ]

  const handleAddComment = (section) => {
    if (newComment.trim()) {
      const selectedTagObj = tagOptions.find((t) => t.label === selectedTag)
      const newCommentObj = {
        id: comments.length + 1,
        section: section,
        text: newComment,
        tag: selectedTag,
        tagColor: selectedTagObj?.color || 'blue',
        author: 'You',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      }
      setComments([...comments, newCommentObj])
      setNewComment('')
      setShowCommentForm(null)
      setSelectedTag('Narrative Adjustment')
    }
  }

  const getTagClass = (color) => {
    switch (color) {
      case 'blue':
        return 'tag-blue'
      case 'red':
        return 'tag-red'
      case 'purple':
        return 'tag-purple'
      default:
        return 'tag-blue'
    }
  }

  const sectionComments = (sectionName) => comments.filter((c) => c.section === sectionName)

  // Determine review status for each section
  const getSectionReviewState = (section) => {
    const hasComments = sectionComments(section.title).length > 0
    const wasAccepted = acceptedSections.includes(section.id)
    const wasReviewed = reviewedSections.has(section.id)
    if (hasComments || wasAccepted || wasReviewed) return 'reviewed'
    return 'needs-review'
  }

  const handleExpandSection = (sectionId) => {
    const isExpanded = expandedSection === sectionId
    setExpandedSection(isExpanded ? null : sectionId)
    if (!isExpanded) {
      setReviewedSections(prev => new Set([...prev, sectionId]))
    }
  }

  const unreviewedCount = cimSections.filter(s => getSectionReviewState(s) === 'needs-review').length
  const reviewedCount = cimSections.length - unreviewedCount

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        <StepIndicator currentStep={4} />

        <div className="flex-1 overflow-auto">
          <div className="flex">
            <div className="flex-1 p-8">
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Feedback</h2>
                  <p className="text-gray-600 text-sm mb-4">Review each AI-generated section before exporting. Click to expand and add comments.</p>

                  {/* Review progress bar */}
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-glean-blue" />
                      <span className="text-sm font-medium text-gray-900">{reviewedCount}/{cimSections.length} reviewed</span>
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-glean-blue rounded-full transition-all duration-500"
                        style={{ width: `${(reviewedCount / cimSections.length) * 100}%` }}
                      />
                    </div>
                    {unreviewedCount > 0 && (
                      <span className="text-xs text-amber-600 font-medium">{unreviewedCount} need attention</span>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {cimSections.map((section) => {
                    const sectionCmts = sectionComments(section.title)
                    const isExpanded = expandedSection === section.id
                    const reviewState = getSectionReviewState(section)
                    const needsReview = reviewState === 'needs-review'

                    return (
                      <div
                        key={section.id}
                        className={`bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                          needsReview
                            ? 'border-amber-200'
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleExpandSection(section.id)}
                      >
                        <div className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            {needsReview ? (
                              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                                <AlertCircle size={14} className="text-amber-500" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-green-50 border border-green-200 flex items-center justify-center flex-shrink-0">
                                <CheckCircle size={14} className="text-green-500" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-base font-semibold text-gray-900">{section.title}</h3>
                              <div className="flex items-center gap-3 mt-0.5">
                                {sectionCmts.length > 0 && (
                                  <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <MessageSquare size={12} />
                                    {sectionCmts.length} comment{sectionCmts.length !== 1 ? 's' : ''}
                                  </p>
                                )}
                                {acceptedSections.includes(section.id) && (
                                  <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Accepted in Editor</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {needsReview ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                <AlertCircle size={11} />
                                Needs Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                                <CheckCircle size={11} />
                                Reviewed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Alert banner for unreviewed sections */}
                        {needsReview && !isExpanded && (
                          <div className="px-5 pb-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
                              <AlertCircle size={13} className="text-amber-500 flex-shrink-0" />
                              <p className="text-xs text-amber-700">
                                This AI-generated section has not been reviewed by a human. Click to review before exporting.
                              </p>
                            </div>
                          </div>
                        )}

                        {isExpanded && (
                          <div className="bg-gray-50 border-t border-gray-200 p-6 animate-slide-in">
                            <div className="mb-6">
                              <h4 className="text-sm font-bold text-gray-900 uppercase mb-4">Comments & Feedback</h4>
                              {sectionCmts.length > 0 ? (
                                <div className="space-y-4">
                                  {sectionCmts.map((comment) => (
                                    <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-4">
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <span className={`tag ${getTagClass(comment.tagColor)}`}>
                                            {comment.tag}
                                          </span>
                                          <span className="text-xs text-gray-600">{comment.date}</span>
                                        </div>
                                        <span className="text-xs font-medium text-gray-700">{comment.author}</span>
                                      </div>
                                      <p className="text-gray-700 text-sm">{comment.text}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 py-4 px-3 bg-gray-100 rounded-lg">
                                  <MessageSquare size={14} className="text-gray-400" />
                                  <p className="text-sm text-gray-500">No comments yet — add feedback below or mark as reviewed.</p>
                                </div>
                              )}
                            </div>

                            {showCommentForm === section.id ? (
                              <div className="bg-white rounded-lg border border-gray-200 p-4">
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') handleAddComment(section.title)
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue text-sm mb-3"
                                  autoFocus
                                />
                                <div className="mb-3">
                                  <p className="text-xs font-medium text-gray-700 mb-2">Tag</p>
                                  <div className="flex flex-wrap gap-2">
                                    {tagOptions.map((tag) => (
                                      <button
                                        key={tag.label}
                                        onClick={(e) => { e.stopPropagation(); setSelectedTag(tag.label) }}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                          selectedTag === tag.label
                                            ? `bg-${tag.color}-500 text-white`
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                      >
                                        {tag.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleAddComment(section.title) }}
                                    className="flex-1 bg-glean-blue text-white py-2 rounded-lg font-medium text-sm hover:bg-blue-700 active:scale-95"
                                  >
                                    Add Comment
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setShowCommentForm(null)
                                      setNewComment('')
                                      setSelectedTag('Narrative Adjustment')
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setShowCommentForm(section.id)
                                }}
                                className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-glean-blue hover:text-glean-blue transition-colors text-sm font-medium"
                              >
                                + Add Comment
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center space-x-4 mt-8">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
                  >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => navigate('/deals/new/export')}
                    className="flex-1 bg-glean-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95"
                  >
                    Continue to Export →
                  </button>
                </div>
              </div>
            </div>

            <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto flex-shrink-0">
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="w-full flex items-center justify-between mb-6"
              >
                <h3 className="text-sm font-bold text-gray-900 uppercase">Intelligence Being Captured</h3>
                <span className="text-gray-600">{showInsights ? '−' : '+'}</span>
              </button>

              {showInsights && (
                <div className="space-y-4">
                  {intelligenceInsights.slice(0, 6).map((insight, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-700 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-slide-in"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <p className="font-medium text-glean-blue mb-1">Insight #{idx + 1}</p>
                      {insight}
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 mt-4 pt-4 border-t border-gray-200">
                    This intelligence improves future CIM generation for all Meridian Partners deal teams.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
