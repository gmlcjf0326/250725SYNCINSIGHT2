'use client'

import { useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'

export default function StoreHydration() {
  useEffect(() => {
    useChatStore.persist.rehydrate()
  }, [])

  return null
}