'use client'

import { Button } from "@/components/ui/button"
import { X, FileText, ExternalLink, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import type { Message, DocumentSource } from "@/types"
import { useState, useMemo } from "react"

interface SourcePanelProps {
  messages: Message[]
  onClose: () => void
}

export default function SourcePanel({ messages, onClose }: SourcePanelProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // 모든 메시지에서 출처 추출
  const allSources = useMemo(() => {
    const sources: DocumentSource[] = []
    messages.forEach(message => {
      if (message.sources) {
        sources.push(...message.sources)
      }
    })
    
    // 중복 제거 (ID 기준)
    const uniqueSources = sources.filter((source, index, self) =>
      self.findIndex(s => s.id === source.id) === index
    )
    
    // 관련도 순으로 정렬
    return uniqueSources.sort((a, b) => b.relevanceScore - a.relevanceScore)
  }, [messages])

  // 검색 필터링
  const filteredSources = allSources.filter(source =>
    source.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    source.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDocumentIcon = (type: DocumentSource['documentType']) => {
    switch (type) {
      case 'pdf':
        return '📄'
      case 'docx':
        return '📝'
      case 'txt':
        return '📋'
      case 'md':
        return '📑'
      case 'hwp':
        return '📄'
      default:
        return '📄'
    }
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.7) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full bg-background flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span className="font-semibold">참고 자료</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="자료 검색..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="p-4 border-b bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{allSources.length}</div>
            <div className="text-xs text-muted-foreground">참조 문서</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {allSources.length > 0 ? Math.round(allSources.reduce((sum, s) => sum + s.relevanceScore, 0) / allSources.length * 100) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">평균 관련도</div>
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredSources.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {allSources.length === 0 ? '아직 참고 자료가 없습니다' : '검색 결과가 없습니다'}
            </p>
            <p className="text-xs">
              {allSources.length === 0 ? 'AI와 대화를 시작해보세요' : '다른 키워드로 검색해보세요'}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredSources.map((source, index) => (
              <motion.div
                key={`${source.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 rounded-lg border bg-background mb-2 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">
                    {getDocumentIcon(source.documentType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {source.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                      {source.excerpt}
                    </p>
                    
                    {/* Metadata */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span className="uppercase">{source.documentType}</span>
                        {source.page && (
                          <>
                            <span>•</span>
                            <span>p.{source.page}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className={`text-xs font-medium ${getRelevanceColor(source.relevanceScore)}`}>
                          {Math.round(source.relevanceScore * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        원문 보기
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">빠른 작업</div>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <FileText className="h-4 w-4 mr-2" />
          모든 문서 보기
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Search className="h-4 w-4 mr-2" />
          고급 검색
        </Button>
      </div>
    </motion.div>
  )
}