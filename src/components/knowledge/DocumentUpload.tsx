'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChatStore } from "@/stores/chatStore"
import { generateId, sleep } from "@/lib/utils"
import type { Document } from "@/types"

interface DocumentUploadProps {
  open: boolean
  onClose: () => void
}

interface UploadFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
}

export default function DocumentUpload({ open, onClose }: DocumentUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  
  const { addDocument } = useChatStore()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/haansofthwp'
    ]

    const validFiles = files.filter(file => {
      const isValidType = allowedTypes.includes(file.type) || 
        file.name.endsWith('.hwp') || 
        file.name.endsWith('.md')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })

    const newUploadFiles: UploadFile[] = validFiles.map(file => ({
      id: generateId(),
      file,
      status: 'pending',
      progress: 0
    }))

    setUploadFiles(prev => [...prev, ...newUploadFiles])
  }

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id))
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const startUpload = async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending')
    
    for (const uploadFile of pendingFiles) {
      try {
        // 업로드 시작
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'uploading', progress: 0 }
            : f
        ))

        // 업로드 진행률 시뮬레이션
        for (let progress = 0; progress <= 100; progress += 20) {
          await sleep(200)
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id 
              ? { ...f, progress }
              : f
          ))
        }

        // 처리 단계
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'processing', progress: 100 }
            : f
        ))

        await sleep(1500) // 처리 시간 시뮬레이션

        // 문서 생성
        const mockContent = `이것은 ${uploadFile.file.name} 파일의 Mock 내용입니다.\n\n파일 정보:\n- 파일명: ${uploadFile.file.name}\n- 크기: ${Math.round(uploadFile.file.size / 1024)}KB\n- 타입: ${uploadFile.file.type}\n\n이 문서는 AI 어시스턴트가 참조할 수 있는 지식베이스에 추가되었습니다.`

        const newDocument: Document = {
          id: generateId(),
          title: uploadFile.file.name.split('.')[0],
          content: mockContent,
          type: getDocumentType(uploadFile.file.name),
          uploadDate: new Date(),
          fileSize: uploadFile.file.size,
          tags: [...tags, getDocumentType(uploadFile.file.name)],
          processed: true,
          chunks: [
            {
              id: generateId(),
              content: mockContent.substring(0, 200),
              documentId: generateId(),
              chunkIndex: 0,
              metadata: { page: 1 }
            }
          ],
          metadata: {
            author: '사용자 업로드',
            keywords: tags,
            summary: `${uploadFile.file.name} 파일의 내용을 포함하는 문서입니다.`,
            language: 'ko',
            readingTime: Math.ceil(mockContent.length / 200),
            difficulty: 'beginner',
            lastAccessed: new Date(),
            accessCount: 0
          },
          relationships: [],
          category: {
            id: 'general',
            name: '일반',
            color: '#6B7280',
            icon: 'FileText'
          },
          version: 1,
          versions: []
        }

        addDocument(newDocument)

        // 완료
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, status: 'completed' }
            : f
        ))

      } catch (error) {
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : '업로드 실패'
              }
            : f
        ))
      }
    }
  }

  const getDocumentType = (filename: string): Document['type'] => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'pdf': return 'pdf'
      case 'doc':
      case 'docx': return 'docx'
      case 'txt': return 'txt'
      case 'md': return 'md'
      case 'hwp': return 'hwp'
      default: return 'txt'
    }
  }

  const getFileIcon = (filename: string) => {
    const type = getDocumentType(filename)
    switch (type) {
      case 'pdf': return '📄'
      case 'docx': return '📝'
      case 'txt': return '📋'
      case 'md': return '📑'
      case 'hwp': return '📄'
      default: return '📄'
    }
  }

  const handleClose = () => {
    if (uploadFiles.some(f => f.status === 'uploading' || f.status === 'processing')) {
      if (!confirm('업로드가 진행 중입니다. 정말 닫으시겠습니까?')) {
        return
      }
    }
    setUploadFiles([])
    setTags([])
    setNewTag('')
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>문서 업로드</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            `}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">파일을 드래그하거나 클릭하여 선택</h3>
            <p className="text-muted-foreground mb-4">
              PDF, Word, 텍스트, 마크다운, 한글 파일 지원 (최대 10MB)
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md,.hwp"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                파일 선택
              </label>
            </Button>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <h4 className="font-medium">태그 (선택사항)</h4>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="태그 입력..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} disabled={!newTag.trim()}>
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted rounded-md text-sm flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* File List */}
          {uploadFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">업로드할 파일</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {uploadFiles.map(uploadFile => (
                    <motion.div
                      key={uploadFile.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-3 p-3 border rounded-lg"
                    >
                      <div className="text-2xl">
                        {getFileIcon(uploadFile.file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {uploadFile.file.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(uploadFile.file.size / 1024)}KB
                        </div>
                        {uploadFile.status === 'uploading' && (
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {uploadFile.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(uploadFile.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {uploadFile.status === 'uploading' && (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                        {uploadFile.status === 'processing' && (
                          <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                        )}
                        {uploadFile.status === 'completed' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {uploadFile.status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={startUpload}
            disabled={uploadFiles.filter(f => f.status === 'pending').length === 0}
          >
            업로드 시작
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}