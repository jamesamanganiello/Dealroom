import React, { createContext, useContext, useState } from 'react'

const DealContext = createContext()

export function DealProvider({ children }) {
  const [dealData, setDealData] = useState({
    company: 'NovaCare Diagnostics',
    industry: 'Healthcare Services',
    dealSize: '$340M',
    transactionType: 'Sell-Side M&A',
    // AI-extracted from uploaded documents
    revenue: '$340M',
    ebitda: '$68M',
    ebitdaMargin: '20.0%',
    growth3Y: 8.5,
    evEbitda: null, // Estimated after valuation analysis
    employees: 1200,
    founded: 2011,
    headquarters: 'Nashville, TN',
  })

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [selectedReferences, setSelectedReferences] = useState([1, 2, 3])
  const [sectionStatuses, setSectionStatuses] = useState({
    1: 'generated',
    2: 'generated',
    3: 'generated',
    4: 'in-review',
    5: 'pending',
    6: 'pending',
    7: 'pending',
    8: 'pending',
  })
  const [acceptedSections, setAcceptedSections] = useState([])
  const [comments, setComments] = useState([])

  const updateDealData = (data) => {
    setDealData((prev) => ({ ...prev, ...data }))
  }

  const updateSectionStatus = (sectionId, status) => {
    setSectionStatuses((prev) => ({ ...prev, [sectionId]: status }))
  }

  const acceptSection = (sectionId) => {
    setAcceptedSections((prev) => [...new Set([...prev, sectionId])])
    updateSectionStatus(sectionId, 'accepted')
  }

  const addComment = (comment) => {
    setComments((prev) => [...prev, comment])
  }

  const value = {
    dealData,
    updateDealData,
    uploadedFiles,
    setUploadedFiles,
    selectedReferences,
    setSelectedReferences,
    sectionStatuses,
    updateSectionStatus,
    acceptedSections,
    acceptSection,
    comments,
    addComment,
  }

  return <DealContext.Provider value={value}>{children}</DealContext.Provider>
}

export function useDeal() {
  const context = useContext(DealContext)
  if (!context) {
    throw new Error('useDeal must be used within a DealProvider')
  }
  return context
}
