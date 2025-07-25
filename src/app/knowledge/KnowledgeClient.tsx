'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Search, FileText, Trash2, Eye, Download, Filter, Grid, List, ArrowLeft, Network, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChatStore } from "@/stores/chatStore"
import DocumentUpload from "@/components/knowledge/DocumentUpload"
import DocumentGrid from "@/components/knowledge/DocumentGrid"
import DocumentList from "@/components/knowledge/DocumentList"
import DocumentDetail from "@/components/knowledge/DocumentDetail"
import AdvancedKnowledgeGraph from "@/components/knowledge/AdvancedKnowledgeGraph"
import KnowledgeAnalytics from "@/components/analytics/KnowledgeAnalytics"
import ClientOnly from '@/components/ClientOnly'
import type { Document } from "@/types"
import { toast } from 'sonner'

const tabs = [
  { id: 'documents', name: '문서 관리', icon: FileText },
  { id: 'graph', name: '지식 그래프', icon: Network },
  { id: 'analytics', name: '통계', icon: BarChart3 }
]

export default function KnowledgeClient() {
  const [activeTab, setActiveTab] = useState('documents')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [documentDetailOpen, setDocumentDetailOpen] = useState(false)
  const searchParams = useSearchParams()
  
  const { documents, searchDocuments, removeDocument } = useChatStore()
  
  // URL 파라미터 처리
  useEffect(() => {
    const action = searchParams.get('action')
    const documentId = searchParams.get('document')
    const tagId = searchParams.get('tag')
    const folderId = searchParams.get('folder')
    
    if (action === 'upload') {
      setUploadOpen(true)
    }
    
    if (tagId) {
      setSelectedTag(tagId)
    }
    
    if (documentId) {
      // 특정 문서로 스크롤
      const element = document.getElementById(`doc-${documentId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.classList.add('ring-2', 'ring-primary')
        setTimeout(() => element.classList.remove('ring-2', 'ring-primary'), 3000)
      }
    }
  }, [searchParams])

  // 검색 및 필터링
  const filteredDocuments = searchQuery 
    ? searchDocuments(searchQuery)
    : documents

  const finalDocuments = selectedTag
    ? filteredDocuments.filter(doc => doc.tags.includes(selectedTag))
    : filteredDocuments

  // 모든 태그 추출
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags)))

  // 문서 클릭 핸들러
  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document)
    setDocumentDetailOpen(true)
  }

  // 문서 상세 닫기
  const handleDocumentDetailClose = () => {
    setDocumentDetailOpen(false)
    setSelectedDocument(null)
  }

  const renderDocumentsTab = () => (
    <>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="문서 제목이나 내용으로 검색..."
            className="pl-9"
          />
        </div>

        {/* Tag Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedTag || ''}
            onChange={(e) => setSelectedTag(e.target.value || null)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="">모든 태그</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {/* View Mode */}
        <div className="flex items-center space-x-1 border rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">{documents.length}</div>
          <div className="text-sm text-muted-foreground">총 문서</div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {documents.filter(doc => doc.processed).length}
          </div>
          <div className="text-sm text-muted-foreground">처리 완료</div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">{allTags.length}</div>
          <div className="text-sm text-muted-foreground">태그</div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {Math.round(documents.reduce((sum, doc) => sum + doc.fileSize, 0) / 1024 / 1024 * 100) / 100}MB
          </div>
          <div className="text-sm text-muted-foreground">총 용량</div>
        </div>
      </div>

      {/* Documents */}
      <div className="min-h-[400px]">
        {finalDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || selectedTag ? '검색 결과가 없습니다' : '문서가 없습니다'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedTag 
                ? '다른 키워드로 검색해보세요'
                : '첫 번째 문서를 업로드해보세요'
              }
            </p>
            {!searchQuery && !selectedTag && (
              <Button onClick={() => setUploadOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                문서 업로드
              </Button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <DocumentGrid 
                key="grid" 
                documents={finalDocuments} 
                onDocumentClick={handleDocumentClick}
              />
            ) : (
              <DocumentList 
                key="list" 
                documents={finalDocuments} 
                onDocumentClick={handleDocumentClick}
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </>
  )

  const renderGraphTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">지식 그래프</h3>
        <p className="text-muted-foreground">
          문서, 폴더, 태그 간의 관계를 시각적으로 탐색하세요
        </p>
      </div>
      <AdvancedKnowledgeGraph height={600} />
    </div>
  )

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">지식베이스 분석</h3>
        <p className="text-muted-foreground">
          문서 사용 패턴과 연관성을 분석합니다
        </p>
      </div>
      
      <KnowledgeAnalytics />
    </div>
  )

  return (
    <>
      {/* 툴바 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">지식베이스</h1>
              <p className="text-sm text-gray-500">문서를 관리하고 AI 학습을 위해 업로드하세요</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => setUploadOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                문서 업로드
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'documents' && renderDocumentsTab()}
            {activeTab === 'graph' && renderGraphTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Upload Modal */}
      <DocumentUpload 
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
      />

      {/* Document Detail Modal */}
      <DocumentDetail
        document={selectedDocument}
        open={documentDetailOpen}
        onClose={handleDocumentDetailClose}
        onEdit={(doc) => {
          // 문서 편집 기능 - 실제 환경에서는 편집 모달 열기
          toast.info('문서 편집 기능은 준비 중입니다')
        }}
        onDelete={(docId) => {
          // 문서 삭제 기능
          if (confirm('이 문서를 삭제하시겠습니까?')) {
            removeDocument(docId)
            toast.success('문서가 삭제되었습니다')
            handleDocumentDetailClose()
          }
        }}
      />
    </>
  )
}