'use client'

import { motion } from "framer-motion"
import { FileText, Calendar, Tag, Eye, Download, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import type { Document } from "@/types"

interface DocumentGridProps {
  documents: Document[]
  onDocumentClick?: (document: Document) => void
}

export default function DocumentGrid({ documents, onDocumentClick }: DocumentGridProps) {
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
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {documents.map((doc, index) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group relative bg-background border rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="text-3xl">
              {getDocumentIcon(doc.type)}
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
            {doc.title}
          </h3>

          {/* Content Preview */}
          <p className="text-xs text-muted-foreground line-clamp-3 mb-3 min-h-[3rem]">
            {doc.content}
          </p>

          {/* Tags */}
          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {doc.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-muted rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {doc.tags.length > 3 && (
                <span className="px-2 py-1 bg-muted rounded text-xs">
                  +{doc.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-1 text-xs text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(doc.uploadDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{formatFileSize(doc.fileSize)}</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${doc.processed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span>{doc.processed ? '처리완료' : '처리중'}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
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
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Processing Overlay */}
          {!doc.processed && (
            <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <div className="text-xs text-muted-foreground">처리 중...</div>
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  )
}