'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { 
  Search as SearchIcon,
  Filter,
  Calendar,
  FileText,
  MessageSquare,
  Tag,
  Folder,
  Clock,
  TrendingUp,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/stores/chatStore'
import { formatDate } from '@/lib/utils'
import ClientOnly from '@/components/ClientOnly'

type SearchResultType = 'conversation' | 'document' | 'tag' | 'folder'

interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  content: string
  relevance: number
  timestamp: Date
  metadata?: any
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<SearchResultType[]>(['conversation', 'document', 'tag', 'folder'])
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [sortBy, setSortBy] = useState<'relevance' | 'date'>('relevance')
  const router = useRouter()
  
  const { conversations, documents, tags, folders, searchConversations, searchDocuments } = useChatStore()

  // 검색 실행
  const executeSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    const results: SearchResult[] = []
    
    // 대화 검색
    if (selectedTypes.includes('conversation')) {
      const conversationResults = searchConversations(searchQuery)
      conversationResults.forEach(conv => {
        conv.messages.forEach((msg, idx) => {
          if (msg.content.toLowerCase().includes(searchQuery.toLowerCase())) {
            results.push({
              id: `conv-${conv.id}-${idx}`,
              type: 'conversation',
              title: conv.title,
              content: msg.content.slice(0, 200) + '...',
              relevance: 0.9,
              timestamp: msg.timestamp,
              metadata: { conversationId: conv.id, messageId: msg.id }
            })
          }
        })
      })
    }
    
    // 문서 검색
    if (selectedTypes.includes('document')) {
      const documentResults = searchDocuments(searchQuery)
      documentResults.forEach(doc => {
        results.push({
          id: `doc-${doc.id}`,
          type: 'document',
          title: doc.title,
          content: doc.content.slice(0, 200) + '...',
          relevance: 0.85,
          timestamp: doc.uploadDate,
          metadata: { documentId: doc.id, type: doc.type }
        })
      })
    }
    
    // 태그 검색
    if (selectedTypes.includes('tag')) {
      tags.filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase())).forEach(tag => {
        results.push({
          id: `tag-${tag.id}`,
          type: 'tag',
          title: tag.name,
          content: `${tag.count}개 항목에서 사용됨`,
          relevance: 0.7,
          timestamp: new Date(),
          metadata: { tagId: tag.id, color: tag.color }
        })
      })
    }
    
    // 폴더 검색
    if (selectedTypes.includes('folder')) {
      folders.filter(folder => folder.name.toLowerCase().includes(searchQuery.toLowerCase())).forEach(folder => {
        results.push({
          id: `folder-${folder.id}`,
          type: 'folder',
          title: folder.name,
          content: '폴더',
          relevance: 0.75,
          timestamp: folder.createdAt,
          metadata: { folderId: folder.id, color: folder.color }
        })
      })
    }
    
    // 날짜 필터링
    const filteredResults = filterByDate(results)
    
    // 정렬
    const sortedResults = sortResults(filteredResults)
    
    setSearchResults(sortedResults)
    setIsSearching(false)
  }
  
  const filterByDate = (results: SearchResult[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    switch (dateRange) {
      case 'today':
        return results.filter(r => r.timestamp >= today)
      case 'week':
        return results.filter(r => r.timestamp >= weekAgo)
      case 'month':
        return results.filter(r => r.timestamp >= monthAgo)
      default:
        return results
    }
  }
  
  const sortResults = (results: SearchResult[]) => {
    return [...results].sort((a, b) => {
      if (sortBy === 'relevance') {
        return b.relevance - a.relevance
      } else {
        return b.timestamp.getTime() - a.timestamp.getTime()
      }
    })
  }
  
  // Enter 키로 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeSearch()
    }
  }
  
  // 타입 토글
  const toggleType = (type: SearchResultType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }
  
  const getTypeIcon = (type: SearchResultType) => {
    switch (type) {
      case 'conversation': return <MessageSquare className="h-4 w-4" />
      case 'document': return <FileText className="h-4 w-4" />
      case 'tag': return <Tag className="h-4 w-4" />
      case 'folder': return <Folder className="h-4 w-4" />
    }
  }
  
  const getTypeColor = (type: SearchResultType) => {
    switch (type) {
      case 'conversation': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'document': return 'bg-green-100 text-green-700 border-green-200'
      case 'tag': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'folder': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }
  
  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'conversation':
        router.push(`/chat?conversation=${result.metadata.conversationId}`)
        break
      case 'document':
        router.push(`/knowledge?document=${result.metadata.documentId}`)
        break
      case 'tag':
        router.push(`/knowledge?tag=${result.metadata.tagId}`)
        break
      case 'folder':
        router.push(`/knowledge?folder=${result.metadata.folderId}`)
        break
    }
  }

  return (
    <MainLayout title="검색">
      <ClientOnly>
        <div className="min-h-full bg-gray-50">
          {/* 검색 헤더 */}
          <div className="bg-white border-b">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">통합 검색</h1>
                <p className="text-gray-600">대화, 문서, 태그, 폴더를 한 번에 검색하세요</p>
              </div>
              
              {/* 검색 입력 */}
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 pr-4 py-3 text-lg"
                />
                <Button
                  onClick={executeSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {isSearching ? '검색 중...' : '검색'}
                </Button>
              </div>
              
              {/* 검색 필터 */}
              <div className="mt-6 space-y-4">
                {/* 타입 필터 */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">검색 대상:</span>
                  <div className="flex flex-wrap gap-2">
                    {(['conversation', 'document', 'tag', 'folder'] as SearchResultType[]).map(type => (
                      <Button
                        key={type}
                        variant={selectedTypes.includes(type) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleType(type)}
                        className="flex items-center space-x-1"
                      >
                        {getTypeIcon(type)}
                        <span>
                          {type === 'conversation' ? '대화' :
                           type === 'document' ? '문서' :
                           type === 'tag' ? '태그' : '폴더'}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* 날짜 및 정렬 필터 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">기간:</span>
                    <select
                      value={dateRange}
                      onChange={(e) => setDateRange(e.target.value as any)}
                      className="text-sm border rounded-md px-3 py-1"
                    >
                      <option value="all">전체</option>
                      <option value="today">오늘</option>
                      <option value="week">이번 주</option>
                      <option value="month">이번 달</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">정렬:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-sm border rounded-md px-3 py-1"
                    >
                      <option value="relevance">관련도순</option>
                      <option value="date">최신순</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 검색 결과 */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    검색 결과 ({searchResults.length}개)
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchResults([])}
                  >
                    <X className="h-4 w-4 mr-1" />
                    결과 지우기
                  </Button>
                </div>
                
                <AnimatePresence>
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(result)}
                      className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(result.type)}`}>
                          <div className="flex items-center space-x-1">
                            {getTypeIcon(result.type)}
                            <span>
                              {result.type === 'conversation' ? '대화' :
                               result.type === 'document' ? '문서' :
                               result.type === 'tag' ? '태그' : '폴더'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{result.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{result.content}</p>
                          
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(result.timestamp)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>관련도 {Math.round(result.relevance * 100)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : searchQuery && !isSearching ? (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-gray-600">다른 검색어를 시도해보세요</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">검색어를 입력하세요</h3>
                <p className="text-gray-600">대화, 문서, 태그, 폴더를 통합 검색할 수 있습니다</p>
              </div>
            )}
          </div>
        </div>
      </ClientOnly>
    </MainLayout>
  )
}