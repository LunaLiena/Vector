import React from 'react'
import './CustomStepper.css'

type StepStatus = 'waiting' | 'in-progress' | 'completed' | 'error' | 'paused'

interface Step {
  title: string
  status: StepStatus
}

interface CustomStepperProps {
  steps: Step[]
  separator?: string
}

export const CustomStepper: React.FC<CustomStepperProps> = ({ steps, separator = '>' }) => {
  return (
    <div className="custom-stepper">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className={`step ${step.status}`}>
            <div className="step-circle"></div>
            <div className="step-title">{step.title}</div>
          </div>
          {index < steps.length - 1 && <div className="separator">{separator}</div>}
        </React.Fragment>
      ))}
    </div>
  )
}
