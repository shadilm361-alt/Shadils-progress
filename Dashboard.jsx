import React, { useState } from 'react'
import { Plus, MoreVertical } from 'lucide-react'
import SubjectCard from './SubjectCard'
import AddSubjectModal from './AddSubjectModal'
import { useStore } from '../hooks/useStore'

export default function Dashboard({ user = {} }) {
  const { spaces, activeSpace, activeSpaceId, subjects = [], addSubject, updateProgress, addSpace, switchSpace } = useStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [showAddSpace, setShowAddSpace] = useState(false)
  const [newSpaceName, setNewSpaceName] = useState('')
  const [isSwitching, setIsSwitching] = useState(false)
  const [switchColor, setSwitchColor] = useState('#fff3e0')

  const switchColors = [
    'var(--pastel-mint)', 
    'var(--pastel-pink)', 
    'var(--pastel-lavender)', 
    'var(--pastel-blue)', 
    'var(--pastel-peach)', 
    'var(--pastel-yellow)'
  ]

  const handleLogout = () => {
    localStorage.removeItem('humble_user')
    window.location.reload()
  }

  const avatarColor = user?.avatar?.color || '#e0e0e0'

  return (
    <div className="dashboard-container fade-in">
      {/* Profile Header */}
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          className="profile-badge" 
          onClick={() => {
            setShowBottomSheet(true)
            setTimeout(() => {
              const footer = document.querySelector('.workspaces-footer')
              if(footer) footer.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 50)
          }} 
          style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }} 
          onMouseOver={e => e.currentTarget.style.transform='scale(1.02)'} 
          onMouseOut={e => e.currentTarget.style.transform='scale(1)'}
        >
          <div 
            className="avatar-mini" 
            style={{ 
              backgroundColor: avatarColor,
              boxShadow: `0 10px 20px ${avatarColor}33`,
              overflow: 'hidden'
            }}
          >
            <img 
              src={user?.avatar?.url} 
              alt="Avatar" 
              style={{ width: '100%', height: '100%' }}
            />
          </div>
          <div className="profile-info">
            <h2>{activeSpace?.name || `${user?.name || 'Your'}’s Space`}</h2>
            <p>{user?.name} • {user?.class || 'Private'}</p>
          </div>
        </div>
        
        {spaces.length < 5 && (
          <button 
            className="icon-button"
            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
            onClick={() => setShowAddSpace(true)}
          >
            <MoreVertical size={24} />
          </button>
        )}
      </header>

      {/* Vertical Grid */}
      <main className="subject-grid">
        {subjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <p>Your space is currently quiet.</p>
            <p className="subtitle">Tap the + to add your first focus.</p>
          </div>
        ) : (
          subjects.map((subject) => (
            <SubjectCard 
              key={subject.id} 
              subject={subject} 
              onUpdateProgress={updateProgress}
            />
          ))
        )}
      </main>

      {/* Workspaces List (Bottom) */}
      {spaces && spaces.length > 1 && (
        <div className="workspaces-footer" style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center', 
          paddingBottom: '80px',
          paddingTop: '20px',
          flexWrap: 'wrap'
        }}>
          {spaces.map(space => (
            <div 
              key={space.id} 
              className={`workspace-pill ${space.id === activeSpaceId ? 'active' : ''}`}
              onClick={() => {
                if (space.id !== activeSpaceId && !isSwitching) {
                  const randomColor = switchColors[Math.floor(Math.random() * switchColors.length)];
                  setSwitchColor(randomColor);
                  setIsSwitching(true);
                  
                  setTimeout(() => {
                    switchSpace(space.id);
                  }, 400); // Switch content half-way through the burst

                  setTimeout(() => {
                    setIsSwitching(false);
                  }, 800); // End animation
                }
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: space.id === activeSpaceId ? 'var(--card-bg)' : 'transparent',
                border: space.id === activeSpaceId ? '1px solid var(--border-color)' : '1px solid transparent',
                opacity: space.id === activeSpaceId ? 1 : 0.4,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                boxShadow: space.id === activeSpaceId ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {space.name}
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button className="fab" onClick={() => setModalOpen(true)}>
        <Plus size={32} strokeWidth={2.5} style={{ opacity: 0.9 }} />
      </button>

      {modalOpen && (
        <AddSubjectModal 
          onAdd={(s) => {
            addSubject(s)
            setModalOpen(false)
          }} 
          onClose={() => setModalOpen(false)} 
        />
      )}

      {showBottomSheet && (
        <div className="modal-overlay fade-in" onClick={() => setShowBottomSheet(false)} style={{ zIndex: 3000, alignItems: 'flex-end', padding: 0 }}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <h2>Manage Your Space</h2>
            <p>Do you want to step away from your space for now?</p>
            <div className="sheet-actions">
              <button className="sheet-btn primary" onClick={() => setShowBottomSheet(false)}>
                Stay & Continue
              </button>
              <button className="sheet-btn danger" onClick={handleLogout}>
                Leave & Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Workspace Modal */}
      {showAddSpace && (
        <div className="modal-overlay fade-in" onClick={() => setShowAddSpace(false)} style={{ zIndex: 3000, alignItems: 'flex-end', padding: 0 }}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Space</h2>
            <p>Give your new focus space a name.</p>
            
            <div className="input-group" style={{ marginBottom: '30px' }}>
              <input 
                type="text" 
                className="humble-input" 
                placeholder="Workspace name..." 
                value={newSpaceName}
                onChange={(e) => setNewSpaceName(e.target.value)}
                autoFocus
                style={{ width: '100%', maxWidth: '300px' }}
              />
            </div>

            <div className="sheet-actions">
              <button 
                className={`sheet-btn primary ${newSpaceName ? 'active' : ''}`}
                disabled={!newSpaceName}
                onClick={() => {
                  if (newSpaceName.trim()) {
                    addSpace(newSpaceName.trim());
                    setShowAddSpace(false);
                    setNewSpaceName('');
                  }
                }}
              >
                Create Workspace
              </button>
              <button className="sheet-btn danger" onClick={() => setShowAddSpace(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    {/* Workspace Switching Animation Overlay */}
      {isSwitching && (
        <div 
          className="workspace-switch-overlay" 
          style={{ backgroundColor: switchColor }}
        ></div>
      )}
    </div>
  )
}
