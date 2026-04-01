import React from 'react'

const seeds = ['Snuggles', 'Angel', 'Zoe', 'Cuddles', 'Lucky', 'Patches', 'Max', 'Shadow']
const colors = ['#e0f2f1', '#fce4ec', '#f3e5f5', '#e3f2fd', '#fff3e0', '#fffde7', '#f1f8e9', '#efebe9']

const avatars = seeds.map((seed, i) => ({
  id: i + 1,
  url: `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}&backgroundColor=fdfcf0`,
  color: colors[i % colors.length]
}))

export default function AvatarPicker({ onSelect, selectedId }) {
  return (
    <div className="avatar-grid fade-in">
      {avatars.map((avatar) => (
        <div 
          key={avatar.id}
          className={`avatar-item ${selectedId === avatar.id ? 'selected' : ''}`}
          style={{ backgroundColor: avatar.color }}
          onClick={() => onSelect(avatar)}
        >
          <img 
            src={avatar.url} 
            alt={`Avatar ${avatar.id}`} 
            style={{ width: '80%', height: '80%', borderRadius: '24px' }}
          />
        </div>
      ))}
      <style jsx="true">{`
        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 40px;
          width: 100%;
        }
        .avatar-item {
          aspect-ratio: 1/1;
          border-radius: 28px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .avatar-item.selected {
          border: 3px solid #3c4043;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}

export { avatars }
