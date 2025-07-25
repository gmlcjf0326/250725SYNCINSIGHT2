'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import { 
  HelpCircle, 
  Book, 
  Keyboard, 
  MessageSquare, 
  FileText, 
  Settings,
  Search,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'SyncInsight는 어떤 서비스인가요?',
    answer: 'SyncInsight는 AI 기반의 지능형 지식관리 시스템입니다. 문서를 업로드하고 AI와 대화하며 지식을 체계적으로 관리할 수 있습니다.',
    category: '일반'
  },
  {
    id: '2',
    question: '문서는 어떤 형식을 지원하나요?',
    answer: 'PDF, DOCX, TXT, MD, HWP 등 다양한 문서 형식을 지원합니다. 최대 50MB까지 업로드 가능합니다.',
    category: '문서'
  },
  {
    id: '3',
    question: 'AI 응답이 느린 경우 어떻게 하나요?',
    answer: '설정에서 응답 속도를 "빠름"으로 변경하거나, 네트워크 연결을 확인해주세요. 문서가 많은 경우 처리 시간이 길어질 수 있습니다.',
    category: 'AI'
  },
  {
    id: '4',
    question: '대화 내용은 어디에 저장되나요?',
    answer: '모든 대화는 로컬 스토리지에 안전하게 저장됩니다. 필요시 내보내기 기능을 통해 백업할 수 있습니다.',
    category: '데이터'
  },
  {
    id: '5',
    question: '폴더와 태그의 차이점은 무엇인가요?',
    answer: '폴더는 계층적 구조로 문서를 정리하는 데 사용되고, 태그는 여러 문서에 중복 적용 가능한 라벨입니다.',
    category: '기능'
  }
]

const shortcuts = [
  { keys: 'Ctrl + N', description: '새 대화 시작' },
  { keys: 'Ctrl + U', description: '문서 업로드' },
  { keys: 'Ctrl + K', description: '빠른 검색' },
  { keys: 'Ctrl + B', description: '사이드바 토글' },
  { keys: 'Ctrl + /', description: '단축키 도움말' },
  { keys: 'Enter', description: '메시지 전송' },
  { keys: 'Shift + Enter', description: '줄바꿈' },
  { keys: 'Esc', description: '모달 닫기' }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const categories = ['전체', '일반', '문서', 'AI', '데이터', '기능']

  const filteredFAQ = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <MainLayout title="도움말">
      <div className="min-h-full bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">도움말 센터</h1>
              <p className="text-lg text-gray-600">SyncInsight 사용에 필요한 모든 정보를 찾아보세요</p>
            </div>

            {/* 검색바 */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="질문을 검색해보세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 사이드바 */}
            <div className="lg:col-span-1">
              {/* 빠른 링크 */}
              <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Book className="h-5 w-5 mr-2 text-primary" />
                  빠른 시작 가이드
                </h3>
                <div className="space-y-3">
                  <Button variant="ghost" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    첫 대화 시작하기
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    문서 업로드하기
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    설정 커스터마이징
                  </Button>
                </div>
              </div>

              {/* 카테고리 필터 */}
              <div className="bg-white rounded-lg border shadow-sm p-6">
                <h3 className="font-semibold mb-4">카테고리</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2">
              {/* FAQ 섹션 */}
              <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">자주 묻는 질문</h2>
                <div className="space-y-4">
                  {filteredFAQ.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg"
                    >
                      <button
                        onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 text-left">
                          <span className="text-sm font-medium text-gray-500">{item.category}</span>
                          <span className="font-medium">{item.question}</span>
                        </div>
                        {expandedFAQ === item.id ? (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                      {expandedFAQ === item.id && (
                        <div className="px-4 pb-4 pt-2 text-gray-600">
                          {item.answer}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* 단축키 가이드 */}
              <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                  <Keyboard className="h-6 w-6 mr-2 text-primary" />
                  키보드 단축키
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shortcuts.map((shortcut) => (
                    <div key={shortcut.keys} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <span className="text-sm text-gray-600">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-white border rounded text-sm font-mono">
                        {shortcut.keys}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* 문의하기 */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <h2 className="text-xl font-bold mb-4">추가 도움이 필요하신가요?</h2>
                <p className="mb-6">전문 상담원이 도와드립니다.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="secondary" className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>이메일 문의</span>
                  </Button>
                  <Button variant="secondary" className="flex items-center justify-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>전화 상담</span>
                  </Button>
                  <Button variant="secondary" className="flex items-center justify-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>온라인 채팅</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}