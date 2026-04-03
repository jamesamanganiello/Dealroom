import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'

const steps = [
  { number: 1, label: '1. Create Deal', path: '/deals/new' },
  { number: 2, label: '2. Select References', path: '/deals/new/references' },
  { number: 3, label: '3. Generate CIM', path: '/deals/new/generate' },
  { number: 4, label: '4. Review', path: '/deals/new/review' },
  { number: 5, label: '5. Export', path: '/deals/new/export' },
]

export default function StepIndicator({ currentStep }) {
  const navigate = useNavigate()

  const handleStepClick = (stepNumber, path) => {
    if (stepNumber < currentStep) {
      navigate(path)
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const stepNumber = step.number
          const isCompleted = stepNumber < currentStep
          const isActive = stepNumber === currentStep

          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex items-center">
                <button
                  onClick={() => handleStepClick(stepNumber, step.path)}
                  disabled={!isCompleted}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all
                    ${
                      isCompleted
                        ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                        : isActive
                        ? 'bg-glean-blue text-white'
                        : 'bg-gray-200 text-gray-600'
                    }
                  `}
                >
                  {isCompleted ? <Check size={18} /> : stepNumber}
                </button>
                <span
                  className={`ml-3 text-sm font-medium ${
                    isActive
                      ? 'text-glean-blue'
                      : isCompleted
                      ? 'text-gray-700 cursor-pointer hover:text-glean-blue'
                      : 'text-gray-500'
                  }`}
                  onClick={() => handleStepClick(stepNumber, step.path)}
                  role={isCompleted ? 'button' : 'presentation'}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 ${
                    isCompleted ? 'bg-green-200' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
