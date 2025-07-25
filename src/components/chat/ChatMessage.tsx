'use client'

import { motion } from "framer-motion"
import { User, Bot, ExternalLink, TrendingUp, Bookmark, ThumbsUp, ThumbsDown, Copy, Check } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Message } from "@/types"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/stores/chatStore"

interface ChatMessageProps {
  message: Message
  isLatest?: boolean
}

export default function ChatMessage({ message, isLatest }: ChatMessageProps) {
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const { currentConversationId, addReaction } = useChatStore()
  
  const hasReaction = (type: 'like' | 'dislike' | 'bookmark') => {
    return message.reactions?.some(r => r.type === type) || false
  }
  
  const handleReaction = (type: 'like' | 'dislike' | 'bookmark') => {
    if (currentConversationId) {
      addReaction(currentConversationId, message.id, type)
    }
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 타이핑 애니메이션 효과
  useEffect(() => {
    if (message.role === 'assistant' && isLatest && !message.processing && message.content) {
      setIsTyping(true)
      setDisplayedContent('')
      
      let index = 0
      const content = message.content
      
      const typingInterval = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.slice(0, index + 1))
          index++
        } else {
          setIsTyping(false)
          clearInterval(typingInterval)
        }
      }, 30) // 타이핑 속도 조절

      return () => clearInterval(typingInterval)
    } else {
      setDisplayedContent(message.content)
      setIsTyping(false)
    }
  }, [message.content, message.role, isLatest, message.processing])

  const isUser = message.role === 'user'

  if (message.processing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex space-x-3"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="bg-muted p-4 rounded-lg max-w-3xl">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <span className="text-sm text-muted-foreground">AI가 답변을 생성하고 있습니다...</span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex space-x-3 ${isUser ? 'justify-end' : ''}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`flex-1 ${isUser ? 'flex justify-end' : ''}`}>
        <div className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'} p-4 rounded-lg max-w-3xl`}>
          <div className="whitespace-pre-wrap">
            {displayedContent}
            {isTyping && <span className="typing-animation">|</span>}
          </div>
          
          {/* 신뢰도 점수 */}
          {!isUser && message.confidence && (
            <div className="mt-2 flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>신뢰도: {Math.round(message.confidence * 100)}%</span>
            </div>
          )}

          {/* 출처 정보 */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-medium text-muted-foreground">참고 자료:</div>
              {message.sources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className="flex items-center space-x-2 p-2 bg-background rounded border text-xs"
                >
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  <div className="flex-1">
                    <div className="font-medium">{source.title}</div>
                    <div className="text-muted-foreground">{source.excerpt}</div>
                    {source.page && (
                      <div className="text-muted-foreground">페이지 {source.page}</div>
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {Math.round(source.relevanceScore * 100)}%
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {formatDate(message.timestamp)}
            </div>
            
            {/* 메시지 액션 버튼 */}
            {!isUser && (
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleReaction('like')}
                >
                  <ThumbsUp className={`h-3.5 w-3.5 ${hasReaction('like') ? 'fill-current text-green-600' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleReaction('dislike')}
                >
                  <ThumbsDown className={`h-3.5 w-3.5 ${hasReaction('dislike') ? 'fill-current text-red-600' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleReaction('bookmark')}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${hasReaction('bookmark') ? 'fill-current text-yellow-600' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </motion.div>
  )
}