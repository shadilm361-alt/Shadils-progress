import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { X, Check } from 'lucide-react'


export default function DailyProgress({ subject, currentValue, onSave, onClose }) {
  const [value, setValue] = useState(currentValue || 50)
  
  const savedUser = JSON.parse(localStorage.getItem('humble_user') || '{}')
  const userAvatar = savedUser.avatar || { 
    color: '#e0f2f1', 
    url: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Lucky&backgroundColor=fdfcf0' 
  }

  const getStatusLabel = () => {
    if (value > 80) return "Feeling Best"
    if (value > 60) return "Normal / Good"
    if (value > 40) return "Okay"
    if (value > 20) return "A bit down"
    return "Not so good"
  }

  const getStatusIcon = () => {
    return (
      <div 
        className="status-avatar-container"
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '32px',
          backgroundColor: userAvatar.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `scale(${1 + (value / 500)})`,
          boxShadow: `0 15px 30px ${userAvatar.color}66`,
          overflow: 'hidden'
        }}
      >
        <img 
          src={userAvatar.url} 
          alt="Avatar" 
          style={{ width: '80%', height: '80%', borderRadius: '20px' }}
        />
      </div>
    )
  }

  const modalContent = (
    <div className="modal-overlay fade-in" onClick={onClose} style={{ zIndex: 2000 }}>
      <div 
        className="modal-content slider-modal" 
        onClick={e => e.stopPropagation()} 
        style={{ 
          backgroundColor: subject.color || '#fff',
          padding: '34px 28px',
          borderRadius: '36px',
          maxWidth: '340px',
          textAlign: 'center'
        }}
      >
        <button className="close-btn" onClick={onClose}><X size={18} /></button>
        
        <div className="progress-header" style={{ marginBottom: '24px' }}>
          <p className="subject-label" style={{ opacity: 0.4, fontSize: '0.7rem', letterSpacing: '0.12em', fontWeight: 600, textTransform: 'uppercase' }}>{subject.name}</p>
          <h2 className="progress-title" style={{ fontSize: '1.5rem', marginTop: '4px', fontWeight: 600 }}>How was today?</h2>
        </div>

        <div className="interactive-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginBottom: '28px' }}>
          <div className="status-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <div 
              className="status-avatar-squircle"
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', // Organic squircle
                backgroundColor: 'rgba(255,255,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                transform: `scale(${1 + (value / 600)}) rotate(${value / 10}deg)`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                padding: '10px'
              }}
            >
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: userAvatar.color, 
                  borderRadius: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={userAvatar.url} 
                  alt="Avatar" 
                  style={{ width: '85%', height: '85%' }}
                />
              </div>
            </div>
            <p className="status-text" style={{ fontSize: '1.1rem', fontWeight: 500, color: 'rgba(0,0,0,0.5)' }}>{getStatusLabel()}</p>
          </div>

          <div className="vertical-slider-container" style={{ position: 'relative', height: '180px', width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div className="slider-track" style={{ height: '100%', width: '12px', background: 'rgba(0,0,0,0.06)', borderRadius: '10px', position: 'relative' }}>
              <div 
                className="slider-fill" 
                style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${value}%`, background: 'rgba(0,0,0,0.1)', borderRadius: '0 0 10px 10px' }}
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="vertical-range"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '50%',
                  width: '180px',
                  height: '40px',
                  transform: 'rotate(-90deg) translate(-180px, -20px)',
                  transformOrigin: 'top left',
                  cursor: 'pointer',
                  opacity: 0,
                  zIndex: 10
                }}
              />
              <div 
                className="slider-handle"
                style={{ 
                  position: 'absolute', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  bottom: `calc(${value}% - 12px)`, 
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: '#fff', 
                  borderRadius: '50%', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  zIndex: 5,
                  pointerEvents: 'none'
                }}
              >
                <div className="handle-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.1)' }} />
              </div>
            </div>
            
            <div className="slider-labels" style={{ position: 'absolute', left: 'calc(50% + 24px)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <span>Best</span>
              <span>Medium</span>
              <span>Normal</span>
            </div>
          </div>
        </div>

        <button 
          className="save-progress-btn"
          onClick={() => onSave(value)}
          style={{ 
            width: '100%', 
            padding: '15px', 
            borderRadius: '22px', 
            backgroundColor: '#3c4043', 
            color: '#fff', 
            fontSize: '1rem', 
            fontWeight: 500, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '10px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Check size={18} />
          Proceed
        </button>
      </div>
    </div>
  )

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return modalContent // Fallback to inline if root missing

  return ReactDOM.createPortal(modalContent, modalRoot)
}
