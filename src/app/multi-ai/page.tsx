'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import { 
  Brain, Send, Copy, Check, Sparkles, 
  RotateCcw, Settings, Folder, FileText,
  Timer, Zap, Plus, X, ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'

interface AIModel {
  id: string
  name: string
  provider: string
  icon: string
  color: string
  description: string
  speed: 'fast' | 'normal' | 'slow'
  accuracy: 'high' | 'medium' | 'low'
}

interface AIResponse {
  modelId: string
  content: string
  timestamp: Date
  processingTime: number
  tokenCount: number
  status: 'pending' | 'generating' | 'completed' | 'error'
  error?: string
}

const availableModels: AIModel[] = [
  {
    id: 'gemini-flash-3.5',
    name: 'Gemini Flash 3.5',
    provider: 'Google',
    icon: '⚡',
    color: '#4285F4',
    description: '빠른 응답, 일반적인 작업에 적합',
    speed: 'fast',
    accuracy: 'medium'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    icon: '🎯',
    color: '#34A853',
    description: '균형잡힌 성능과 정확도',
    speed: 'normal',
    accuracy: 'high'
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    provider: 'Anthropic',
    icon: '🧠',
    color: '#6B46C1',
    description: '깊이 있는 분석과 창의적 사고',
    speed: 'normal',
    accuracy: 'high'
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    icon: '🤖',
    color: '#10A37F',
    description: '최고 수준의 이해력과 추론',
    speed: 'slow',
    accuracy: 'high'
  },
  {
    id: 'llama-2',
    name: 'Llama 2',
    provider: 'Meta',
    icon: '🦙',
    color: '#0866FF',
    description: '오픈소스 모델, 다양한 활용',
    speed: 'fast',
    accuracy: 'medium'
  }
]

