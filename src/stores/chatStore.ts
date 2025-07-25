import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  Message, 
  Conversation, 
  Document, 
  ChatSettings, 
  User, 
  Folder, 
  Tag, 
  SearchQuery, 
  SearchResult,
  UsageAnalytics
} from '@/types'
import { mockConversations, mockDocuments, mockUser, mockFolders, mockTags } from '@/lib/mockData'
import { deserializeDates } from '@/lib/dateHelpers'

interface ChatStore {
  // Core State
  conversations: Conversation[]
  currentConversationId: string | null
  documents: Document[]
  settings: ChatSettings
  user: User
  folders: Folder[]
  tags: Tag[]
  
  // UI State
  sidebarCollapsed: boolean
  sourcePanelOpen: boolean
  selectedItems: string[]
  searchQuery: string
  activeFilter: string | null
  
  // Actions - Conversations
  addConversation: (conversation: Conversation) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  deleteConversation: (id: string) => void
  deleteConversations: (ids: string[]) => void
  setCurrentConversation: (id: string | null) => void
  pinConversation: (id: string) => void
  archiveConversation: (id: string) => void
  shareConversation: (id: string) => void
  moveConversationToFolder: (conversationId: string, folderId: string | null) => void
  addTagToConversation: (conversationId: string, tagId: string) => void
  removeTagFromConversation: (conversationId: string, tagId: string) => void
  rateConversation: (id: string, rating: number) => void
  
  // Actions - Messages
  addMessage: (conversationId: string, message: Message) => void
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void
  deleteMessage: (conversationId: string, messageId: string) => void
  regenerateMessage: (conversationId: string, messageId: string) => void
  branchMessage: (conversationId: string, messageId: string, newContent: string) => void
  addReaction: (conversationId: string, messageId: string, type: 'like' | 'dislike' | 'bookmark') => void
  
