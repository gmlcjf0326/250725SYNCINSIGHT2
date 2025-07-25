'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import { 
  History, 
  Calendar,
  Filter,
  Download,
  Search,
  MessageSquare,
  FileText,
  Clock,
  TrendingUp,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useChatStore } from '@/stores/chatStore'
import { formatDate } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ClientOnly from '@/components/ClientOnly'

interface HistoryItem {
  id: string
  type: 'conversation' | 'document' | 'search' | 'action'
  title: string
  timestamp: Date
  metadata?: any
}

export default function HistoryPage() {
  const { 
    conversations, 
    documents, 
    getRecentActivity, 
    getUsageAnalytics,
    user 
  } = useChatStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedType, setSelectedType] = useState<'all' | 'conversation' | 'document' | 'search'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // 모든 활동 기록 생성
  const getAllHistory = (): HistoryItem[] => {
    const history: HistoryItem[] = []
    
    // 대화 기록
    conversations.forEach(conv => {
      history.push({
        id: `conv-${conv.id}`,
        type: 'conversation',
        title: conv.title,
        timestamp: conv.updatedAt,
        metadata: {
          messageCount: conv.messages.length,
          lastMessage: conv.messages[conv.messages.length - 1]?.content.slice(0, 100)
        }
      })
    })
    
    // 문서 기록
    documents.forEach(doc => {
      history.push({
        id: `doc-${doc.id}`,
        type: 'document',
        title: doc.title,
        timestamp: doc.uploadDate,
        metadata: {
          fileType: doc.type,
          fileSize: doc.fileSize,
          accessCount: doc.metadata?.accessCount || 0
        }
      })
    })
    
    return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const history = getAllHistory()
  
  // 필터링
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || item.type === selectedType
    const matchesDate = selectedDate.toDateString() === new Date(item.timestamp).toDateString()
    
    return matchesSearch && matchesType
  })
  
  // 페이지네이션
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 통계 데이터
  const weeklyAnalytics = getUsageAnalytics('week')
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation':
        return <MessageSquare className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'search':
        return <Search className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation':
        return 'text-blue-600 bg-blue-50'
      case 'document':
        return 'text-green-600 bg-green-50'
      case 'search':
        return 'text-purple-600 bg-purple-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <MainLayout title="사용 기록">
      <div className="min-h-full bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <History className="h-6 w-6 mr-2" />
                  사용 기록
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  모든 활동 내역을 시간순으로 확인하세요
                </p>
              </div>
              
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ClientOnly>
            <Tabs defaultValue="timeline" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="timeline">타임라인</TabsTrigger>
                <TabsTrigger value="analytics">분석</TabsTrigger>
                <TabsTrigger value="calendar">캘린더</TabsTrigger>
              </TabsList>

              {/* 타임라인 탭 */}
              <TabsContent value="timeline" className="mt-6">
                {/* 필터 바 */}
                <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="검색..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={selectedType === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType('all')}
                      >
                        전체
                      </Button>
                      <Button
                        variant={selectedType === 'conversation' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType('conversation')}
                      >
                        대화
                      </Button>
                      <Button
                        variant={selectedType === 'document' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedType('document')}
                      >
                        문서
                      </Button>
                    </div>
                  </div>
                </div>

                {/* 타임라인 */}
                <div className="space-y-4">
                  {paginatedHistory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-lg border shadow-sm p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>
                          {getTypeIcon(item.type)}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          
                          {item.metadata && (
                            <div className="text-sm text-gray-500 mt-1">
                              {item.type === 'conversation' && (
                                <span>{item.metadata.messageCount}개 메시지</span>
                              )}
                              {item.type === 'document' && (
                                <span>{item.metadata.fileType.toUpperCase()} • 조회 {item.metadata.accessCount}회</span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          보기
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm text-gray-600">
                      {currentPage} / {totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* 분석 탭 */}
              <TabsContent value="analytics" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">총 활동</h3>
                      <Activity className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {history.length}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">전체 기록</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">주간 활동</h3>
                      <TrendingUp className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      {weeklyAnalytics.conversationCount}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">이번 주 대화</p>
                  </div>
                  
                  <div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">문서 활용</h3>
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {weeklyAnalytics.documentAccess.length}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">접근한 문서</p>
                  </div>
                </div>

                {/* 활동 패턴 */}
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <h3 className="font-semibold mb-4">활동 패턴</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">가장 활발한 시간</span>
                        <span className="text-sm font-medium">오후 2-4시</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">평균 세션 시간</span>
                        <span className="text-sm font-medium">{Math.floor(user.stats.averageSessionTime / 60)}분</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 캘린더 탭 */}
              <TabsContent value="calendar" className="mt-6">
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      월별 활동
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">2024년 7월</span>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    
                    {Array.from({ length: 35 }, (_, i) => {
                      const day = i - 5 + 1 // 시작 요일 조정
                      const isCurrentMonth = day > 0 && day <= 31
                      const hasActivity = Math.random() > 0.5
                      
                      return (
                        <div
                          key={i}
                          className={`aspect-square rounded-lg p-2 text-center text-sm ${
                            isCurrentMonth
                              ? hasActivity
                                ? 'bg-blue-50 text-blue-600 font-medium'
                                : 'hover:bg-gray-50'
                              : 'text-gray-300'
                          }`}
                        >
                          {isCurrentMonth ? day : ''}
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-100 rounded"></div>
                      <span className="text-gray-600">활동 있음</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-100 rounded"></div>
                      <span className="text-gray-600">활동 없음</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ClientOnly>
        </div>
      </div>
    </MainLayout>
  )
}