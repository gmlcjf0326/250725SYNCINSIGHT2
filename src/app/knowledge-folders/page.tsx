'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import { 
  Folder, FolderPlus, MoreVertical, Edit2, Trash2, 
  FileText, Search, Filter, ChevronRight, Check,
  Move, Copy, Download, Upload, Grid, List,
  Tag, Calendar, User, ArrowUpDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { useChatStore } from '@/stores/chatStore'
import type { Folder as FolderType, Document } from '@/types'

interface FolderWithStats extends FolderType {
  documentCount: number
  totalSize: number
  lastModified: Date
}

export default function KnowledgeFoldersPage() {
  const { folders, documents, tags, addFolder, updateFolder, deleteFolder, updateDocument } = useChatStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set())
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [editingFolder, setEditingFolder] = useState<FolderType | null>(null)
  const [movingItems, setMovingItems] = useState<{ documents: string[], targetFolder: string | null }>({ documents: [], targetFolder: null })
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name')
  const [filterTag, setFilterTag] = useState<string>('all')

  // 폴더별 통계 계산
  const getFolderStats = (folder: FolderType): FolderWithStats => {
    const folderDocuments = documents.filter(doc => doc.folderId === folder.id)
    const totalSize = folderDocuments.reduce((sum, doc) => sum + ((doc.metadata as any)?.size || 0), 0)
    const lastModified = folderDocuments.reduce((latest, doc) => {
      const docDate = new Date((doc.metadata as any)?.lastModified || doc.uploadDate)
      return docDate > latest ? docDate : latest
    }, new Date(0))

    return {
      ...folder,
      documentCount: folderDocuments.length,
      totalSize,
      lastModified
    }
  }

  // 필터링된 문서
  const getFilteredDocuments = (folderId: string | null) => {
    return documents.filter(doc => {
      const matchesFolder = folderId === null ? !doc.folderId : doc.folderId === folderId
      const matchesSearch = !searchQuery || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = filterTag === 'all' || doc.tags.includes(filterTag)
      return matchesFolder && matchesSearch && matchesTag
    })
  }

  // 정렬된 폴더
  const sortedFolders = [...folders].sort((a, b) => {
    const statsA = getFolderStats(a)
    const statsB = getFolderStats(b)
    
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'date':
        return statsB.lastModified.getTime() - statsA.lastModified.getTime()
      case 'size':
        return statsB.totalSize - statsA.totalSize
      default:
        return 0
    }
  })

  // 폴더 생성/수정
  const handleSaveFolder = (data: { name: string, description: string, color: string }) => {
    if (editingFolder) {
      updateFolder(editingFolder.id, data)
      toast.success('폴더가 수정되었습니다')
    } else {
      const newFolder = {
        id: `folder-${Date.now()}`,
        name: data.name,
        color: data.color,
        icon: '📁',
        type: 'document' as const,
        createdAt: new Date(),
        order: folders.length
      }
      addFolder(newFolder)
      toast.success('폴더가 생성되었습니다')
    }
    setIsCreateFolderOpen(false)
    setEditingFolder(null)
  }

  // 폴더 삭제
  const handleDeleteFolder = (folderId: string) => {
    const folderDocs = documents.filter(doc => doc.folderId === folderId)
    if (folderDocs.length > 0) {
      toast.error(`이 폴더에는 ${folderDocs.length}개의 문서가 있습니다. 먼저 문서를 이동하거나 삭제해주세요.`)
      return
    }
    deleteFolder(folderId)
    toast.success('폴더가 삭제되었습니다')
  }

  // 문서 이동
  const handleMoveDocuments = () => {
    if (movingItems.documents.length === 0 || !movingItems.targetFolder) return

    movingItems.documents.forEach(docId => {
      updateDocument(docId, { folderId: movingItems.targetFolder! })
    })

    toast.success(`${movingItems.documents.length}개 문서가 이동되었습니다`)
    setSelectedDocuments(new Set())
    setMovingItems({ documents: [], targetFolder: null })
  }

  // 일괄 선택
  const handleSelectAll = (folderId: string | null) => {
    const folderDocs = getFilteredDocuments(folderId)
    const allSelected = folderDocs.every(doc => selectedDocuments.has(doc.id))
    
    if (allSelected) {
      const newSelection = new Set(selectedDocuments)
      folderDocs.forEach(doc => newSelection.delete(doc.id))
      setSelectedDocuments(newSelection)
    } else {
      const newSelection = new Set(selectedDocuments)
      folderDocs.forEach(doc => newSelection.add(doc.id))
      setSelectedDocuments(newSelection)
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
    <MainLayout title="지식베이스 폴더 관리">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 툴바 */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button onClick={() => setIsCreateFolderOpen(true)}>
                <FolderPlus className="h-4 w-4 mr-2" />
                새 폴더
              </Button>
              {selectedDocuments.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {selectedDocuments.size}개 선택됨
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMovingItems({ 
                      documents: Array.from(selectedDocuments), 
                      targetFolder: null 
                    })}
                  >
                    <Move className="h-4 w-4 mr-2" />
                    이동
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedDocuments(new Set())
                      toast.info('선택이 해제되었습니다')
                    }}
                  >
                    선택 해제
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gray-100' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gray-100' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="문서 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="태그 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map(tag => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">이름순</SelectItem>
                <SelectItem value="date">수정일순</SelectItem>
                <SelectItem value="size">크기순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 폴더 및 문서 목록 */}
        <div className="space-y-6">
          {/* 폴더 목록 */}
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
            {sortedFolders.map(folder => {
              const stats = getFolderStats(folder)
              const folderDocs = getFilteredDocuments(folder.id)
              const isExpanded = selectedFolders.has(folder.id)

              return (
                <div key={folder.id}>
                  {viewMode === 'grid' ? (
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 cursor-pointer"
                        onClick={() => {
                          const newSelection = new Set(selectedFolders)
                          if (newSelection.has(folder.id)) {
                            newSelection.delete(folder.id)
                          } else {
                            newSelection.add(folder.id)
                          }
                          setSelectedFolders(newSelection)
                        }}
                      >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: folder.color + '20' }}
                          >
                            <Folder className="h-6 w-6" style={{ color: folder.color }} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{folder.name}</h3>
                            <p className="text-sm text-gray-500">{stats.documentCount}개 문서</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => {
                              setEditingFolder(folder)
                              setIsCreateFolderOpen(true)
                            }}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              수정
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteFolder(folder.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              삭제
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {/* Folder description removed as it's not in the Folder interface */}
                      
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatFileSize(stats.totalSize)}</span>
                          <span>{stats.lastModified.toLocaleDateString()}</span>
                        </div>
                      </motion.div>

                      {/* 그리드 뷰에서도 폴더 내 문서 목록 표시 */}
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden border-t bg-gray-50"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                📁 {folderDocs.length}개 문서
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSelectAll(folder.id)
                                }}
                                className="h-6 px-2 text-xs"
                              >
                                {folderDocs.every(doc => selectedDocuments.has(doc.id)) 
                                  ? '전체 해제' 
                                  : '전체 선택'}
                              </Button>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {folderDocs.map(doc => (
                                <div 
                                  key={doc.id}
                                  className="flex items-center space-x-3 p-2 bg-white rounded-lg hover:bg-gray-50"
                                >
                                  <Checkbox
                                    checked={selectedDocuments.has(doc.id)}
                                    onCheckedChange={(checked) => {
                                      const newSelection = new Set(selectedDocuments)
                                      if (checked) {
                                        newSelection.add(doc.id)
                                      } else {
                                        newSelection.delete(doc.id)
                                      }
                                      setSelectedDocuments(newSelection)
                                    }}
                                  />
                                  <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                                    <p className="text-xs text-gray-500">
                                      {formatFileSize((doc.metadata as any)?.size || 0)} · 
                                      {new Date((doc.metadata as any)?.lastModified || doc.uploadDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {folderDocs.length === 0 && (
                                <div className="text-center py-4 text-gray-500 text-sm">
                                  이 폴더에는 문서가 없습니다.
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          const newSelection = new Set(selectedFolders)
                          if (newSelection.has(folder.id)) {
                            newSelection.delete(folder.id)
                          } else {
                            newSelection.add(folder.id)
                          }
                          setSelectedFolders(newSelection)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <ChevronRight 
                              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                            />
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: folder.color + '20' }}
                            >
                              <Folder className="h-4 w-4" style={{ color: folder.color }} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{folder.name}</h3>
                              <p className="text-sm text-gray-500">
                                {stats.documentCount}개 문서 · {formatFileSize(stats.totalSize)}
                              </p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => {
                                setEditingFolder(folder)
                                setIsCreateFolderOpen(true)
                              }}>
                                <Edit2 className="h-4 w-4 mr-2" />
                                수정
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteFolder(folder.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* 폴더 내 문서 목록 */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden border-t"
                          >
                            <div className="p-4 bg-gray-50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">
                                  {folderDocs.length}개 문서
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSelectAll(folder.id)}
                                >
                                  {folderDocs.every(doc => selectedDocuments.has(doc.id)) 
                                    ? '전체 해제' 
                                    : '전체 선택'}
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {folderDocs.map(doc => (
                                  <div 
                                    key={doc.id}
                                    className="flex items-center space-x-3 p-2 bg-white rounded-lg"
                                  >
                                    <Checkbox
                                      checked={selectedDocuments.has(doc.id)}
                                      onCheckedChange={(checked) => {
                                        const newSelection = new Set(selectedDocuments)
                                        if (checked) {
                                          newSelection.add(doc.id)
                                        } else {
                                          newSelection.delete(doc.id)
                                        }
                                        setSelectedDocuments(newSelection)
                                      }}
                                    />
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <div className="flex-1">
                                      <p className="text-sm font-medium">{doc.title}</p>
                                      <p className="text-xs text-gray-500">
                                        {formatFileSize((doc.metadata as any)?.size || 0)} · 
                                        {new Date((doc.metadata as any)?.lastModified || doc.uploadDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* 미분류 문서 */}
          {getFilteredDocuments(null).length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">미분류 문서</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {getFilteredDocuments(null).length}개 문서
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectAll(null)}
                  >
                    전체 선택
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {getFilteredDocuments(null).map(doc => (
                    <div 
                      key={doc.id}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg"
                    >
                      <Checkbox
                        checked={selectedDocuments.has(doc.id)}
                        onCheckedChange={(checked) => {
                          const newSelection = new Set(selectedDocuments)
                          if (checked) {
                            newSelection.add(doc.id)
                          } else {
                            newSelection.delete(doc.id)
                          }
                          setSelectedDocuments(newSelection)
                        }}
                      />
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{doc.title}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize((doc.metadata as any)?.size || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 폴더 생성/수정 모달 */}
        <Dialog open={isCreateFolderOpen} onOpenChange={(open) => {
          setIsCreateFolderOpen(open)
          if (!open) setEditingFolder(null)
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFolder ? '폴더 수정' : '새 폴더 만들기'}
              </DialogTitle>
            </DialogHeader>
            <FolderForm
              folder={editingFolder}
              onSubmit={handleSaveFolder}
              onCancel={() => {
                setIsCreateFolderOpen(false)
                setEditingFolder(null)
              }}
            />
          </DialogContent>
        </Dialog>

        {/* 문서 이동 모달 */}
        <Dialog 
          open={movingItems.documents.length > 0} 
          onOpenChange={(open) => {
            if (!open) setMovingItems({ documents: [], targetFolder: null })
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>문서 이동</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {movingItems.documents.length}개 문서를 이동할 폴더를 선택하세요.
              </p>
              <div className="space-y-2">
                {folders.map(folder => (
                  <label
                    key={folder.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="targetFolder"
                      value={folder.id}
                      checked={movingItems.targetFolder === folder.id}
                      onChange={() => setMovingItems(prev => ({ ...prev, targetFolder: folder.id }))}
                    />
                    <Folder className="h-4 w-4" style={{ color: folder.color }} />
                    <span>{folder.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMovingItems({ documents: [], targetFolder: null })}>
                취소
              </Button>
              <Button 
                onClick={handleMoveDocuments}
                disabled={!movingItems.targetFolder}
              >
                이동하기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}

// 폴더 폼 컴포넌트
function FolderForm({ 
  folder, 
  onSubmit, 
  onCancel 
}: { 
  folder: FolderType | null
  onSubmit: (data: { name: string, description: string, color: string }) => void
  onCancel: () => void
}) {
  const [name, setName] = useState(folder?.name || '')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(folder?.color || '#3B82F6')

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#6366F1', '#F97316', '#06B6D4'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('폴더 이름을 입력해주세요')
      return
    }
    onSubmit({ name, description, color })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="folder-name">폴더 이름</Label>
        <Input
          id="folder-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 프로젝트 문서"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="folder-description">설명 (선택사항)</Label>
        <Input
          id="folder-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="폴더에 대한 간단한 설명"
          className="mt-1"
        />
      </div>

      <div>
        <Label>폴더 색상</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {colors.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`w-full h-10 rounded-lg border-2 transition-all ${
                color === c ? 'border-gray-900 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            >
              {color === c && <Check className="h-4 w-4 text-white mx-auto" />}
            </button>
          ))}
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">
          {folder ? '수정하기' : '만들기'}
        </Button>
      </DialogFooter>
    </form>
  )
}