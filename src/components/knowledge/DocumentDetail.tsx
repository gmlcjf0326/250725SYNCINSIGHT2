'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, Calendar, Tag, Download, Edit, Trash2, 
  Clock, User, Folder, BarChart3, Copy, Check,
  FileType, HardDrive, Eye, Star
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Document } from '@/types'

interface DocumentDetailProps {
  document: Document | null
  open: boolean
  onClose: () => void
  onEdit?: (document: Document) => void
  onDelete?: (documentId: string) => void
}

export default function DocumentDetail({ 
  document, 
  open, 
  onClose, 
  onEdit, 
  onDelete 
}: DocumentDetailProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!document) return null

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'docx': return '📝'
      case 'txt': return '📋'
      case 'md': return '📑'
      case 'hwp': return '📄'
      default: return '📄'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      toast.success(`${field}이(가) 클립보드에 복사되었습니다`)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '초급'
      case 'intermediate': return '중급'
      case 'advanced': return '고급'
      default: return '알 수 없음'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <span className="text-3xl">{getDocumentIcon(document.type)}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold truncate">{document.title}</h2>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <FileType className="h-3 w-3" />
                  <span>{document.type.toUpperCase()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HardDrive className="h-3 w-3" />
                  <span>{formatFileSize(document.fileSize)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(document.uploadDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(document)}>
                <Edit className="h-4 w-4 mr-2" />
                편집
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                다운로드
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete?.(document.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 메타데이터 */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                문서 정보
              </h3>
              
              <div className="space-y-3">
                {/* 상태 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">처리 상태</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${document.processed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm font-medium">
                      {document.processed ? '처리완료' : '처리중'}
                    </span>
                  </div>
                </div>

                {/* 버전 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">버전</span>
                  <span className="text-sm font-medium">v{document.version}</span>
                </div>

                {/* 청크 수 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">청크 수</span>
                  <span className="text-sm font-medium">{document.chunks.length}개</span>
                </div>

                {/* 읽기 시간 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">예상 읽기 시간</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span className="text-sm font-medium">{document.metadata.readingTime}분</span>
                  </div>
                </div>

                {/* 난이도 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">난이도</span>
                  <Badge className={getDifficultyColor(document.metadata.difficulty)}>
                    {getDifficultyText(document.metadata.difficulty)}
                  </Badge>
                </div>

                {/* 액세스 횟수 */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">조회 횟수</span>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span className="text-sm font-medium">{document.metadata.accessCount}회</span>
                  </div>
                </div>

                {/* 마지막 액세스 */}
                {document.metadata.lastAccessed && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">마지막 조회</span>
                    <span className="text-sm font-medium">
                      {formatDate(document.metadata.lastAccessed)}
                    </span>
                  </div>
                )}

                {/* 작성자 */}
                {document.metadata.author && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">작성자</span>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span className="text-sm font-medium">{document.metadata.author}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 태그 및 키워드 */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                태그 및 키워드
              </h3>
              
              {/* 태그 */}
              {document.tags.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 mb-2 block">태그</span>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 키워드 */}
              {document.metadata.keywords.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 mb-2 block">키워드</span>
                  <div className="flex flex-wrap gap-2">
                    {document.metadata.keywords.map(keyword => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 카테고리 */}
              <div>
                <span className="text-sm text-gray-600 mb-2 block">카테고리</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: document.category.color }}
                  />
                  <span className="text-sm font-medium">{document.category.name}</span>
                </div>
              </div>

              {/* 언어 */}
              <div>
                <span className="text-sm text-gray-600 mb-2 block">언어</span>
                <span className="text-sm font-medium">{document.metadata.language}</span>
              </div>
            </div>
          </div>

          <div className="border-t" />

          {/* 요약 */}
          {document.metadata.summary && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  요약
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(document.metadata.summary, '요약')}
                >
                  {copiedField === '요약' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {document.metadata.summary}
                </p>
              </div>
            </div>
          )}

          <div className="border-t" />

          {/* 문서 내용 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                문서 내용
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(document.content, '문서 내용')}
              >
                {copiedField === '문서 내용' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {document.content}
              </pre>
            </div>
          </div>

          {/* 관계 정보 */}
          {document.relationships.length > 0 && (
            <>
              <div className="border-t" />
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Folder className="h-4 w-4 mr-2" />
                  관련 문서
                </h3>
                <div className="space-y-2">
                  {document.relationships.map((rel, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-sm font-medium">관련 문서 ID: {rel.targetDocumentId}</span>
                        <div className="text-xs text-gray-500">
                          관계: {rel.type} | 강도: {Math.round(rel.strength * 100)}%
                        </div>
                        {rel.context && (
                          <div className="text-xs text-gray-600 mt-1">{rel.context}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}