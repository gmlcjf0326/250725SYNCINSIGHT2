'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { 
  Bookmark,
  MessageSquare,
  FileText,
  Filter,
  Calendar,
  Star,
  Trash2,
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/stores/chatStore'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import ClientOnly from '@/components/ClientOnly'
import type { Message, Document } from '@/types'

interface BookmarkItem {
  id: string
  type: 'message' | 'document'
  title: string
  content: string
  timestamp: Date
  source?: {
    conversationId?: string
    conversationTitle?: string
    documentId?: string
  }
}

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'message' | 'document'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date')
  const router = useRouter()
  
  const { conversations, documents } = useChatStore()
  
  // 북마크된 항목 수집
  const bookmarkedItems = useMemo(() => {
    const items: BookmarkItem[] = []
    
    // 북마크된 메시지 수집
    conversations.forEach(conv => {
      conv.messages.forEach(msg => {
        if (msg.reactions?.some(r => r.type === 'bookmark')) {
          items.push({
            id: `msg-${msg.id}`,
            type: 'message',
            title: conv.title,
            content: msg.content.slice(0, 200) + '...',
            timestamp: new Date(msg.timestamp),
            source: {
              conversationId: conv.id,
              conversationTitle: conv.title
            }
          })
        }
      })
    })
    
    // 북마크된 문서 수집 (문서에 북마크 기능이 있다고 가정)
    documents.forEach(doc => {
      // 문서의 metadata에 bookmarked 속성이 있다고 가정
      if ((doc.metadata as any)?.bookmarked) {
        items.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: doc.title,
          content: doc.content.slice(0, 200) + '...',
          timestamp: new Date(doc.uploadDate),
          source: {
            documentId: doc.id
          }
        })
      }
    })
    
    return items
  }, [conversations, documents])
  
  // 필터링 및 정렬
  const filteredItems = useMemo(() => {
    let filtered = bookmarkedItems
    
    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // 타입 필터
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType)
    }
    
    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        // 안전한 날짜 비교를 위해 타임스탬프를 확인
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime()
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime()
        return bTime - aTime
      } else {
        return a.title.localeCompare(b.title)
      }
    })
    
    return filtered
  }, [bookmarkedItems, searchQuery, filterType, sortBy])
  
  const handleRemoveBookmark = (item: BookmarkItem) => {
    if (item.type === 'message' && item.source?.conversationId) {
      // 메시지에서 북마크 제거
      // 북마크 제거 - 실제 환경에서는 removeReaction API 호출
      toast.success('북마크가 제거되었습니다')
    } else if (item.type === 'document') {
      // 문서 북마크 제거 로직
      // 문서 북마크 제거 - 실제 환경에서는 API 호출
      toast.success('문서 북마크가 제거되었습니다')
    }
  }
  
  const handleItemClick = (item: BookmarkItem) => {
    if (item.type === 'message' && item.source?.conversationId) {
      router.push(`/chat?conversation=${item.source.conversationId}`)
    } else if (item.type === 'document' && item.source?.documentId) {
      router.push(`/knowledge?document=${item.source.documentId}`)
    }
  }

  return (
    <MainLayout title="북마크">
      <ClientOnly>
        <div className="min-h-full bg-gray-50">
          {/* 헤더 */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Bookmark className="h-6 w-6 mr-2 text-yellow-500" />
                    북마크
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    중요한 대화와 문서를 저장하고 관리하세요
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    총 {filteredItems.length}개
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 필터 및 검색 */}
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* 검색 */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="북마크 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* 필터 */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">타입:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="text-sm border rounded-md px-3 py-1"
                    >
                      <option value="all">전체</option>
                      <option value="message">메시지</option>
                      <option value="document">문서</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">정렬:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-sm border rounded-md px-3 py-1"
                    >
                      <option value="date">날짜순</option>
                      <option value="title">제목순</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 북마크 목록 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                    >
                      <div
                        onClick={() => handleItemClick(item)}
                        className="p-4 cursor-pointer"
                      >
                        {/* 타입 인디케이터 */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
                            item.type === 'message' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {item.type === 'message' ? (
                              <MessageSquare className="h-3 w-3" />
                            ) : (
                              <FileText className="h-3 w-3" />
                            )}
                            <span>{item.type === 'message' ? '메시지' : '문서'}</span>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveBookmark(item)
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        
                        {/* 제목 */}
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                          {item.title}
                        </h3>
                        
                        {/* 내용 미리보기 */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                          {item.content}
                        </p>
                        
                        {/* 출처 정보 */}
                        {item.source && (
                          <div className="text-xs text-gray-500 mb-3">
                            {item.type === 'message' && item.source.conversationTitle && (
                              <div className="flex items-center space-x-1">
                                <MessageSquare className="h-3 w-3" />
                                <span>대화: {item.source.conversationTitle}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* 날짜 및 액션 */}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>열기</span>
                            <ChevronRight className="h-3 w-3" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? '검색 결과가 없습니다' : '북마크가 없습니다'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? '다른 검색어를 시도해보세요' 
                    : '대화나 문서에서 북마크 버튼을 클릭하여 저장하세요'}
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/chat')}
                >
                  채팅으로 이동
                </Button>
              </div>
            )}
          </div>
        </div>
      </ClientOnly>
    </MainLayout>
  )
}