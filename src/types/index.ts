export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  sources?: DocumentSource[]
  confidence?: number
  processing?: boolean
  attachments?: MessageAttachment[]
  reactions?: MessageReaction[]
  edited?: boolean
  parentId?: string // For message threading/branching
}

export interface MessageAttachment {
  id: string
  name: string
  type: 'image' | 'file' | 'code'
  size: number
  url: string
  mimeType?: string
}

export interface MessageReaction {
  type: 'like' | 'dislike' | 'bookmark'
  userId: string
  timestamp: Date
}

export interface DocumentSource {
  id: string
  title: string
  excerpt: string
  relevanceScore: number
  documentType: 'pdf' | 'docx' | 'txt' | 'md' | 'hwp'
  page?: number
  url?: string
  highlight?: string
  contextBefore?: string
  contextAfter?: string
}

export interface Document {
  id: string
  title: string
  content: string
  type: DocumentSource['documentType']
  uploadDate: Date
  fileSize: number
  tags: string[]
  processed: boolean
  chunks: DocumentChunk[]
  folderId?: string
  category: DocumentCategory
  metadata: DocumentMetadata
  relationships: DocumentRelationship[]
  version: number
  versions: DocumentVersion[]
}

export interface DocumentCategory {
  id: string
  name: string
  color: string
  icon: string
}

export interface DocumentMetadata {
  author?: string
  keywords: string[]
  summary: string
  language: string
  readingTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lastAccessed?: Date
  accessCount: number
}

export interface DocumentRelationship {
  targetDocumentId: string
  type: 'reference' | 'similar' | 'prerequisite' | 'followup'
  strength: number // 0-1
  context?: string
}

export interface DocumentVersion {
  id: string
  version: number
  changes: string
  timestamp: Date
  userId: string
}

export interface DocumentChunk {
  id: string
  content: string
  documentId: string
  chunkIndex: number
  embedding?: number[]
  metadata: {
    page?: number
    section?: string
    headings?: string[]
  }
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  folderId?: string
  tags: string[]
  pinned: boolean
  archived: boolean
  shared: boolean
  category: ConversationCategory
  summary?: string
  rating?: number
}

export interface ConversationCategory {
  id: string
  name: string
  color: string
  icon: string
}

export interface Folder {
  id: string
  name: string
  color: string
  icon: string
  parentId?: string
  type: 'conversation' | 'document'
  createdAt: Date
  order: number
}

export interface Tag {
  id: string
  name: string
  color: string
  count: number
  category: 'auto' | 'manual'
  createdAt: Date
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin'
  preferences: UserPreferences
  stats: UserStats
  createdAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'ko' | 'en'
  timezone: string
  notifications: NotificationSettings
  ui: UIPreferences
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  documentUpdates: boolean
  conversationReplies: boolean
}

export interface UIPreferences {
  sidebarCollapsed: boolean
  showSourcePanel: boolean
  messageAnimation: boolean
  compactMode: boolean
  showTimestamps: boolean
}

export interface UserStats {
  totalConversations: number
  totalMessages: number
  totalDocuments: number
  averageSessionTime: number
  mostUsedTags: string[]
  documentsUploaded: number
  lastActiveAt: Date
}

export interface ChatSettings {
  model: string
  temperature: number
  maxTokens: number
  responseSpeed: 'slow' | 'normal' | 'fast'
  showSources: boolean
  showConfidence: boolean
  streamResponse: boolean
  contextWindow: number
  customPrompt?: string
}

// Analytics and Insights
export interface UsageAnalytics {
  period: 'day' | 'week' | 'month' | 'year'
  conversationCount: number
  messageCount: number
  documentAccess: DocumentAccessStat[]
  popularTags: TagStat[]
  peakUsageHours: number[]
  averageResponseTime: number
}

export interface DocumentAccessStat {
  documentId: string
  title: string
  accessCount: number
  lastAccessed: Date
  avgRelevanceScore: number
}

export interface TagStat {
  tagId: string
  name: string
  usageCount: number
  trend: 'up' | 'down' | 'stable'
}

// Search and Filtering
export interface SearchQuery {
  text: string
  filters: SearchFilters
  sort: SearchSort
}

export interface SearchFilters {
  tags?: string[]
  folders?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  type?: ('conversation' | 'document')[]
  categories?: string[]
}

export interface SearchSort {
  field: 'relevance' | 'date' | 'title' | 'rating'
  order: 'asc' | 'desc'
}

export interface SearchResult {
  id: string
  type: 'conversation' | 'document'
  title: string
  excerpt: string
  relevanceScore: number
  matchedTerms: string[]
  metadata: Record<string, any>
}