export default function MultiAIPage() {
  const { folders, documents } = useChatStore()
  const [prompt, setPrompt] = useState('')
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set(['gemini-flash-3.5', 'gemini-pro']))
  const [selectedFolders, setSelectedFolders] = useState<Set<string>>(new Set())
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'stacked'>('side-by-side')

  // 모델 선택 토글 - 각 모델은 고유 ID로 구분되므로 GEMINI FLASH 3.5와 GEMINI PRO는 동시 선택 가능
  const handleModelToggle = (modelId: string) => {
    const newSelection = new Set(selectedModels)
    if (newSelection.has(modelId)) {
      if (newSelection.size > 1) {
        newSelection.delete(modelId)
      } else {
        toast.error('최소 1개의 모델을 선택해야 합니다')
      }
    } else {
      // 모든 모델 선택 가능 (제한 없음)
      newSelection.add(modelId)
    }
    setSelectedModels(newSelection)
  }

  // 응답 생성 시뮬레이션
  const generateResponses = async () => {
    if (!prompt.trim()) {
      toast.error('질문을 입력해주세요')
      return
    }

    setIsGenerating(true)
    setResponses([])

    // 선택된 모델들에 대해 동시에 응답 생성 시작
    const modelIds = Array.from(selectedModels)
    const newResponses: AIResponse[] = modelIds.map(modelId => ({
      modelId,
      content: '',
      timestamp: new Date(),
      processingTime: 0,
      tokenCount: 0,
      status: 'pending' as const
    }))
    setResponses(newResponses)

    // 각 모델별로 응답 시뮬레이션
    for (let i = 0; i < modelIds.length; i++) {
      const modelId = modelIds[i]
      const model = availableModels.find(m => m.id === modelId)!
      
      // 처리 시작
      setTimeout(() => {
        setResponses(prev => prev.map((r, idx) => 
          idx === i ? { ...r, status: 'generating' } : r
        ))
      }, i * 500)

      // 응답 생성 시뮬레이션
      setTimeout(() => {
        const processingTime = model.speed === 'fast' ? 1500 : model.speed === 'normal' ? 2500 : 3500
        const sampleResponses = {
          'gemini-flash-3.5': `빠른 응답입니다! 귀하의 질문 "${prompt}"에 대해 답변드리겠습니다.

주요 포인트:
1. 신속한 정보 제공
2. 실용적인 솔루션
3. 간결한 설명

이 답변이 도움이 되었기를 바랍니다!`,
          'gemini-pro': `귀하께서 문의하신 "${prompt}"에 대해 체계적으로 답변드리겠습니다.

## 개요
문의하신 내용은 매우 중요한 주제입니다. 다각도로 분석해보겠습니다.

## 상세 분석
- **핵심 포인트 1**: 정확한 정보 기반 분석
- **핵심 포인트 2**: 실용적인 접근 방법
- **핵심 포인트 3**: 장단기 영향 고려

## 결론
종합적으로 판단했을 때, 균형잡힌 접근이 필요합니다.`,
          'claude-3': `"${prompt}"에 대한 깊이 있는 분석을 제공하겠습니다.

이 질문은 여러 측면에서 접근할 수 있는 흥미로운 주제입니다. 

**철학적 관점**: 
근본적인 의미를 고려할 때, 이는 우리가 일상에서 마주하는 도전과 연결됩니다.

**실용적 관점**:
1. 즉각적인 해결책: 단계별 접근
2. 장기적 전략: 지속가능한 방법론
3. 잠재적 함정: 주의해야 할 사항

**창의적 접근**:
때로는 기존의 틀을 벗어나 새로운 시각으로 바라보는 것이 혁신적인 해결책을 제시할 수 있습니다.`,
          'gpt-4': `"${prompt}"에 대한 포괄적이고 심층적인 분석을 제시하겠습니다.

## 1. 문제 정의 및 배경
귀하께서 제시하신 질문은 현대 사회에서 중요한 의미를 갖습니다. 이를 이해하기 위해서는 다음과 같은 맥락을 고려해야 합니다:

### 1.1 역사적 배경
- 과거의 유사 사례 분석
- 발전 과정과 현재 상황

### 1.2 이론적 프레임워크
- 관련 이론과 모델
- 학술적 관점에서의 해석

## 2. 다차원적 분석
### 2.1 기술적 측면
- 현재 기술 수준과 한계
- 미래 발전 가능성

### 2.2 사회적 영향
- 개인과 공동체에 미치는 영향
- 윤리적 고려사항

## 3. 실행 가능한 솔루션
1. **단기 전략**: 즉시 적용 가능한 방안
2. **중기 계획**: 3-6개월 내 구현 가능
3. **장기 비전**: 지속가능한 발전 방향

## 4. 결론 및 제언
종합적으로 분석한 결과, 통합적이고 균형잡힌 접근이 필요합니다.`,
          'llama-2': `안녕하세요! "${prompt}"에 대해 답변해드리겠습니다.

간단명료하게 정리하면:
• 핵심 내용 파악
• 실용적 해결책 제시
• 빠른 실행 가능

추가 정보가 필요하시면 언제든 문의해주세요!`
        }

        setResponses(prev => prev.map((r, idx) => 
          idx === i ? {
            ...r,
            content: sampleResponses[modelId as keyof typeof sampleResponses] || '응답을 생성했습니다.',
            status: 'completed',
            processingTime: processingTime / 1000,
            tokenCount: Math.floor(Math.random() * 500) + 200
          } : r
        ))
      }, (i + 1) * 2000 + Math.random() * 1000)
    }

    // 모든 응답 완료 후
    setTimeout(() => {
      setIsGenerating(false)
      toast.success('모든 AI 응답이 생성되었습니다')
    }, modelIds.length * 2000 + 2000)
  }

  // 응답 복사
  const copyResponse = (content: string, modelName: string) => {
    navigator.clipboard.writeText(content)
    toast.success(`${modelName} 응답이 복사되었습니다`)
  }

  // 선택된 문서 수 계산
  const getSelectedDocCount = () => {
    return documents.filter(doc => 
      doc.folderId && selectedFolders.has(doc.folderId)
    ).length
  }

  return (
    <MainLayout title="다중 AI 응답 생성">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 왼쪽 설정 패널 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 모델 선택 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI 모델 선택
              </h3>
              <div className="space-y-2">
                {availableModels.map(model => (
                  <label
                    key={model.id}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all",
                      selectedModels.has(model.id)
                        ? "bg-primary/5 border-primary"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <Checkbox
                      checked={selectedModels.has(model.id)}
                      onCheckedChange={() => handleModelToggle(model.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span>{model.icon}</span>
                        <span className="font-medium">{model.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{model.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {model.speed === 'fast' ? '빠름' : model.speed === 'normal' ? '보통' : '느림'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {model.provider}
                        </Badge>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </Card>

            {/* 지식베이스 선택 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Folder className="h-4 w-4 mr-2" />
                지식베이스 선택
              </h3>
              <div className="space-y-2">
                {folders.map(folder => {
                  const docCount = documents.filter(doc => doc.folderId === folder.id).length
                  const isSelected = selectedFolders.has(folder.id)

                  return (
                    <label
                      key={folder.id}
                      className={cn(
                        "flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all",
                        isSelected
                          ? "bg-primary/5 border-primary"
                          : "hover:bg-gray-50"
                      )}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => {
                          const newSelection = new Set(selectedFolders)
                          if (isSelected) {
                            newSelection.delete(folder.id)
                          } else {
                            newSelection.add(folder.id)
                          }
                          setSelectedFolders(newSelection)
                        }}
                      />
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ backgroundColor: folder.color + '20' }}
                      >
                        <Folder className="h-3 w-3" style={{ color: folder.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{folder.name}</p>
                        <p className="text-xs text-gray-500">{docCount}개 문서</p>
                      </div>
                    </label>
                  )
                })}
              </div>
              {selectedFolders.size > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                  {getSelectedDocCount()}개 문서 선택됨
                </div>
              )}
            </Card>

            {/* 보기 옵션 */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">보기 옵션</h3>
              <Select value={comparisonMode} onValueChange={(value: any) => setComparisonMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="side-by-side">나란히 보기</SelectItem>
                  <SelectItem value="stacked">세로로 보기</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>

          {/* 오른쪽 메인 영역 */}
          <div className="lg:col-span-3 space-y-6">
            {/* 프롬프트 입력 영역 */}
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    질문 입력
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="여러 AI 모델에게 동시에 질문해보세요..."
                    className="min-h-[120px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {selectedModels.size}개 모델 선택됨
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPrompt('')
                        setResponses([])
                      }}
                      disabled={isGenerating}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      초기화
                    </Button>
                    <Button
                      onClick={generateResponses}
                      disabled={isGenerating || selectedModels.size === 0}
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 mr-2"
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                          생성 중...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          응답 생성
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* 응답 표시 영역 */}
            {responses.length > 0 && (
              <div className={cn(
                "grid gap-4",
                comparisonMode === 'side-by-side' 
                  ? responses.length === 1 
                    ? 'grid-cols-1'
                    : responses.length === 2
                    ? 'grid-cols-1 lg:grid-cols-2'
                    : responses.length === 3
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
                    : responses.length === 4
                    ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-4'
                    : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                  : 'grid-cols-1'
              )}>
                {responses.map((response) => {
                  const model = availableModels.find(m => m.id === response.modelId)!
                  
                  return (
                    <motion.div
                      key={response.modelId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full">
                        <div 
                          className="p-4 border-b flex items-center justify-between"
                          style={{ backgroundColor: model.color + '10' }}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{model.icon}</span>
                            <div>
                              <h4 className="font-semibold">{model.name}</h4>
                              <p className="text-xs text-gray-500">{model.provider}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {response.status === 'generating' && (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="h-4 w-4 text-gray-400" />
                              </motion.div>
                            )}
                            {response.status === 'completed' && (
                              <>
                                <Badge variant="outline" className="text-xs">
                                  <Timer className="h-3 w-3 mr-1" />
                                  {response.processingTime}s
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {response.tokenCount} tokens
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => copyResponse(response.content, model.name)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          {response.status === 'pending' && (
                            <div className="text-center py-8 text-gray-400">
                              <Brain className="h-8 w-8 mx-auto mb-2" />
                              <p className="text-sm">대기 중...</p>
                            </div>
                          )}
                          {response.status === 'generating' && (
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse" />
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                            </div>
                          )}
                          {response.status === 'completed' && (
                            <div className="prose prose-sm max-w-none">
                              <pre className="whitespace-pre-wrap font-sans">
                                {response.content}
                              </pre>
                            </div>
                          )}
                          {response.status === 'error' && (
                            <div className="text-red-500 text-sm">
                              <p className="font-medium">오류 발생</p>
                              <p>{response.error}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* 빈 상태 */}
            {responses.length === 0 && !isGenerating && (
              <Card className="p-12 text-center">
                <Brain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">다중 AI 응답 생성</h3>
                <p className="text-gray-500 mb-4">
                  여러 AI 모델의 응답을 동시에 받아 비교해보세요
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                  <Zap className="h-4 w-4" />
                  <span>선택한 모델들이 동시에 응답을 생성합니다</span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}