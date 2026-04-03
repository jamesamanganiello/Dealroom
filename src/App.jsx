import React, { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ActiveDeals from './pages/ActiveDeals'
import DataIngestion from './pages/DataIngestion'
import ReferenceLibrary from './pages/ReferenceLibrary'
import CIMGeneration from './pages/CIMGeneration'
import Review from './pages/Review'
import Export from './pages/Export'
import Library from './pages/Library'
import Insights from './pages/Insights'
import CIMReview from './pages/CIMReview'
// Activity page removed — collaboration now lives in Dashboard deal-centric view
import Compliance from './pages/Compliance'
import DealSourcing from './pages/DealSourcing'
import { DealProvider } from './context/DealContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <ActiveDeals />,
  },
  {
    path: '/deals',
    element: <ActiveDeals />,
  },
  {
    path: '/deals/new',
    element: <DataIngestion />,
  },
  {
    path: '/deals/new/references',
    element: <ReferenceLibrary />,
  },
  {
    path: '/deals/new/generate',
    element: <CIMGeneration />,
  },
  {
    path: '/deals/new/review',
    element: <Review />,
  },
  {
    path: '/deals/new/export',
    element: <Export />,
  },
  {
    path: '/deals/:id/review',
    element: <CIMReview />,
  },
  {
    path: '/library',
    element: <Library />,
  },
  {
    path: '/insights',
    element: <Insights />,
  },
  {
    path: '/compliance',
    element: <Compliance />,
  },
  {
    path: '/sourcing',
    element: <DealSourcing />,
  },
])

export default function App() {
  return (
    <DealProvider>
      <RouterProvider router={router} />
    </DealProvider>
  )
}
