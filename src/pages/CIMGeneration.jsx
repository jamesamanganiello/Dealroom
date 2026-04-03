import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, Circle, RefreshCw, ArrowLeft, Lightbulb, MessageSquare,
  Pencil, Flag, X, Sparkles, Brain, ChevronDown, ChevronUp
} from 'lucide-react'
import Sidebar from '../components/Sidebar'
import StepIndicator from '../components/StepIndicator'
import { cimSections, sectionContentMap, sectionCitationsMap } from '../mockData'
import { useDeal } from '../context/DealContext'

// Annotation tag options
const annotationTags = [
  { label: 'Tone Adjustment', color: 'blue', icon: '🎯' },
  { label: 'Factual Correction', color: 'red', icon: '📊' },
  { label: 'Client Preference', color: 'purple', icon: '👤' },
  { label: 'Positioning Change', color: 'green', icon: '🔄' },
]

// Mock learning confirmations mapped to tags
const learningMessages = {
  'Tone Adjustment': [
    'Saving tone preference for future Healthcare CIMs',
    'Updating narrative style for Sell-Side M&A templates',
  ],
  'Factual Correction': [
    'Correcting reference data — updating deal intelligence',
    'Flagging for data quality review across similar CIMs',
  ],
  'Client Preference': [
    'Recording as Meridian Partners firm-wide preference',
    'Applying to all future diagnostics sector CIMs',
  ],
  'Positioning Change': [
    'Adjusting positioning framework for comparable deals',
    'Updating competitive narrative templates',
  ],
}

// Pre-seeded annotations for demo purposes
const demoAnnotations = {
  4: [
    {
      id: 'demo-1',
      selectedText: 'Market-Leading Position in Specialized Diagnostics',
      note: 'Tone down — say "strong position" not "market-leading" until we have third-party validation',
      tag: 'Client Preference',
      tagColor: 'purple',
      timestamp: '2 min ago',
    },
  ],
}

