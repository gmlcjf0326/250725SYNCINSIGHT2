'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  FileText, 
  BarChart3, 
  Settings, 
  Home,
  Search,
  User,
  ChevronRight,
  Bookmark,
  History,
  HelpCircle,
  Folder,
  Brain,
  Sparkles,
  CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/stores/chatStore'

const navigationItems = [
  {
    name: '홈',
    href: '/',
    icon: Home,
    description: '메인 페이지'
  },
  {
    name: '채팅',
    href: '/chat',
    icon: MessageSquare,
    description: 'AI 어시스턴트와 대화'
  },
  {
    name: '지식베이스',
    href: '/knowledge',
    icon: FileText,
    description: '문서 관리 및 검색'
  },
  {
    name: '폴더 관리',
    href: '/knowledge-folders',
    icon: Folder,
    description: '지식베이스 폴더 관리'
  },
  {
    name: 'AI 설정',
    href: '/ai-settings',
    icon: Brain,
    description: 'AI 상세 설정'
  },
  {
    name: '다중 AI',
    href: '/multi-ai',
    icon: Sparkles,
    description: '다중 AI 응답 생성'
  },
  {
    name: '대시보드',
    href: '/dashboard',
    icon: BarChart3,
    description: '통계 및 분석'
  },
  {
    name: '요금제',
    href: '/pricing',
    icon: CreditCard,
    description: '요금제 및 구독 관리'
  },
  {
    name: '설정',
    href: '/settings',
    icon: Settings,
    description: '사용자 설정'
  }
]

const quickActions = [
  {
    name: '새 대화',
    href: '/chat',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    name: '문서 업로드',
    href: '/knowledge?action=upload',
    icon: FileText,
    color: 'bg-green-500'
  },
  {
    name: '검색',
    href: '/search',
    icon: Search,
    color: 'bg-purple-500'
  },
  {
    name: '북마크',
    href: '/bookmarks',
    icon: Bookmark,
    color: 'bg-yellow-500'
  }
]

// 브레드크럼 컴포넌트
function Breadcrumb({ pathname }: { pathname: string }) {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const getBreadcrumbName = (segment: string, index: number) => {
    const pathMap: Record<string, string> = {
      'chat': '채팅',
      'knowledge': '지식베이스',
      'knowledge-folders': '폴더 관리',
      'ai-settings': 'AI 설정',
      'multi-ai': '다중 AI',
      'dashboard': '대시보드',
      'pricing': '요금제',
      'settings': '설정',
      'search': '검색',
      'bookmarks': '북마크',
      'help': '도움말',
      'history': '사용 기록'
    }
    
    return pathMap[segment] || segment
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500">
      <Link href="/" className="hover:text-gray-700 transition-colors">
        홈
      </Link>
      {pathSegments.map((segment, index) => (
        <div key={segment} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            href={`/${pathSegments.slice(0, index + 1).join('/')}`}
            className={`hover:text-gray-700 transition-colors ${
              index === pathSegments.length - 1 ? 'text-gray-900 font-medium' : ''
            }`}
          >
            {getBreadcrumbName(segment, index)}
          </Link>
        </div>
      ))}
    </nav>
  )
}

export default function Navigation() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true) // 기본값을 true로 변경
  const { user, getRecentActivity, setCurrentConversation } = useChatStore()
  const router = useRouter()

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 로고 및 사용자 정보 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">SyncInsight</h1>
            <p className="text-xs text-gray-500">AI Knowledge Assistant</p>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.role === 'admin' ? '관리자' : '사용자'}
            </p>
          </div>
        </div>
      </div>

      {/* 브레드크럼 */}
      <div className="p-4 border-b border-gray-100">
        <Breadcrumb pathname={pathname} />
      </div>

      {/* 메인 네비게이션 */}
      <div className="flex-1 p-4 space-y-2">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            메인 메뉴
          </h3>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 빠른 액션 */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              빠른 액션
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              <ChevronRight 
                className={`h-3 w-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
              />
            </Button>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-700 text-center">
                        {action.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 최근 활동 */}
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            최근 활동
          </h3>
          <div className="space-y-2">
            {getRecentActivity(3).map((activity, index) => {
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500']
              return (
                <div 
                  key={index}
                  onClick={() => {
                    if (activity.type === 'conversation') {
                      setCurrentConversation(activity.item.id)
                      router.push('/chat')
                    } else if (activity.type === 'document') {
                      router.push('/knowledge')
                    }
                  }}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className={`w-2 h-2 ${colors[index % colors.length]} rounded-full`}></div>
                  <span className="text-sm text-gray-600 truncate">
                    {activity.type === 'conversation' 
                      ? activity.item.title || '새 대화'
                      : activity.item.title || '문서'
                    }
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 도움말 및 설정 */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/help"
          className="flex items-center space-x-3 p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          <span>도움말</span>
        </Link>
        
        <Link
          href="/history"
          className="flex items-center space-x-3 p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <History className="h-4 w-4" />
          <span>사용 기록</span>
        </Link>

        {/* 버전 정보 */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            v1.0.0 • 2024 SyncInsight
          </p>
        </div>
      </div>
    </div>
  )
}