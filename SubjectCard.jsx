import React, { useState, useEffect } from 'react'
import { Calendar, ChevronRight, BarChart2, TrendingUp } from 'lucide-react'
import DailyProgress from './DailyProgress'

const pastelColors = [
  '#e0f2f1', // Mint
  '#fce4ec', // Pink
  '#f3e5f5', // Lavender
  '#e3f2fd', // Blue
  '#fff3e0', // Peach
  '#fffde7', // Yellow
]

export default function SubjectCard({ subject, onUpdateProgress }) {
  const [showProgressTracker, setShowProgressTracker] = useState(false)
  
  const today = new Date().toISOString().split('T')[0]
  const startDate = new Date(subject.startDate)
  const endDate = new Date(subject.endDate)
  const now = new Date()
  
  const isActive = now >= startDate && now <= endDate
  const isPast = now > endDate
  const isFuture = now < startDate

  const progress = subject.progress || []
  
  // Calculate average progress for result view
  const avgProgress = progress.length > 0 
    ? Math.round(progress.reduce((a, b) => a + b.value, 0) / progress.length)
    : 0

  const todayProgress = progress.find(p => p.date === today)
  const hasLoggedToday = !!todayProgress
  const latestProgressValue = todayProgress?.value || 0

  // Automated Daily Check-in
  useEffect(() => {
    if (isActive && !hasLoggedToday) {
      const timer = setTimeout(() => {
        setShowProgressTracker(true)
      }, 500) // Small delay for effect
      return () => clearTimeout(timer)
    }
  }, [isActive, hasLoggedToday])

  // Simple SVG graph path logic
  const getGraphPath = () => {
    if (progress.length < 2) return "M 0 50 L 100 50"
    const points = [...progress]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-10) // Show last 10 points
    
    return points.map((p, i) => {
      const x = (i / (points.length - 1)) * 100
      const y = 80 - (p.value * 0.6) 
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  return (
    <div 
      className={`subject-card fade-in ${isPast ? 'result-view' : !isActive ? 'inactive' : ''}`}
      style={{
        backgroundColor: subject.color || pastelColors[subject.id % pastelColors.length],
        padding: '24px',
        borderRadius: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.02)',
        cursor: isActive ? 'pointer' : 'default',
        opacity: isFuture ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => isActive && setShowProgressTracker(true)}
    >
      {isPast && (
        <div className="result-overlay">
          <TrendingUp size={48} opacity={0.1} />
        </div>
      )}

      <div className="card-header">
        <div className="title-group">
          <h3 className="card-title">{subject.name}</h3>
          <p className="card-date-range">
            {new Date(subject.startDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {new Date(subject.endDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
          </p>
        </div>
        <span className="card-badge">
          {isActive ? 'Active' : isPast ? 'Completed' : 'Upcoming'}
        </span>
      </div>

      <div className="mini-graph" style={{ margin: '15px 0', height: '60px', display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
        {[...Array(14)].map((_, i) => {
          const points = [...progress].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14)
          const dataPoint = points[points.length - 14 + i]
          const val = dataPoint ? dataPoint.value : 0
          
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px', height: '100%' }}>
              <div 
                style={{ 
                  height: `${val}%`, 
                  width: '100%', 
                  backgroundColor: '#4dd0e1', // Cyan performance color
                  borderRadius: '4px',
                  transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                }} 
              />
              <div 
                style={{ 
                  height: '20%', 
                  width: '100%', 
                  backgroundColor: 'rgba(0,0,0,0.05)', // Gray base
                  borderRadius: '2px'
                }} 
              />
            </div>
          )
        })}
      </div>

      <div className="card-footer">
        {isPast ? (
          <div className="result-stat">
            <span className="stat-label">Final Score</span>
            <span className="stat-value">{avgProgress}%</span>
          </div>
        ) : (
          <>
            <div className="date-info">
              <Calendar size={14} opacity={0.5} />
              <span>{isFuture ? 'Starts soon' : `${Math.ceil((endDate - now)/(1000*60*60*24))} days left`}</span>
            </div>
            <div className="progress-info">
              <span className="log-status">{hasLoggedToday ? `${latestProgressValue}% today` : 'Daily check-in'}</span>
              <ChevronRight size={16} opacity={0.5} />
            </div>
          </>
        )}
      </div>

      {showProgressTracker && (
        <DailyProgress 
          subject={subject}
          currentValue={latestProgressValue}
          onSave={(value) => {
            onUpdateProgress(subject.id, today, value)
            setShowProgressTracker(false)
          }}
          onClose={() => setShowProgressTracker(false)}
        />
      )}
    </div>
  )
}
