'use client'

import { motion } from "framer-motion"
import { FileText, Calendar, Tag, Eye, Download, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { Document } from "@/types"

interface DocumentListProps {
  documents: Document[]
  onDocumentClick?: (document: Document) => void
}

export default function DocumentList({ documents, onDocumentClick }: DocumentListProps) {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2"
    >
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div className="col-span-5">문서명</div>
        <div className="col-span-2">크기</div>
        <div className="col-span-2">업로드일</div>
        <div className="col-span-2">상태</div>
        <div className="col-span-1">작업</div>
      </div>

      {/* Documents */}
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors group"
        >
          {/* Document Info */}
          <div className="col-span-5 flex items-center space-x-3">
            <div className="text-2xl">
              {getDocumentIcon(doc.type)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm truncate">{doc.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {doc.content.substring(0, 100)}...
              </div>
              {/* Tags */}
              {doc.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {doc.tags.slice(0, 2).map(tag => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 bg-muted rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {doc.tags.length > 2 && (
                    <span className="px-1.5 py-0.5 bg-muted rounded text-xs">
                      +{doc.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* File Size */}
          <div className="col-span-2 flex items-center text-sm">
            {formatFileSize(doc.fileSize)}
          </div>

          {/* Upload Date */}
          <div className="col-span-2 flex items-center text-sm">
            {new Intl.DateTimeFormat('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).format(doc.uploadDate)}
          </div>

          {/* Status */}
          <div className="col-span-2 flex items-center">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${doc.processed ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-sm">
                {doc.processed ? '처리완료' : '처리중'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="col-span-1 flex items-center justify-end">
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => onDocumentClick?.(doc)}
                title="문서 상세보기"
              >
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Download className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Processing Overlay */}
          {!doc.processed && (
            <div className="col-span-12 absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">처리 중...</div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}