  // Actions - Documents
  addDocument: (document: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  removeDocument: (id: string) => void
  removeDocuments: (ids: string[]) => void
  moveDocumentToFolder: (documentId: string, folderId: string | null) => void
  addTagToDocument: (documentId: string, tagId: string) => void
  removeTagFromDocument: (documentId: string, tagId: string) => void
  
  // Actions - Folders
  addFolder: (folder: Folder) => void
  updateFolder: (id: string, updates: Partial<Folder>) => void
  deleteFolder: (id: string) => void
  moveFolder: (folderId: string, parentId: string | null) => void
  reorderFolders: (folderIds: string[]) => void
  
  // Actions - Tags
  addTag: (tag: Tag) => void
  updateTag: (id: string, updates: Partial<Tag>) => void
  deleteTag: (id: string) => void
  mergeTag: (fromTagId: string, toTagId: string) => void
  
  // Actions - Settings & User
  updateSettings: (settings: Partial<ChatSettings>) => void
  updateUser: (updates: Partial<User>) => void
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void
  
  // Actions - UI State
  setSidebarCollapsed: (collapsed: boolean) => void
  setSourcePanelOpen: (open: boolean) => void
  setSelectedItems: (items: string[]) => void
  addSelectedItem: (id: string) => void
  removeSelectedItem: (id: string) => void
  clearSelection: () => void
  setSearchQuery: (query: string) => void
  setActiveFilter: (filter: string | null) => void
  
  // Utilities - Search & Filter
  getCurrentConversation: () => Conversation | null
  searchConversations: (query: string) => Conversation[]
  searchDocuments: (query: string) => Document[]
  searchAll: (query: SearchQuery) => SearchResult[]
  getConversationsByFolder: (folderId: string | null) => Conversation[]
  getDocumentsByFolder: (folderId: string | null) => Document[]
  getConversationsByTag: (tagId: string) => Conversation[]
  getDocumentsByTag: (tagId: string) => Document[]
  getFolderTree: (type: 'conversation' | 'document') => Folder[]
  
  // Utilities - Analytics
  getUsageAnalytics: (period: 'day' | 'week' | 'month' | 'year') => UsageAnalytics
  getPopularDocuments: (limit?: number) => Document[]
  getRecentActivity: (limit?: number) => Array<{type: string, item: any, timestamp: Date}>
  
  // Utilities - Relationships
  getRelatedDocuments: (documentId: string) => Document[]
  getSimilarConversations: (conversationId: string) => Conversation[]
  getDocumentConnections: (documentId: string) => Array<{document: Document, strength: number}>
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial State
      conversations: mockConversations,
      currentConversationId: null,
      documents: mockDocuments,
      settings: {
        model: 'gemini-flash-3.5',
        temperature: 0.7,
        maxTokens: 2000,
        responseSpeed: 'normal',
        showSources: true,
        showConfidence: true,
        streamResponse: true,
        contextWindow: 4000,
        customPrompt: undefined
      },
      user: mockUser,
      folders: mockFolders,
      tags: mockTags,
      
      // UI State
      sidebarCollapsed: false,
      sourcePanelOpen: false,
      selectedItems: [],
      searchQuery: '',
      activeFilter: null,

      // Actions - Conversations
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations]
        })),

      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, ...updates, updatedAt: new Date() } : conv
          )
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
          currentConversationId: state.currentConversationId === id ? null : state.currentConversationId
        })),

      deleteConversations: (ids) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => !ids.includes(conv.id)),
          currentConversationId: ids.includes(state.currentConversationId || '') 
            ? null : state.currentConversationId
        })),

      setCurrentConversation: (id) =>
        set({ currentConversationId: id }),

      pinConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
          )
        })),

      archiveConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, archived: !conv.archived } : conv
          )
        })),

      shareConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, shared: !conv.shared } : conv
          )
        })),

      moveConversationToFolder: (conversationId, folderId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId ? { ...conv, folderId: folderId || undefined } : conv
          )
        })),

      addTagToConversation: (conversationId, tagId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId && !conv.tags.includes(tagId)
              ? { ...conv, tags: [...conv.tags, tagId] }
              : conv
          ),
          tags: state.tags.map((tag) =>
            tag.id === tagId ? { ...tag, count: tag.count + 1 } : tag
          )
        })),

      removeTagFromConversation: (conversationId, tagId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? { ...conv, tags: conv.tags.filter((t) => t !== tagId) }
              : conv
          ),
          tags: state.tags.map((tag) =>
            tag.id === tagId ? { ...tag, count: Math.max(0, tag.count - 1) } : tag
          )
        })),

      rateConversation: (id, rating) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, rating } : conv
          )
        })),

      // Actions - Messages
      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date()
                }
              : conv
          )
        })),

      updateMessage: (conversationId, messageId, updates) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date()
                }
              : conv
          )
        })),

      deleteMessage: (conversationId, messageId) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.filter((msg) => msg.id !== messageId),
                  updatedAt: new Date()
                }
              : conv
          )
        })),

      regenerateMessage: (conversationId, messageId) => {
        // Implementation for regenerating message
        const state = get()
        const conversation = state.conversations.find((c) => c.id === conversationId)
        if (conversation) {
          const messageIndex = conversation.messages.findIndex((m) => m.id === messageId)
          if (messageIndex > 0) {
            // Trigger regeneration logic here
            set((state) => ({
              conversations: state.conversations.map((conv) =>
                conv.id === conversationId
                  ? {
                      ...conv,
                      messages: conv.messages.map((msg) =>
                        msg.id === messageId ? { ...msg, processing: true } : msg
                      )
                    }
                  : conv
              )
            }))
          }
        }
      },

      branchMessage: (conversationId, messageId, newContent) => {
        // Create a new branch from this message
        const state = get()
        const conversation = state.conversations.find((c) => c.id === conversationId)
        if (conversation) {
          const messageIndex = conversation.messages.findIndex((m) => m.id === messageId)
          const newMessage: Message = {
            id: Date.now().toString(),
            content: newContent,
            role: 'user',
            timestamp: new Date(),
            parentId: messageId
          }
          
          set((state) => ({
            conversations: state.conversations.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    messages: [
                      ...conv.messages.slice(0, messageIndex + 1),
                      newMessage
                    ]
                  }
                : conv
            )
          }))
        }
      },

      addReaction: (conversationId, messageId, type) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map((msg) =>
                    msg.id === messageId
                      ? {
                          ...msg,
                          reactions: [
                            ...(msg.reactions || []).filter((r) => r.type !== type),
                            { type, userId: state.user.id, timestamp: new Date() }
                          ]
                        }
                      : msg
                  )
                }
              : conv
          )
        })),

      // Actions - Documents
      addDocument: (document) =>
        set((state) => ({
          documents: [document, ...state.documents]
        })),

      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          )
        })),

      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id)
        })),

      removeDocuments: (ids) =>
        set((state) => ({
          documents: state.documents.filter((doc) => !ids.includes(doc.id))
        })),

      moveDocumentToFolder: (documentId, folderId) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === documentId ? { ...doc, folderId: folderId || undefined } : doc
          )
        })),

      addTagToDocument: (documentId, tagId) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === documentId && !doc.tags.includes(tagId)
              ? { ...doc, tags: [...doc.tags, tagId] }
              : doc
          ),
          tags: state.tags.map((tag) =>
            tag.id === tagId ? { ...tag, count: tag.count + 1 } : tag
          )
        })),

      removeTagFromDocument: (documentId, tagId) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === documentId
              ? { ...doc, tags: doc.tags.filter((t) => t !== tagId) }
              : doc
          ),
          tags: state.tags.map((tag) =>
            tag.id === tagId ? { ...tag, count: Math.max(0, tag.count - 1) } : tag
          )
        })),

      // Actions - Folders
      addFolder: (folder) =>
        set((state) => ({
          folders: [...state.folders, folder]
        })),

      updateFolder: (id, updates) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === id ? { ...folder, ...updates } : folder
          )
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== id),
          conversations: state.conversations.map((conv) =>
            conv.folderId === id ? { ...conv, folderId: undefined } : conv
          ),
          documents: state.documents.map((doc) =>
            doc.folderId === id ? { ...doc, folderId: undefined } : doc
          )
        })),

      moveFolder: (folderId, parentId) =>
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId ? { ...folder, parentId: parentId || undefined } : folder
          )
        })),

      reorderFolders: (folderIds) =>
        set((state) => ({
          folders: state.folders.map((folder, index) =>
            folderIds.includes(folder.id)
              ? { ...folder, order: folderIds.indexOf(folder.id) }
              : folder
          )
        })),

      // Actions - Tags
      addTag: (tag) =>
        set((state) => ({
          tags: [...state.tags, tag]
        })),

      updateTag: (id, updates) =>
        set((state) => ({
          tags: state.tags.map((tag) =>
            tag.id === id ? { ...tag, ...updates } : tag
          )
        })),

      deleteTag: (id) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          conversations: state.conversations.map((conv) => ({
            ...conv,
            tags: conv.tags.filter((tagId) => tagId !== id)
          })),
          documents: state.documents.map((doc) => ({
            ...doc,
            tags: doc.tags.filter((tagId) => tagId !== id)
          }))
        })),

      mergeTag: (fromTagId, toTagId) =>
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== fromTagId),
          conversations: state.conversations.map((conv) => ({
            ...conv,
            tags: conv.tags.map((tagId) => (tagId === fromTagId ? toTagId : tagId))
          })),
          documents: state.documents.map((doc) => ({
            ...doc,
            tags: doc.tags.map((tagId) => (tagId === fromTagId ? toTagId : tagId))
          }))
        })),

      // Actions - Settings & User
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates }
        })),

      updateUserPreferences: (preferences) =>
        set((state) => ({
          user: {
            ...state.user,
            preferences: { ...state.user.preferences, ...preferences }
          }
        })),

      // Actions - UI State
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      setSourcePanelOpen: (open) =>
        set({ sourcePanelOpen: open }),

      setSelectedItems: (items) =>
        set({ selectedItems: items }),

      addSelectedItem: (id) =>
        set((state) => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems
            : [...state.selectedItems, id]
        })),

      removeSelectedItem: (id) =>
        set((state) => ({
          selectedItems: state.selectedItems.filter((item) => item !== id)
        })),

      clearSelection: () =>
        set({ selectedItems: [] }),

      setSearchQuery: (query) =>
        set({ searchQuery: query }),

      setActiveFilter: (filter) =>
        set({ activeFilter: filter }),

      // Utilities - Search & Filter
      getCurrentConversation: () => {
        const state = get()
        return state.conversations.find((conv) => conv.id === state.currentConversationId) || null
      },

      searchConversations: (query) => {
        const state = get()
        const lowercaseQuery = query.toLowerCase()
        return state.conversations.filter(
          (conv) =>
            conv.title.toLowerCase().includes(lowercaseQuery) ||
            conv.summary?.toLowerCase().includes(lowercaseQuery) ||
            conv.messages.some((msg) =>
              msg.content.toLowerCase().includes(lowercaseQuery)
            )
        )
      },

      searchDocuments: (query) => {
        const state = get()
        const lowercaseQuery = query.toLowerCase()
        return state.documents.filter(
          (doc) =>
            doc.title.toLowerCase().includes(lowercaseQuery) ||
            doc.content.toLowerCase().includes(lowercaseQuery) ||
            doc.metadata?.summary?.toLowerCase().includes(lowercaseQuery) ||
            doc.tags.some((tagId) => {
              const tag = state.tags.find((t) => t.id === tagId)
              return tag?.name.toLowerCase().includes(lowercaseQuery)
            })
        )
      },

      searchAll: (query) => {
        const state = get()
        const conversations = state.searchConversations(query.text)
        const documents = state.searchDocuments(query.text)
        
        const results: SearchResult[] = [
          ...conversations.map((conv) => ({
            id: conv.id,
            type: 'conversation' as const,
            title: conv.title,
            excerpt: conv.summary || conv.messages[0]?.content.slice(0, 150) + '...' || '',
            relevanceScore: 0.8,
            matchedTerms: [query.text],
            metadata: { updatedAt: conv.updatedAt, messageCount: conv.messages.length }
          })),
          ...documents.map((doc) => ({
            id: doc.id,
            type: 'document' as const,
            title: doc.title,
            excerpt: doc.metadata?.summary || '',
            relevanceScore: 0.9,
            matchedTerms: [query.text],
            metadata: { uploadDate: doc.uploadDate, fileSize: doc.fileSize, type: doc.type }
          }))
        ]
        
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore)
      },

      getConversationsByFolder: (folderId) => {
        const state = get()
        return state.conversations.filter((conv) => conv.folderId === folderId)
      },

      getDocumentsByFolder: (folderId) => {
        const state = get()
        return state.documents.filter((doc) => doc.folderId === folderId)
      },

      getConversationsByTag: (tagId) => {
        const state = get()
        return state.conversations.filter((conv) => conv.tags.includes(tagId))
      },

      getDocumentsByTag: (tagId) => {
        const state = get()
        return state.documents.filter((doc) => doc.tags.includes(tagId))
      },

      getFolderTree: (type) => {
        const state = get()
        return state.folders
          .filter((folder) => folder.type === type)
          .sort((a, b) => a.order - b.order)
      },

      // Utilities - Analytics
      getUsageAnalytics: (period) => {
        const state = get()
        const now = new Date()
        let startDate: Date

        switch (period) {
          case 'day':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            break
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          case 'year':
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            break
        }

        const recentConversations = state.conversations.filter(
          (conv) => conv.createdAt >= startDate
        )

        const totalMessages = recentConversations.reduce(
          (sum, conv) => sum + conv.messages.length,
          0
        )

        return {
          period,
          conversationCount: recentConversations.length,
          messageCount: totalMessages,
          documentAccess: state.documents
            .filter((doc) => doc.metadata?.lastAccessed && doc.metadata.lastAccessed >= startDate)
            .map((doc) => ({
              documentId: doc.id,
              title: doc.title,
              accessCount: doc.metadata?.accessCount || 0,
              lastAccessed: doc.metadata?.lastAccessed || new Date(),
              avgRelevanceScore: 0.8
            })),
          popularTags: state.tags
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map((tag) => ({
              tagId: tag.id,
              name: tag.name,
              usageCount: tag.count,
              trend: 'stable' as const
            })),
          peakUsageHours: [9, 10, 14, 15, 16, 20],
          averageResponseTime: 1200
        }
      },

      getPopularDocuments: (limit = 10) => {
        const state = get()
        return state.documents
          .sort((a, b) => (b.metadata?.accessCount || 0) - (a.metadata?.accessCount || 0))
          .slice(0, limit)
      },

      getRecentActivity: (limit = 20) => {
        const state = get()
        const activities: Array<{type: string, item: any, timestamp: Date}> = []
        
        state.conversations.forEach((conv) => {
          activities.push({
            type: 'conversation',
            item: conv,
            timestamp: conv.updatedAt
          })
        })
        
        state.documents.forEach((doc) => {
          activities.push({
            type: 'document',
            item: doc,
            timestamp: doc.uploadDate
          })
        })
        
        return activities
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit)
      },

      // Utilities - Relationships
      getRelatedDocuments: (documentId) => {
        const state = get()
        const document = state.documents.find((doc) => doc.id === documentId)
        if (!document) return []
        
        return document.relationships
          .map((rel) => {
            const relatedDoc = state.documents.find((doc) => doc.id === rel.targetDocumentId)
            return relatedDoc ? { ...relatedDoc, relationshipStrength: rel.strength } : null
          })
          .filter(Boolean) as Document[]
      },

      getSimilarConversations: (conversationId) => {
        const state = get()
        const conversation = state.conversations.find((conv) => conv.id === conversationId)
        if (!conversation) return []
        
        // Simple similarity based on shared tags
        return state.conversations
          .filter((conv) => conv.id !== conversationId)
          .filter((conv) => conv.tags.some((tag) => conversation.tags.includes(tag)))
          .slice(0, 5)
      },

      getDocumentConnections: (documentId) => {
        const state = get()
        const document = state.documents.find((doc) => doc.id === documentId)
        if (!document) return []
        
        return document.relationships.map((rel) => {
          const relatedDoc = state.documents.find((doc) => doc.id === rel.targetDocumentId)
          return relatedDoc ? { document: relatedDoc, strength: rel.strength } : null
        }).filter(Boolean) as Array<{document: Document, strength: number}>
      }
    }),
    {
      name: 'syncinsight-chat-store',
      skipHydration: true,
      partialize: (state) => ({
        conversations: state.conversations,
        documents: state.documents,
        settings: state.settings,
        user: state.user,
        folders: state.folders,
        tags: state.tags,
        sidebarCollapsed: state.sidebarCollapsed,
        sourcePanelOpen: state.sourcePanelOpen
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // conversations의 날짜 복원
          state.conversations = state.conversations.map(conv => deserializeDates(conv))
          // documents의 날짜 복원
          state.documents = state.documents.map(doc => deserializeDates(doc))
          // folders의 날짜 복원
          state.folders = state.folders.map(folder => deserializeDates(folder))
          // tags의 날짜 복원  
          state.tags = state.tags.map(tag => deserializeDates(tag))
          // user의 날짜 복원
          if (state.user) {
            state.user = deserializeDates(state.user)
          }
        }
      }
    }
  )
)