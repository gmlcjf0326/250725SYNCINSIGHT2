import { useState, useCallback } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { aiService } from '@/lib/aiService'
import { generateId } from '@/lib/utils'
import type { Message, Conversation } from '@/types'

export function useChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const {
    conversations,
    currentConversationId,
    settings,
    addConversation,
    updateConversation,
    setCurrentConversation,
    addMessage,
    updateMessage,
    getCurrentConversation
  } = useChatStore()

  const sendMessage = useCallback(async (content: string, context?: any) => {
    if (!content.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    // 현재 대화가 없으면 새로 생성
    let conversationId = currentConversationId

    try {
      if (!conversationId) {
        const newConversation: Conversation = {
          id: generateId(),
          title: content.length > 50 ? content.substring(0, 50) + '...' : content,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
          pinned: false,
          archived: false,
          shared: false,
          category: { id: 'default', name: '일반', color: '#3B82F6', icon: '💬' }
        }
        addConversation(newConversation)
        setCurrentConversation(newConversation.id)
        conversationId = newConversation.id
      }

      // 사용자 메시지 추가 (컨텍스트 정보 포함)
      const userMessage: Message = {
        id: generateId(),
        content,
        role: 'user',
        timestamp: new Date()
      }
      addMessage(conversationId!, userMessage)

      // 타이핑 인디케이터 추가
      const typingMessage: Message = {
        id: 'typing',
        content: '',
        role: 'assistant',
        timestamp: new Date(),
        processing: true
      }
      addMessage(conversationId!, typingMessage)

      // AI 응답 생성
      const currentConversation = getCurrentConversation()
      const conversationHistory = currentConversation?.messages.filter(m => !m.processing) || []
      
      const aiResponse = await aiService.generateResponse(
        content,
        conversationHistory,
        {
          speed: settings.responseSpeed,
          temperature: settings.temperature,
          includeContext: true
        }
      )

      // 타이핑 인디케이터 제거 및 AI 응답 추가
      // conversationHistory에 이미 userMessage가 포함되어 있으므로 중복 제거
      const currentMessages = getCurrentConversation()?.messages.filter(m => m.id !== 'typing') || []
      const updatedMessages = [...currentMessages, aiResponse]
      
      updateConversation(conversationId!, {
        messages: updatedMessages
      })

    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      
      // 타이핑 인디케이터 제거
      if (conversationId) {
        const currentConversation = getCurrentConversation()
        if (currentConversation) {
          updateConversation(conversationId, {
            messages: currentConversation.messages.filter(m => m.id !== 'typing')
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    isLoading,
    currentConversationId,
    settings,
    addConversation,
    updateConversation,
    setCurrentConversation,
    addMessage,
    getCurrentConversation
  ])

  const startNewConversation = useCallback(() => {
    setCurrentConversation(null)
    setError(null)
  }, [setCurrentConversation])

  const selectConversation = useCallback((id: string) => {
    setCurrentConversation(id)
    setError(null)
  }, [setCurrentConversation])

  const retryLastMessage = useCallback(async () => {
    const conversation = getCurrentConversation()
    if (!conversation || conversation.messages.length < 2) return

    const lastUserMessage = [...conversation.messages]
      .reverse()
      .find(m => m.role === 'user')
    
    if (lastUserMessage) {
      // 마지막 AI 응답 제거
      const messagesWithoutLastAI = conversation.messages.filter(
        (m, index) => !(index === conversation.messages.length - 1 && m.role === 'assistant')
      )
      
      updateConversation(conversation.id, {
        messages: messagesWithoutLastAI
      })

      // 메시지 재전송
      await sendMessage(lastUserMessage.content)
    }
  }, [getCurrentConversation, updateConversation, sendMessage])

  return {
    // State
    conversations,
    currentConversation: getCurrentConversation(),
    isLoading,
    error,
    
    // Actions
    sendMessage,
    startNewConversation,
    selectConversation,
    retryLastMessage,
    
    // Utils
    clearError: () => setError(null)
  }
}