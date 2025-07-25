import type { Message, DocumentSource } from '@/types'
import { responseTemplates, quickQuestions } from './mockData'
import { sleep, generateId } from './utils'

// RAG 시뮬레이션을 위한 AI 서비스
export class MockAIService {
  private processingDelay = {
    slow: 3000,
    normal: 2000,
    fast: 1000
  }

  async generateResponse(
    query: string,
    conversationHistory: Message[] = [],
    options: {
      speed?: 'slow' | 'normal' | 'fast'
      temperature?: number
      includeContext?: boolean
    } = {}
  ): Promise<Message> {
    const { speed = 'normal', temperature = 0.7, includeContext = true } = options

    // 처리 시간 시뮬레이션
    await sleep(this.processingDelay[speed])

    // 컨텍스트 분석 (이전 대화 고려)
    const context = includeContext ? this.analyzeContext(conversationHistory) : ''
    const fullQuery = context ? `${context} ${query}` : query

    // 응답 생성
    const response = this.findBestResponse(fullQuery)
    
    // 신뢰도 조정 (temperature에 따라)
    const adjustedConfidence = this.adjustConfidence(response.confidence, temperature)

    return {
      id: generateId(),
      content: response.content,
      role: 'assistant',
      timestamp: new Date(),
      confidence: adjustedConfidence,
      sources: response.sources
    }
  }

  private analyzeContext(history: Message[]): string {
    if (history.length === 0) return ''
    
    // 최근 3개 메시지만 고려하여 컨텍스트 생성
    const recentMessages = history.slice(-3)
    const topics = new Set<string>()
    
    recentMessages.forEach(message => {
      // 간단한 키워드 추출
      const keywords = ['휴가', '연차', '병가', '보안', '패스워드', '프로젝트', '회계', '경비']
      keywords.forEach(keyword => {
        if (message.content.includes(keyword)) {
          topics.add(keyword)
        }
      })
    })

    return Array.from(topics).join(' ')
  }

  private findBestResponse(query: string): {
    content: string
    confidence: number
    sources: DocumentSource[]
  } {
    const lowercaseQuery = query.toLowerCase()

    // 템플릿 기반 응답 찾기
    for (const template of responseTemplates) {
      const hasKeyword = template.keywords?.some(keyword => 
        lowercaseQuery.includes(keyword)
      ) || false
      
      if (hasKeyword && template.responses) {
        for (const response of template.responses) {
          if (response.condition(lowercaseQuery)) {
            return {
              content: response.response,
              confidence: response.confidence,
              sources: response.sources.map(doc => ({
                id: doc.id,
                title: doc.title,
                excerpt: doc.chunks[0]?.content || doc.content.substring(0, 150) + '...',
                relevanceScore: response.confidence,
                documentType: doc.type,
                page: doc.chunks[0]?.metadata.page
              }))
            }
          }
        }
      }
    }

    // 일반적인 인사말 처리
    if (this.isGreeting(lowercaseQuery)) {
      return {
        content: '안녕하세요! SyncInsight AI 어시스턴트입니다. 회사 정책, 업무 프로세스, 각종 규정에 대해 궁금한 것이 있으시면 언제든 물어보세요. 다음과 같은 주제들에 대해 도움을 드릴 수 있습니다:\n\n• 인사 관리 규정 (휴가, 채용 등)\n• 정보보안 정책\n• 업무 프로세스 가이드\n• 회계 처리 절차\n\n구체적으로 어떤 것이 궁금하신가요?',
        confidence: 0.95,
        sources: []
      }
    }

    // 도움말 요청 처리
    if (this.isHelpRequest(lowercaseQuery)) {
      return {
        content: '다음과 같은 질문들을 해보세요:\n\n' + 
                 quickQuestions.map(q => `• ${q}`).join('\n') +
                 '\n\n또는 구체적인 키워드를 포함해서 질문해 주시면 더 정확한 답변을 드릴 수 있습니다.',
        confidence: 0.90,
        sources: []
      }
    }

    // 기본 응답
    return {
      content: `"${query}"에 대한 정보를 찾고 있습니다. 현재 지식베이스에서 정확한 일치 항목을 찾지 못했습니다.\n\n다음과 같은 방법을 시도해보세요:\n• 더 구체적인 키워드 사용\n• 질문을 다르게 표현\n• 관련 문서가 있다면 업로드\n\n또는 다음 중 하나를 선택해보세요:\n${quickQuestions.slice(0, 3).map(q => `• ${q}`).join('\n')}`,
      confidence: 0.30,
      sources: []
    }
  }

  private isGreeting(query: string): boolean {
    const greetings = ['안녕', '안녕하세요', '반가워', '처음', '시작']
    return greetings.some(greeting => query.includes(greeting))
  }

  private isHelpRequest(query: string): boolean {
    const helpKeywords = ['도움', '도와줘', '뭘', '무엇', '어떤', '질문', '물어']
    return helpKeywords.some(keyword => query.includes(keyword))
  }

  private adjustConfidence(baseConfidence: number, temperature: number): number {
    // Temperature가 높을수록 신뢰도에 더 많은 변동성 추가
    const variation = (Math.random() - 0.5) * temperature * 0.2
    const adjusted = Math.max(0.1, Math.min(1.0, baseConfidence + variation))
    return Math.round(adjusted * 100) / 100
  }

  // 문서 유사도 검색 시뮬레이션
  async searchDocuments(query: string, limit: number = 5): Promise<DocumentSource[]> {
    await sleep(500) // 검색 지연 시뮬레이션
    
    // 간단한 키워드 매칭 기반 검색
    const results: DocumentSource[] = []
    const keywords = query.toLowerCase().split(' ')
    
    responseTemplates.forEach(template => {
      if (template.responses) {
        template.responses.forEach(response => {
        if (response.sources && response.sources.length > 0) {
          response.sources.forEach(doc => {
            const relevance = this.calculateRelevance(doc.content, keywords)
            if (relevance > 0.3) {
              results.push({
                id: doc.id,
                title: doc.title,
                excerpt: doc.content.substring(0, 200) + '...',
                relevanceScore: relevance,
                documentType: doc.type,
                page: doc.chunks[0]?.metadata.page
              })
            }
          })
        }
        })
      }
    })

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)
  }

  private calculateRelevance(content: string, keywords: string[]): number {
    const contentLower = content.toLowerCase()
    let score = 0
    
    keywords.forEach(keyword => {
      if (contentLower.includes(keyword)) {
        score += 0.3
      }
    })
    
    return Math.min(1.0, score)
  }

  // 스트리밍 응답 시뮬레이션
  async *streamResponse(
    query: string,
    conversationHistory: Message[] = [],
    options: {
      speed?: 'slow' | 'normal' | 'fast'
      temperature?: number
      includeContext?: boolean
    } = {}
  ): AsyncGenerator<{ content: string; done: boolean }> {
    const response = await this.generateResponse(query, conversationHistory, options)
    const content = response.content
    const wordsPerChunk = 3
    const words = content.split(' ')
    
    for (let i = 0; i < words.length; i += wordsPerChunk) {
      const chunk = words.slice(0, i + wordsPerChunk).join(' ')
      await sleep(100) // 타이핑 속도 시뮬레이션
      yield { content: chunk, done: false }
    }
    
    yield { content, done: true }
  }
}

export const aiService = new MockAIService()