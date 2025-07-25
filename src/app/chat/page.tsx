'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, FileText, BarChart3, Settings, Menu, Plus, MessageCircle, Upload, Search, History, ChevronRight, Check, Brain, Folder } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import MainLayout from "@/components/layout/MainLayout"
import { useChat } from "@/hooks/useChat"
import { quickQuestions } from "@/lib/mockData"
import ChatMessage from "@/components/chat/ChatMessage"
import Sidebar from "@/components/chat/Sidebar"
import SourcePanel from "@/components/chat/SourcePanel"
import DocumentUpload from "@/components/knowledge/DocumentUpload"
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'

// 기본 AI 프로필 (AI 설정 페이지와 동일)
const defaultProfiles = [
  {
    id: 'precise',
    name: '정확성 우선',
    description: '사실 기반의 정확한 답변',
    model: 'gemini-pro',
    icon: '🎯'
  },
  {
    id: 'creative',
    name: '창의성 우선',
    description: '창의적이고 다양한 관점',
    model: 'claude-3',
    icon: '💡'
  },
  {
    id: 'balanced',
    name: '균형',
    description: '정확성과 창의성의 균형',
    model: 'gemini-flash-3.5',
    icon: '⚖️'
  }
]

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sourcePanelOpen, setSourcePanelOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [knowledgeBaseOpen, setKnowledgeBaseOpen] = useState(true)
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set())
  const [selectedProfile, setSelectedProfile] = useState('balanced')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { folders, documents } = useChatStore()
  const {
    conversations,
    currentConversation,
    isLoading,
    error,
    sendMessage,
    startNewConversation,
    selectConversation,
    clearError
  } = useChat()

  // 폴더별 문서 수 계산
  const getFolderDocCount = (folderId: string) => {
    return documents.filter(doc => doc.folderId === folderId).length
  }

  // 선택된 폴더의 문서 수 계산
  const getSelectedDocCount = () => {
    return documents.filter(doc => 
      doc.folderId && selectedFolders.has(doc.folderId)
    ).length
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return
    
    // 선택된 폴더와 AI 프로필 정보를 함께 전달
    const message = input
    const context = {
      selectedFolders: Array.from(selectedFolders),
      selectedProfile,
      documentCount: getSelectedDocCount()
    }
    
    setInput('')
    await sendMessage(message, context)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
  }

  const handleFolderToggle = (folderId: string) => {
    const newSelection = new Set(selectedFolders)
    if (newSelection.has(folderId)) {
      newSelection.delete(folderId)
    } else {
      newSelection.add(folderId)
    }
    setSelectedFolders(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedFolders.size === folders.length) {
      setSelectedFolders(new Set())
    } else {
      setSelectedFolders(new Set(folders.map(f => f.id)))
    }
  }

  return (
    <MainLayout title="채팅" showSearch={false}>
      <div className="flex h-full bg-background">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed lg:relative z-50 w-80 h-full"
            >
              <Sidebar
                conversations={conversations}
                currentConversationId={currentConversation?.id || null}
                onSelectConversation={selectConversation}
                onNewConversation={startNewConversation}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center justify-between bg-white">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <h1 className="font-semibold">스마트 채팅</h1>
                  <p className="text-xs text-muted-foreground">
                    {selectedFolders.size > 0 
                      ? `${selectedFolders.size}개 폴더, ${getSelectedDocCount()}개 문서 검색 중` 
                      : 'AI 어시스턴트와 대화하기'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setKnowledgeBaseOpen(!knowledgeBaseOpen)}
                title="지식베이스 설정"
                className={cn(knowledgeBaseOpen && "bg-gray-100")}
              >
                <Folder className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSourcePanelOpen(!sourcePanelOpen)}
                title="출처 패널"
              >
                <FileText className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                title="통계"
                onClick={() => router.push('/dashboard')}
              >
                <BarChart3 className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                title="설정"
                onClick={() => router.push('/settings')}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Knowledge Base Panel */}
            <AnimatePresence>
              {knowledgeBaseOpen && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 320 }}
                  exit={{ width: 0 }}
                  className="border-r bg-gray-50 overflow-hidden"
                >
                  <div className="p-4 h-full overflow-y-auto">
                    {/* AI 프로필 선택 */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        AI 프로필 선택
                      </h3>
                      <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {defaultProfiles.map(profile => (
                            <SelectItem key={profile.id} value={profile.id}>
                              <div className="flex items-center space-x-2">
                                <span>{profile.icon}</span>
                                <div>
                                  <div className="font-medium">{profile.name}</div>
                                  <div className="text-xs text-gray-500">{profile.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2 h-8 px-3 border-dashed"
                        onClick={() => router.push('/ai-settings')}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span className="font-medium">상세 설정</span>
                      </Button>
                    </div>

                    {/* 지식베이스 선택 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center">
                          <Folder className="h-4 w-4 mr-2" />
                          지식베이스 선택
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSelectAll}
                          className="text-xs"
                        >
                          {selectedFolders.size === folders.length ? '전체 해제' : '전체 선택'}
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {folders.map(folder => {
                          const docCount = getFolderDocCount(folder.id)
                          const isSelected = selectedFolders.has(folder.id)

                          return (
                            <label
                              key={folder.id}
                              className={cn(
                                "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                                isSelected 
                                  ? "bg-primary/5 border-primary" 
                                  : "bg-white hover:bg-gray-50"
                              )}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleFolderToggle(folder.id)}
                              />
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: folder.color + '20' }}
                              >
                                <Folder className="h-4 w-4" style={{ color: folder.color }} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{folder.name}</p>
                                <p className="text-xs text-gray-500">{docCount}개 문서</p>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-primary" />}
                            </label>
                          )
                        })}
                      </div>

                      {folders.length === 0 && (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-sm text-gray-500">
                            아직 폴더가 없습니다
                          </p>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => router.push('/knowledge-folders')}
                          >
                            폴더 만들기
                          </Button>
                        </div>
                      )}

                      {/* 선택 상태 표시 */}
                      {selectedFolders.size > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">{selectedFolders.size}개 폴더</span>의{' '}
                            <span className="font-medium">{getSelectedDocCount()}개 문서</span>가 
                            검색 대상입니다
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="max-w-4xl mx-auto space-y-4">
                  {/* Welcome screen or messages */}
                  {!currentConversation || currentConversation.messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center max-w-2xl">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <span className="text-white font-bold text-2xl">S</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">AI 어시스턴트에 오신 것을 환영합니다!</h2>
                        <p className="text-muted-foreground mb-8">
                          AI 어시스턴트에게 질문하거나 아래 예시 질문을 클릭해보세요.
                        </p>
                        
                        {/* Quick Questions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                          {quickQuestions.slice(0, 6).map((question, index) => (
                            <motion.button
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              onClick={() => handleQuickQuestion(question)}
                              className="p-3 text-sm text-left bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                            >
                              {question}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {currentConversation.messages.map((message, index) => (
                        <ChatMessage
                          key={message.id}
                          message={message}
                          isLatest={index === currentConversation.messages.length - 1}
                        />
                      ))}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex space-x-2">
                    <div className="flex-1 relative">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={
                          selectedFolders.size > 0 
                            ? `${getSelectedDocCount()}개 문서에서 검색합니다...` 
                            : "AI 어시스턴트에게 질문해보세요..."
                        }
                        className="pr-12"
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Error Display */}
                  {error && (
                    <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                      {error}
                      <button
                        onClick={clearError}
                        className="ml-2 hover:underline"
                      >
                        닫기
                      </button>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <div className="flex space-x-4">
                      <button 
                        className="hover:text-foreground flex items-center space-x-1"
                        onClick={() => setUploadModalOpen(true)}
                      >
                        <Upload className="h-3 w-3" />
                        <span>파일 업로드</span>
                      </button>
                      <button 
                        className="hover:text-foreground flex items-center space-x-1"
                        onClick={() => router.push('/search')}
                      >
                        <Search className="h-3 w-3" />
                        <span>문서 검색</span>
                      </button>
                      <button 
                        className="hover:text-foreground flex items-center space-x-1"
                        onClick={() => router.push('/history')}
                      >
                        <History className="h-3 w-3" />
                        <span>이전 대화</span>
                      </button>
                    </div>
                    <div>
                      Enter로 전송, Shift+Enter로 줄바꿈
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Panel */}
            <AnimatePresence>
              {sourcePanelOpen && (
                <motion.div
                  initial={{ x: 300 }}
                  animate={{ x: 0 }}
                  exit={{ x: 300 }}
                  className="w-80 border-l"
                >
                  <SourcePanel
                    messages={currentConversation?.messages || []}
                    onClose={() => setSourcePanelOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
      
      {/* 문서 업로드 모달 */}
      <DocumentUpload 
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </MainLayout>
  )
}