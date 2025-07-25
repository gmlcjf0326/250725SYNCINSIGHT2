'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, Search, ChevronDown, LogOut, Settings as SettingsIcon, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navigation from './Navigation'
import { useChatStore } from '@/stores/chatStore'
import { useRouter } from 'next/navigation'

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
  showSearch?: boolean
  showNotifications?: boolean
}

// 알림 데이터 타입
interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: '새로운 문서가 업데이트되었습니다',
    message: '인사 관리 규정이 최신 버전으로 업데이트되었습니다.',
    type: 'info',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
    read: false
  },
  {
    id: '2',
    title: '시스템 점검 완료',
    message: '검색 엔진 점검이 완료되어 정상 서비스가 재개되었습니다.',
    type: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    read: false
  },
  {
    id: '3',
    title: '저장 공간 부족 경고',
    message: '문서 저장 공간이 80%를 초과했습니다. 관리자에게 문의하세요.',
    type: 'warning',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4시간 전
    read: true
  }
]

export default function MainLayout({ 
  children, 
  title,
  showSearch = true,
  showNotifications = true 
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [showNotificationPanel, setShowNotificationPanel] = useState(false)
  const [globalSearch, setGlobalSearch] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  const { user } = useChatStore()
  const router = useRouter()

  // 사이드바 자동 닫기 (큰 화면에서는 기본적으로 열림)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    return `${days}일 전`
  }

  const getNotificationColor = (type: string, read: boolean) => {
    const colors = {
      info: read ? 'bg-blue-50 border-blue-200' : 'bg-blue-100 border-blue-300',
      success: read ? 'bg-green-50 border-green-200' : 'bg-green-100 border-green-300',
      warning: read ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-100 border-yellow-300',
      error: read ? 'bg-red-50 border-red-200' : 'bg-red-100 border-red-300'
    }
    return colors[type as keyof typeof colors] || colors.info
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* 데스크톱 사이드바 */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <Navigation />
      </div>

      {/* 모바일 사이드바 */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            />
            
            {/* 사이드바 */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <Navigation />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 상단 헤더 */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 모바일 메뉴 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* 페이지 제목 */}
              {title && (
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {/* 글로벌 검색 */}
              {showSearch && (
                <div className="hidden md:flex relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="전체 검색..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                  {globalSearch && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 알림 */}
              {showNotifications && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                    className="relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>

                  {/* 알림 패널 */}
                  <AnimatePresence>
                    {showNotificationPanel && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">알림</h3>
                            <div className="flex items-center space-x-2">
                              {unreadCount > 0 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={markAllAsRead}
                                  className="text-xs"
                                >
                                  모두 읽음
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowNotificationPanel(false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">새로운 알림이 없습니다</p>
                            </div>
                          ) : (
                            <div className="space-y-1 p-2">
                              {notifications.map((notification) => (
                                <motion.div
                                  key={notification.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className={`p-3 rounded-lg border cursor-pointer transition-all ${getNotificationColor(notification.type, notification.read)}`}
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                  <p className={`text-xs ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    {formatTimestamp(notification.timestamp)}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* 사용자 메뉴 */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>

                {/* 사용자 드롭다운 메뉴 */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      {/* 사용자 정보 헤더 */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            <p className="text-xs text-blue-600 font-medium">
                              {user.role === 'admin' ? '관리자' : '사용자'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 메뉴 아이템들 */}
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left p-3 h-auto"
                          onClick={() => {
                            setShowUserMenu(false)
                            // 프로필 페이지로 이동
                            router.push('/settings')
                          }}
                        >
                          <UserIcon className="h-4 w-4 mr-3" />
                          <div>
                            <p className="text-sm font-medium">프로필 관리</p>
                            <p className="text-xs text-gray-500">개인 정보 및 설정</p>
                          </div>
                        </Button>

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left p-3 h-auto"
                          onClick={() => {
                            setShowUserMenu(false)
                            // 설정 페이지로 이동
                            router.push('/settings')
                          }}
                        >
                          <SettingsIcon className="h-4 w-4 mr-3" />
                          <div>
                            <p className="text-sm font-medium">설정</p>
                            <p className="text-xs text-gray-500">환경 설정 및 테마</p>
                          </div>
                        </Button>

                        <div className="border-t border-gray-200 my-2"></div>

                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left p-3 h-auto text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setShowUserMenu(false)
                            // 로그아웃 기능
                            if (confirm('로그아웃 하시겠습니까?')) {
                              // 로그아웃 처리 - 실제 환경에서는 API 호출
                              localStorage.clear()
                              sessionStorage.clear()
                              router.push('/')
                            }
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          <div>
                            <p className="text-sm font-medium">로그아웃</p>
                            <p className="text-xs text-gray-500">안전하게 로그아웃</p>
                          </div>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* 알림 패널 백그라운드 클릭 시 닫기 */}
      {showNotificationPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotificationPanel(false)}
        />
      )}

      {/* 사용자 메뉴 백그라운드 클릭 시 닫기 */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  )
}