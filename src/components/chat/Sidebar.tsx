'use client'

import { Button } from "@/components/ui/button"
import { Plus, MessageCircle, Search, Settings, X, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import type { Conversation } from "@/types"
import { useState } from "react"
import Link from "next/link"

interface SidebarProps {
  conversations: Conversation[]
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onClose: () => void
}

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onClose
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-background border-r flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-semibold">SyncInsight</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Button onClick={onNewConversation} className="w-full justify-start" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          새 대화 시작
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="대화 검색..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">아직 대화가 없습니다</p>
            <p className="text-xs">새 대화를 시작해보세요</p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <motion.div
                key={conversation.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  p-3 rounded-lg mb-2 cursor-pointer transition-colors group
                  ${currentConversationId === conversation.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                  }
                `}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate text-sm">
                      {conversation.title}
                    </h4>
                    <p className="text-xs opacity-70 mt-1 line-clamp-2">
                      {conversation.messages[conversation.messages.length - 1]?.content || '새 대화'}
                    </p>
                    <p className="text-xs opacity-50 mt-1">
                      {new Intl.DateTimeFormat('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).format(conversation.updatedAt)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 ml-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: 대화 삭제 기능
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">빠른 작업</div>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link href="/knowledge">
            <Search className="h-4 w-4 mr-2" />
            지식베이스 관리
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <Link href="/knowledge">
            <Plus className="h-4 w-4 mr-2" />
            문서 업로드
          </Link>
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Settings className="h-4 w-4 mr-2" />
          설정
        </Button>
      </div>
    </motion.div>
  )
}