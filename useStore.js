import { useState, useEffect } from 'react'

export function useStore() {
  const [spaces, setSpaces] = useState([])
  const [activeSpaceId, setActiveSpaceId] = useState(null)

  useEffect(() => {
    try {
      let loadedSpaces = []
      const savedSpaces = localStorage.getItem('humble_spaces')
      
      if (savedSpaces) {
        loadedSpaces = JSON.parse(savedSpaces)
      } else {
        // Migration from old app version
        const savedSubjects = localStorage.getItem('humble_subjects')
        if (savedSubjects) {
          const parsed = JSON.parse(savedSubjects)
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedSpaces = [{
              id: Date.now().toString(),
              name: 'My Space',
              subjects: parsed
            }]
          }
        }
      }

      setSpaces(loadedSpaces)
      
      const savedActive = localStorage.getItem('humble_active_space')
      if (savedActive && loadedSpaces.some(s => s.id === savedActive)) {
        setActiveSpaceId(savedActive)
      } else if (loadedSpaces.length > 0) {
        setActiveSpaceId(loadedSpaces[0].id)
        localStorage.setItem('humble_active_space', loadedSpaces[0].id)
      }
    } catch (e) {
      console.error('Failed to load spaces', e)
      setSpaces([])
    }
  }, [])

  const saveSpaces = (newSpaces, activeId) => {
    setSpaces(newSpaces)
    localStorage.setItem('humble_spaces', JSON.stringify(newSpaces))
    if (activeId) {
      setActiveSpaceId(activeId)
      localStorage.setItem('humble_active_space', activeId)
    }
  }

  const addSpace = (name) => {
    if (spaces.length >= 5) return
    const newSpaceId = Date.now().toString()
    const newSpace = {
      id: newSpaceId,
      name,
      subjects: []
    }
    const updatedSpaces = [...spaces, newSpace]
    saveSpaces(updatedSpaces, newSpaceId)
  }

  const switchSpace = (spaceId) => {
    if (spaces.some(s => s.id === spaceId)) {
      saveSpaces(spaces, spaceId)
    }
  }

  const addSubject = (subject) => {
    if (!activeSpaceId) return
    const newSubject = {
      id: Date.now(),
      ...subject,
      progress: [] // Array of { date: 'YYYY-MM-DD', value: 0-100 }
    }
    
    const updatedSpaces = spaces.map(space => {
      if (space.id === activeSpaceId) {
        return { ...space, subjects: [...space.subjects, newSubject] }
      }
      return space
    })
    saveSpaces(updatedSpaces, activeSpaceId)
  }

  const updateProgress = (subjectId, date, value) => {
    if (!activeSpaceId) return
    
    const updatedSpaces = spaces.map(space => {
      if (space.id === activeSpaceId) {
        const newSubjects = space.subjects.map(s => {
          if (s.id === subjectId) {
            const filteredProgress = s.progress.filter(p => p.date !== date)
            return {
              ...s,
              progress: [...filteredProgress, { date, value }]
            }
          }
          return s
        })
        return { ...space, subjects: newSubjects }
      }
      return space
    })
    saveSpaces(updatedSpaces, activeSpaceId)
  }

  const activeSpace = spaces.find(s => s.id === activeSpaceId)
  const subjects = activeSpace ? activeSpace.subjects : []

  return { spaces, activeSpace, activeSpaceId, subjects, addSubject, updateProgress, addSpace, switchSpace }
}