export default function CIMGeneration() {
  const navigate = useNavigate()
  const { dealData, sectionStatuses, updateSectionStatus, acceptSection } = useDeal()
  const [selectedSection, setSelectedSection] = useState(4)
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [regeneratePrompt, setRegeneratePrompt] = useState('')
  const [localStatuses, setLocalStatuses] = useState(sectionStatuses)

  // Annotation state
  const [annotations, setAnnotations] = useState(demoAnnotations)
  const [showAnnotationToolbar, setShowAnnotationToolbar] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [currentSelection, setCurrentSelection] = useState('')
  const [showAnnotationForm, setShowAnnotationForm] = useState(false)
  const [annotationNote, setAnnotationNote] = useState('')
  const [annotationTag, setAnnotationTag] = useState('Tone Adjustment')
  const contentRef = useRef(null)

  // Intelligence / learning state
  const [capturedInsights, setCapturedInsights] = useState([
    { text: 'Healthcare services ($300-500M): recurring revenue emphasis preferred in Investment Highlights', type: 'pattern', time: '5 min ago' },
    { text: 'Diagnostic testing: molecular/genomic positioning preferred over general lab framing', type: 'pattern', time: '3 min ago' },
  ])
  const [learningToast, setLearningToast] = useState(null)
  const [showInsightsPanel, setShowInsightsPanel] = useState(true)

  // Right panel tab state
  const [rightPanelTab, setRightPanelTab] = useState('intelligence') // 'citations' | 'intelligence'

  useEffect(() => {
    setLocalStatuses(sectionStatuses)
  }, [sectionStatuses])

  useEffect(() => {
    const content = sectionContentMap[selectedSection]
    if (content && (localStatuses[selectedSection] === 'pending' || localStatuses[selectedSection] === 'in-review')) {
      setIsTyping(true)
      setDisplayedContent('')
      let currentIndex = 0
      const interval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedContent(content.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(interval)
        }
      }, 2)
      return () => clearInterval(interval)
    } else if (content) {
      setDisplayedContent(content)
      setIsTyping(false)
    }
  }, [selectedSection, localStatuses])

  // Text selection handler
  const handleTextSelect = useCallback(() => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    if (text && text.length > 3 && contentRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const containerRect = contentRef.current.getBoundingClientRect()
      setToolbarPosition({
        top: rect.top - containerRect.top - 48,
        left: rect.left - containerRect.left + rect.width / 2 - 80,
      })
      setCurrentSelection(text)
      setShowAnnotationToolbar(true)
    } else {
      // Small delay to allow button clicks to register
      setTimeout(() => {
        if (!showAnnotationForm) {
          setShowAnnotationToolbar(false)
        }
      }, 200)
    }
  }, [showAnnotationForm])

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelect)
    return () => document.removeEventListener('mouseup', handleTextSelect)
  }, [handleTextSelect])

  // Show learning toast
  const showLearningConfirmation = (tag) => {
    const messages = learningMessages[tag] || learningMessages['Tone Adjustment']
    const msg = messages[Math.floor(Math.random() * messages.length)]
    setLearningToast({ tag, message: msg })
    setTimeout(() => setLearningToast(null), 4000)
  }

  // Add annotation
  const handleAddAnnotation = () => {
    if (!currentSelection || !annotationNote.trim()) return
    const tagObj = annotationTags.find(t => t.label === annotationTag)
    const newAnnotation = {
      id: `ann-${Date.now()}`,
      selectedText: currentSelection.substring(0, 80) + (currentSelection.length > 80 ? '...' : ''),
      note: annotationNote,
      tag: annotationTag,
      tagColor: tagObj?.color || 'blue',
      timestamp: 'Just now',
    }
    setAnnotations(prev => ({
      ...prev,
      [selectedSection]: [...(prev[selectedSection] || []), newAnnotation],
    }))

    // Add to captured insights
    setCapturedInsights(prev => [{
      text: `${tagObj?.icon || '📝'} ${annotationTag}: "${annotationNote}"`,
      type: 'annotation',
      time: 'Just now',
    }, ...prev])

    showLearningConfirmation(annotationTag)

    // Reset
    setAnnotationNote('')
    setAnnotationTag('Tone Adjustment')
    setShowAnnotationForm(false)
    setShowAnnotationToolbar(false)
    window.getSelection()?.removeAllRanges()
  }

  // Handle regenerate with learning
  const handleRegenerate = () => {
    if (regeneratePrompt.trim()) {
      // Classify the feedback
      let detectedTag = 'Tone Adjustment'
      const prompt = regeneratePrompt.toLowerCase()
      if (prompt.includes('number') || prompt.includes('data') || prompt.includes('correct') || prompt.includes('wrong') || prompt.includes('inaccurate')) {
        detectedTag = 'Factual Correction'
      } else if (prompt.includes('client') || prompt.includes('prefer') || prompt.includes('partner') || prompt.includes('firm')) {
        detectedTag = 'Client Preference'
      } else if (prompt.includes('position') || prompt.includes('compet') || prompt.includes('differentiat') || prompt.includes('market')) {
        detectedTag = 'Positioning Change'
      }

      setCapturedInsights(prev => [{
        text: `Regeneration: "${regeneratePrompt}"`,
        type: 'regeneration',
        time: 'Just now',
      }, ...prev])

      showLearningConfirmation(detectedTag)
      setRegeneratePrompt('')
    }

    setDisplayedContent('')
    setIsTyping(true)
    const content = sectionContentMap[selectedSection]
    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        setDisplayedContent(content.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 2)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'generated':
      case 'accepted':
        return <CheckCircle size={20} className="text-green-600" />
      case 'in-review':
        return <Circle size={20} className="text-blue-600 fill-blue-100" />
      case 'pending':
        return <Circle size={20} className="text-gray-300" />
      default:
        return null
    }
  }

  const getGeneratedCount = () => {
    return Object.values(localStatuses).filter((s) => s === 'generated' || s === 'accepted').length
  }

  const handleSectionClick = (sectionId) => {
    setSelectedSection(sectionId)
    setShowAnnotationToolbar(false)
    setShowAnnotationForm(false)
    if (localStatuses[sectionId] === 'pending') {
      const newStatuses = { ...localStatuses, [sectionId]: 'in-review' }
      setLocalStatuses(newStatuses)
      updateSectionStatus(sectionId, 'in-review')
    }
  }

  const handleAcceptSection = () => {
    acceptSection(selectedSection)
    const newStatuses = { ...localStatuses, [selectedSection]: 'accepted' }
    setLocalStatuses(newStatuses)

    const sectionAnnotations = annotations[selectedSection] || []
    if (sectionAnnotations.length > 0) {
      setCapturedInsights(prev => [{
        text: `Section accepted with ${sectionAnnotations.length} annotation${sectionAnnotations.length !== 1 ? 's' : ''} — training future generation`,
        type: 'accepted',
        time: 'Just now',
      }, ...prev])
    }

    const nextPendingSection = cimSections.find((s) => newStatuses[s.id] === 'pending')
    if (nextPendingSection) {
      handleSectionClick(nextPendingSection.id)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const removeAnnotation = (annId) => {
    setAnnotations(prev => ({
      ...prev,
      [selectedSection]: (prev[selectedSection] || []).filter(a => a.id !== annId),
    }))
  }

  const citations = sectionCitationsMap[selectedSection] || []
  const sectionAnnotations = annotations[selectedSection] || []

  const getTagColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'red': return 'bg-red-50 text-red-700 border-red-200'
      case 'purple': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'green': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto flex flex-col">
        <StepIndicator currentStep={3} />

        <div className="flex-1 overflow-auto">
          <div className="flex">
            {/* Left: Section Nav */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto flex-shrink-0">
              <h3 className="text-sm font-bold text-gray-900 uppercase mb-6">CIM Sections</h3>
              <div className="space-y-2">
                {cimSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                      selectedSection === section.id
                        ? 'bg-glean-light text-glean-blue font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    } section-item-hover`}
                  >
                    {getStatusIcon(localStatuses[section.id])}
                    <span className="flex-1 text-sm">{section.title}</span>
                    {(annotations[section.id] || []).length > 0 && (
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center justify-center">
                        {annotations[section.id].length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-medium mb-2">PROGRESS</p>
                <p className="text-2xl font-bold text-glean-blue">{getGeneratedCount()} of {cimSections.length}</p>
                <p className="text-xs text-gray-600 mt-1">sections generated</p>
              </div>
            </div>

            {/* Center: Content */}
            <div className="flex-1 p-8 min-w-0">
              <div className="max-w-4xl">
                {/* Section title + annotation count badge */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {cimSections.find(s => s.id === selectedSection)?.title}
                  </h2>
                  {!isTyping && sectionAnnotations.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium">
                      <MessageSquare size={12} />
                      {sectionAnnotations.length} annotation{sectionAnnotations.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Hint bar */}
                {!isTyping && (localStatuses[selectedSection] === 'in-review' || localStatuses[selectedSection] === 'pending') && (
                  <div className="flex items-center gap-2 mb-4 px-4 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                    <Lightbulb size={14} className="text-blue-500 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">Tip:</span> Highlight any text to add inline annotations. Your feedback trains future CIM generation.
                    </p>
                  </div>
                )}

                {/* Content area with selection support */}
                <div className="relative" ref={contentRef}>
                  <div className="bg-white rounded-lg border border-gray-200 p-8 mb-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap select-text cursor-text">
                        {displayedContent}
                        {isTyping && <span className="animate-pulse">|</span>}
                      </p>
                    </div>
                  </div>

                  {/* Floating annotation toolbar */}
                  {showAnnotationToolbar && !showAnnotationForm && !isTyping && (
                    <div
                      className="absolute z-30 flex items-center gap-1 bg-gray-900 text-white rounded-lg shadow-xl px-2 py-1.5 animate-fade-in"
                      style={{ top: toolbarPosition.top, left: Math.max(0, toolbarPosition.left) }}
                    >
                      <button
                        onClick={() => setShowAnnotationForm(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors text-xs font-medium"
                      >
                        <Pencil size={12} />
                        Annotate
                      </button>
                      <div className="w-px h-5 bg-gray-600" />
                      <button
                        onClick={() => {
                          setAnnotationTag('Factual Correction')
                          setShowAnnotationForm(true)
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors text-xs font-medium"
                      >
                        <Flag size={12} />
                        Flag
                      </button>
                      <div className="w-px h-5 bg-gray-600" />
                      <button
                        onClick={() => {
                          setShowAnnotationToolbar(false)
                          window.getSelection()?.removeAllRanges()
                        }}
                        className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Annotation form (appears below toolbar) */}
                  {showAnnotationForm && (
                    <div
                      className="absolute z-30 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 w-96 animate-fade-in"
                      style={{ top: toolbarPosition.top + 44, left: Math.max(0, Math.min(toolbarPosition.left - 60, 400)) }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-gray-900">Add Annotation</h4>
                        <button
                          onClick={() => { setShowAnnotationForm(false); setShowAnnotationToolbar(false); setAnnotationNote('') }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X size={14} className="text-gray-400" />
                        </button>
                      </div>

                      <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                        <p className="text-xs text-gray-600 italic line-clamp-2">
                          "{currentSelection.substring(0, 120)}{currentSelection.length > 120 ? '...' : ''}"
                        </p>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                        <div className="flex flex-wrap gap-1.5">
                          {annotationTags.map(tag => (
                            <button
                              key={tag.label}
                              onClick={() => setAnnotationTag(tag.label)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                                annotationTag === tag.label
                                  ? getTagColorClasses(tag.color) + ' ring-1 ring-offset-1 ring-current'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {tag.icon} {tag.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Your feedback</label>
                        <textarea
                          value={annotationNote}
                          onChange={(e) => setAnnotationNote(e.target.value)}
                          placeholder="What should change and why..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-glean-blue resize-none"
                          autoFocus
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleAddAnnotation}
                          disabled={!annotationNote.trim()}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-glean-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          <Sparkles size={14} />
                          Save & Learn
                        </button>
                        <button
                          onClick={() => { setShowAnnotationForm(false); setShowAnnotationToolbar(false); setAnnotationNote('') }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Inline annotations list */}
                {sectionAnnotations.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {sectionAnnotations.map((ann) => (
                      <div
                        key={ann.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${getTagColorClasses(ann.tagColor)} bg-opacity-50`}
                      >
                        <MessageSquare size={14} className="mt-0.5 flex-shrink-0 opacity-60" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wide opacity-70`}>{ann.tag}</span>
                            <span className="text-[10px] opacity-50">·</span>
                            <span className="text-[10px] opacity-50">{ann.timestamp}</span>
                          </div>
                          <p className="text-xs font-medium opacity-80 italic mb-0.5">"{ann.selectedText}"</p>
                          <p className="text-xs opacity-90">{ann.note}</p>
                        </div>
                        <button
                          onClick={() => removeAnnotation(ann.id)}
                          className="p-1 rounded hover:bg-white hover:bg-opacity-50 opacity-40 hover:opacity-100 transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Regeneration + Accept/Reject */}
                {(localStatuses[selectedSection] === 'in-review' || localStatuses[selectedSection] === 'pending') && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Regeneration Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., 'make growth narrative more aggressive' — AI will classify and learn"
                          value={regeneratePrompt}
                          onChange={(e) => setRegeneratePrompt(e.target.value)}
                          onKeyPress={(e) => { if (e.key === 'Enter' && regeneratePrompt.trim()) handleRegenerate() }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-glean-blue"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={handleAcceptSection}
                          className="flex-1 flex items-center justify-center space-x-2 bg-glean-blue text-white py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95"
                        >
                          <CheckCircle size={18} />
                          <span>Accept Section</span>
                        </button>
                        <button
                          onClick={handleRegenerate}
                          className="flex-1 flex items-center justify-center space-x-2 border border-glean-blue text-glean-blue py-2 rounded-lg font-medium hover:bg-glean-light active:scale-95"
                        >
                          <RefreshCw size={18} />
                          <span>Regenerate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 active:scale-95"
                  >
                    <ArrowLeft size={18} />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => navigate('/deals/new/review')}
                    className="flex-1 bg-glean-blue text-white py-3 rounded-lg font-medium hover:bg-blue-700 active:scale-95"
                  >
                    Continue to Review →
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel: Tabbed Citations / Intelligence */}
            <div className="w-80 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
              {/* Tab headers */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setRightPanelTab('intelligence')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    rightPanelTab === 'intelligence'
                      ? 'text-glean-blue border-b-2 border-glean-blue bg-blue-50 bg-opacity-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Brain size={13} />
                  Intelligence
                  {capturedInsights.length > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-glean-blue text-white text-[10px] font-bold flex items-center justify-center">
                      {capturedInsights.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setRightPanelTab('citations')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    rightPanelTab === 'citations'
                      ? 'text-glean-blue border-b-2 border-glean-blue bg-blue-50 bg-opacity-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Source Citations
                </button>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-5">
                {rightPanelTab === 'intelligence' ? (
                  <div className="space-y-3">
                    <p className="text-[11px] text-gray-500 uppercase font-semibold tracking-wide mb-3">
                      Learning from your feedback
                    </p>
                    {capturedInsights.map((insight, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-3 rounded-lg border animate-slide-in ${
                          insight.type === 'annotation'
                            ? 'bg-amber-50 border-amber-200 text-amber-800'
                            : insight.type === 'regeneration'
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : insight.type === 'accepted'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200 text-gray-700'
                        }`}
                        style={{ animationDelay: `${idx * 30}ms` }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[10px] uppercase tracking-wide opacity-70">
                            {insight.type === 'annotation' ? 'Annotation' : insight.type === 'regeneration' ? 'Regeneration' : insight.type === 'accepted' ? 'Accepted' : 'Pattern'}
                          </span>
                          <span className="text-[10px] opacity-50">{insight.time}</span>
                        </div>
                        <p className="leading-relaxed">{insight.text}</p>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        This intelligence improves future CIM generation for all Meridian Partners deal teams.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {citations.map((citation, idx) => (
                      <div key={idx} className="text-xs text-gray-700 p-3 bg-gray-50 rounded-lg">
                        {citation}
                      </div>
                    ))}
                    {citations.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-8">No citations for this section</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Learning toast */}
        {learningToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
            <div className="flex items-start gap-3 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Brain size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">Intelligence Captured</p>
                <p className="text-xs text-gray-600 leading-relaxed">{learningToast.message}</p>
                <div className="mt-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${getTagColorClasses(
                    annotationTags.find(t => t.label === learningToast.tag)?.color || 'blue'
                  )}`}>
                    {learningToast.tag}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setLearningToast(null)}
                className="p-1 hover:bg-gray-100 rounded opacity-40 hover:opacity-100"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
