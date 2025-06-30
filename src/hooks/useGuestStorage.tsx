
import { useState, useEffect } from 'react'

interface GuestData {
  sobrietyRecords: any[]
  moodHistory: any[]
  dailyMetrics: any[]
  settings: any
  achievements: any[]
  chatMessages: any[]
}

const defaultGuestData: GuestData = {
  sobrietyRecords: [],
  moodHistory: [],
  dailyMetrics: [],
  settings: {
    theme: 'light',
    notifications_enabled: true,
    language: 'pt-BR'
  },
  achievements: [],
  chatMessages: []
}

export function useGuestStorage() {
  const [guestData, setGuestData] = useState<GuestData>(defaultGuestData)

  useEffect(() => {
    // Carregar dados salvos do localStorage
    const savedData = localStorage.getItem('guestData')
    if (savedData) {
      try {
        setGuestData(JSON.parse(savedData))
      } catch (error) {
        console.error('Erro ao carregar dados do guest:', error)
        setGuestData(defaultGuestData)
      }
    }
  }, [])

  const updateGuestData = (key: keyof GuestData, value: any) => {
    const newData = { ...guestData, [key]: value }
    setGuestData(newData)
    localStorage.setItem('guestData', JSON.stringify(newData))
  }

  const addToGuestData = (key: keyof GuestData, item: any) => {
    if (Array.isArray(guestData[key])) {
      const newArray = [...(guestData[key] as any[]), item]
      updateGuestData(key, newArray)
    }
  }

  const clearGuestData = () => {
    setGuestData(defaultGuestData)
    localStorage.removeItem('guestData')
  }

  return {
    guestData,
    updateGuestData,
    addToGuestData,
    clearGuestData
  }
}
