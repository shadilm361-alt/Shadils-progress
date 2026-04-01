import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { X, ArrowRight, Check, Calendar } from 'lucide-react'

const pastelColors = [
  '#e0f2f1', '#fce4ec', '#f3e5f5', '#e3f2fd', '#fff3e0', '#fffde7'
]

export default function AddSubjectModal({ onAdd, onClose }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')

  const handleCreate = () => {
    // Pick a random pastel for the subject automatically
    const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)]
    onAdd({ 
      name, 
      startDate, 
      endDate: endDate || startDate, 
      color: randomColor 
    })
  }

  const modalContent = (
    <div className="modal-overlay fade-in" onClick={onClose} style={{ zIndex: 1100 }}>
      <div className="modal-content onboarding-step" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        {step === 1 ? (
          <>
            <h1 className="modal-title onboarding-title">New Focus</h1>
            <p className="onboarding-subtitle">What's the subject?</p>
            <div className="input-group">
              <input 
                type="text" 
                className="humble-input" 
                placeholder="e.g. Physics, Art, Meditating" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <button 
              className={`next-button ${name ? 'active' : ''}`}
              onClick={() => setStep(2)}
              disabled={!name}
            >
              <ArrowRight size={24} />
            </button>
          </>
        ) : step === 2 ? (
          <>
            <h1 className="modal-title onboarding-title">New Focus</h1>
            <p className="onboarding-subtitle">When does it start?</p>
            <div className="input-group">
              <input 
                type="date" 
                className="humble-input" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <button 
              className="next-button active"
              onClick={() => setStep(3)}
            >
              <ArrowRight size={24} />
            </button>
          </>
        ) : (
          <>
            <h1 className="modal-title onboarding-title">New Focus</h1>
            <p className="onboarding-subtitle">When does it end?</p>
            <div className="input-group">
              <input 
                type="date" 
                className="humble-input" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                autoFocus
              />
            </div>
            <button 
              className={`next-button ${endDate ? 'active' : ''}`}
              onClick={handleCreate}
              disabled={!endDate}
            >
              <Check size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  )

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return modalContent

  return ReactDOM.createPortal(modalContent, modalRoot)
}
