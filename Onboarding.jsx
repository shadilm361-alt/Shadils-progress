import React, { useState } from 'react'
import AvatarPicker from './AvatarPicker'
import { ArrowRight, Check } from 'lucide-react'

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [userClass, setUserClass] = useState('')
  const [spaceName, setSpaceName] = useState('')
  const [avatar, setAvatar] = useState(null)

  const handleNext = () => {
    if (step === 1 && name) {
      setStep(2)
    } else if (step === 2 && userClass) {
      setStep(3)
    } else if (step === 3 && spaceName) {
      setStep(4)
    } else if (step === 4 && avatar) {
      // Initialize the first space
      const newSpaceId = Date.now().toString()
      const initialSpace = { id: newSpaceId, name: spaceName, subjects: [] }
      localStorage.setItem('humble_spaces', JSON.stringify([initialSpace]))
      localStorage.setItem('humble_active_space', newSpaceId)
      
      onComplete({ name, class: userClass, avatar })
    }
  }

  return (
    <div className="onboarding-container fade-in">
      {step === 1 ? (
        <div key="step-1" className="onboarding-step fade-in-up">
          <h1 className="onboarding-title">Welcome.</h1>
          <p className="onboarding-subtitle">Choose a name for your private space.</p>
          
          <div className="input-group">
            <input 
              type="text" 
              className="humble-input" 
              placeholder="Your username..." 
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <button 
            className={`next-button ${name ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!name}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      ) : step === 2 ? (
        <div key="step-2" className="onboarding-step fade-in-up">
          <h1 className="onboarding-title">Welcome.</h1>
          <p className="onboarding-subtitle">Which class or grade are you in?</p>
          
          <div className="input-group">
            <input 
              type="text" 
              className="humble-input" 
              placeholder="Your class / grade..." 
              value={userClass}
              onChange={(e) => setUserClass(e.target.value)}
              autoFocus
            />
          </div>

          <button 
            className={`next-button ${userClass ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!userClass}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      ) : step === 3 ? (
        <div key="step-3" className="onboarding-step fade-in-up">
          <h1 className="onboarding-title">Hi, {name}.</h1>
          <p className="onboarding-subtitle">Name your first workspace.</p>
          
          <div className="input-group" style={{ marginBottom: '1.5rem', width: '100%' }}>
            <input 
              type="text" 
              className="humble-input" 
              placeholder="Workspace Name (e.g., Study Space)" 
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              autoFocus
            />
          </div>

          <button 
            className={`next-button ${spaceName ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!spaceName}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      ) : (
        <div key="step-4" className="onboarding-step fade-in-up">
          <h1 className="onboarding-title">Almost there.</h1>
          <p className="onboarding-subtitle">Pick a soul avatar.</p>

          <AvatarPicker 
            onSelect={(a) => setAvatar(a)} 
            selectedId={avatar?.id} 
          />

          <button 
            className={`next-button ${avatar ? 'active' : ''}`}
            onClick={handleNext}
            disabled={!avatar}
          >
            <Check size={24} />
          </button>
        </div>
      )}
    </div>
  )
}
