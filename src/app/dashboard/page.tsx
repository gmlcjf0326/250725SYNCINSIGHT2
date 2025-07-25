'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from 'next/navigation'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings,
  RefreshCw,
  Download,
  Calendar,
  Filter,
  Search,
  Plus,
  Upload,
  FolderPlus,
  Star,
  MessageSquare,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import DashboardStats from "@/components/dashboard/DashboardStats"
import { useChatStore } from "@/stores/chatStore"
import MainLayout from '@/components/layout/MainLayout'
import ClientOnly from '@/components/ClientOnly'
import { toast } from 'sonner'

const timeRangeOptions = [
  { label: '오늘', value: 'today' },
  { label: '이번 주', value: 'week' },
  { label: '이번 달', value: 'month' },
  { label: '올해', value: 'year' }
]

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week')
  const [searchQuery, setSearchQuery] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(true)
  const router = useRouter()
  
  const { user, getRecentActivity, setCurrentConversation } = useChatStore()

  // LocalStorage에서 빠른 액션 상태 불러오기 (항상 true)
  useEffect(() => {
    const saved = localStorage.getItem('dashboard-quick-actions')
    if (saved === null || saved === 'false') {
      localStorage.setItem('dashboard-quick-actions', 'true')
    }
    setQuickActionsOpen(true)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // 실제 환경에서는 데이터를 다시 가져오는 로직
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const handleExport = () => {
    // CSV/PDF 내보내기 로직
    toast.info('대시보드 데이터를 준비하고 있습니다...')
    // 실제 환경에서는 CSV/PDF 생성 및 다운로드 로직 구현
  }

  // 최근 활동 데이터 가져오기
  const recentActivities = getRecentActivity(5)

  const handleActivityClick = (activity: any) => {
    if (activity.type === 'conversation') {
      setCurrentConversation(activity.item.id)
      router.push('/chat')
    } else if (activity.type === 'document') {
      router.push('/knowledge')
    }
  }

  const formatActivityTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  return (
    <MainLayout title="대시보드">
      <div className="min-h-full bg-gray-50">
        {/* 툴바 */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">분석 대시보드</h1>
                <p className="text-sm text-gray-500">사용 현황 및 통계 분석</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>새로고침</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>내보내기</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>설정</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 및 검색 바 */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              {/* 검색창 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="통계 항목 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* 시간 범위 선택 */}
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">기간:</span>
                <div className="flex rounded-lg border border-gray-200 p-1">
                  {timeRangeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedTimeRange(option.value)}
                      className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                        selectedTimeRange === option.value
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 환영 메시지 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">
                    안녕하세요, {user.name}님! 👋
                  </h2>
                  <p className="text-blue-100">
                    오늘도 SyncInsight와 함께 효율적인 업무를 시작해보세요.
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
              </div>
              
              {/* 간단한 요약 통계 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.totalConversations}</div>
                  <div className="text-sm text-blue-100">총 대화</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.totalDocuments}</div>
                  <div className="text-sm text-blue-100">문서</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.floor(user.stats.averageSessionTime / 60)}</div>
                  <div className="text-sm text-blue-100">평균 세션(분)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{user.stats.documentsUploaded}</div>
                  <div className="text-sm text-blue-100">업로드한 문서</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 빠른 액션 섹션 - 항상 열려있음 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">빠른 액션</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => router.push('/chat')}
                >
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">새 대화 시작</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-green-50 hover:border-green-300"
                  onClick={() => router.push('/knowledge')}
                >
                  <Upload className="h-6 w-6 text-green-600" />
                  <span className="text-sm">문서 업로드</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => router.push('/knowledge-folders')}
                >
                  <FolderPlus className="h-6 w-6 text-purple-600" />
                  <span className="text-sm">폴더 관리</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-yellow-50 hover:border-yellow-300"
                  onClick={() => router.push('/bookmarks')}
                >
                  <Star className="h-6 w-6 text-yellow-600" />
                  <span className="text-sm">즐겨찾기</span>
                </Button>
              </div>
              
              <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>빠른 액션은 항상 활성화되어 있습니다</span>
              </div>
            </div>
          </motion.div>

          {/* 대시보드 통계 컴포넌트 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTimeRange}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ClientOnly fallback={
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }>
                <DashboardStats />
              </ClientOnly>
            </motion.div>
          </AnimatePresence>

          {/* 추가 인사이트 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* 사용 팁 */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                사용 팁
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">태그 활용</p>
                    <p className="text-xs text-gray-500">문서와 대화에 태그를 추가하여 더 쉽게 찾아보세요</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">폴더 정리</p>
                    <p className="text-xs text-gray-500">관련 문서들을 폴더로 그룹화하여 체계적으로 관리하세요</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">즐겨찾기</p>
                    <p className="text-xs text-gray-500">자주 사용하는 대화는 즐겨찾기로 등록하세요</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                최근 활동
              </h3>
              <div className="space-y-3">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div 
                      key={index}
                      onClick={() => handleActivityClick(activity)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-2">
                        {activity.type === 'conversation' ? (
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                          {activity.type === 'conversation' 
                            ? activity.item.title || '새 대화'
                            : activity.item.title || '문서'
                          }
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {formatActivityTime(activity.timestamp)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <span className="text-sm">최근 활동이 없습니다</span>
                  </div>
                )}
              </div>
            </div>

            {/* 시스템 상태 */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                시스템 상태
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI 응답 속도</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">정상</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">문서 처리</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">정상</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">검색 엔진</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-xs text-yellow-600">점검 중</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">데이터 백업</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">완료</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}