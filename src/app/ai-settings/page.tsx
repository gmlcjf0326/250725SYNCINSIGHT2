'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import { 
  Brain, Settings, Sparkles, Zap, Shield, 
  Save, Plus, Trash2, Copy, Check, 
  SlidersHorizontal, MessageSquare, FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useChatStore } from '@/stores/chatStore'

interface AIProfile {
  id: string
  name: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  contextWindow: number
  responseSpeed: 'fast' | 'normal' | 'slow'
  includeExamples: boolean
  examples: { input: string; output: string }[]
}

const defaultProfiles: AIProfile[] = [
  {
    id: 'precise',
    name: '정확성 우선',
    description: '사실 기반의 정확한 답변을 제공합니다',
    model: 'gemini-pro',
    temperature: 0.3,
    maxTokens: 2000,
    systemPrompt: '당신은 정확하고 신뢰할 수 있는 정보만을 제공하는 AI 어시스턴트입니다. 추측이나 불확실한 정보는 명확히 구분하여 답변하세요.',
    contextWindow: 4000,
    responseSpeed: 'slow',
    includeExamples: false,
    examples: []
  },
  {
    id: 'creative',
    name: '창의성 우선',
    description: '창의적이고 다양한 관점의 답변을 제공합니다',
    model: 'claude-3',
    temperature: 0.9,
    maxTokens: 3000,
    systemPrompt: '당신은 창의적이고 혁신적인 아이디어를 제공하는 AI 어시스턴트입니다. 다양한 관점에서 문제를 바라보고 독창적인 해결책을 제시하세요.',
    contextWindow: 8000,
    responseSpeed: 'normal',
    includeExamples: true,
    examples: [
      { input: '새로운 마케팅 아이디어', output: '바이럴 챌린지, 인터랙티브 콘텐츠, AR 체험 등' }
    ]
  },
  {
    id: 'balanced',
    name: '균형',
    description: '정확성과 창의성의 균형을 맞춘 답변',
    model: 'gemini-flash-3.5',
    temperature: 0.7,
    maxTokens: 2500,
    systemPrompt: '당신은 사용자의 요구에 맞춰 정확하면서도 유용한 정보를 제공하는 AI 어시스턴트입니다.',
    contextWindow: 6000,
    responseSpeed: 'fast',
    includeExamples: false,
    examples: []
  }
]

export default function AISettingsPage() {
  const { settings, updateSettings } = useChatStore()
  const [profiles, setProfiles] = useState<AIProfile[]>(defaultProfiles)
  const [selectedProfile, setSelectedProfile] = useState<AIProfile>(profiles[0])
  const [isEditing, setIsEditing] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedCompareProfiles, setSelectedCompareProfiles] = useState<string[]>([])
  const [testPrompt, setTestPrompt] = useState('')
  const [compareResults, setCompareResults] = useState<Record<string, {
    response: string
    responseTime: number
    tokens: number
    cost: number
    isLoading: boolean
  }>>({})
  const [isComparing, setIsComparing] = useState(false)

  const availableModels = [
    { id: 'gemini-flash-3.5', name: 'Gemini Flash 3.5', provider: 'Google' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'llama-2', name: 'Llama 2', provider: 'Meta' }
  ]

  const handleSaveProfile = () => {
    if (isEditing) {
      setProfiles(prev => prev.map(p => 
        p.id === selectedProfile.id ? selectedProfile : p
      ))
    } else {
      const newProfile = {
        ...selectedProfile,
        id: `custom-${Date.now()}`,
        name: '새 프로필'
      }
      setProfiles(prev => [...prev, newProfile])
      setSelectedProfile(newProfile)
    }
    setIsEditing(true)
    toast.success('프로필이 저장되었습니다')
  }

  const handleDeleteProfile = (profileId: string) => {
    if (defaultProfiles.some(p => p.id === profileId)) {
      toast.error('기본 프로필은 삭제할 수 없습니다')
      return
    }
    setProfiles(prev => prev.filter(p => p.id !== profileId))
    if (selectedProfile.id === profileId) {
      setSelectedProfile(profiles[0])
    }
    toast.success('프로필이 삭제되었습니다')
  }

  const handleDuplicateProfile = () => {
    const duplicated = {
      ...selectedProfile,
      id: `copy-${Date.now()}`,
      name: `${selectedProfile.name} (복사본)`
    }
    setProfiles(prev => [...prev, duplicated])
    setSelectedProfile(duplicated)
    setIsEditing(true)
    toast.success('프로필이 복제되었습니다')
  }

  const handleApplyProfile = () => {
    updateSettings({
      model: selectedProfile.model,
      temperature: selectedProfile.temperature,
      maxTokens: selectedProfile.maxTokens,
      responseSpeed: selectedProfile.responseSpeed,
      contextWindow: selectedProfile.contextWindow,
      customPrompt: selectedProfile.systemPrompt
    })
    toast.success('설정이 적용되었습니다')
  }

  const handleCompareResponses = async () => {
    if (selectedCompareProfiles.length < 2 || !testPrompt) return

    setIsComparing(true)
    setCompareMode(true)
    
    // 선택된 프로필들에 대해 초기 로딩 상태 설정
    const initialResults: Record<string, any> = {}
    selectedCompareProfiles.forEach(profileId => {
      initialResults[profileId] = {
        response: '',
        responseTime: 0,
        tokens: 0,
        cost: 0,
        isLoading: true
      }
    })
    setCompareResults(initialResults)

    // 각 프로필에 대해 모의 응답 생성 (실제로는 AI API 호출)
    for (const profileId of selectedCompareProfiles) {
      const profile = profiles.find(p => p.id === profileId)
      if (!profile) continue

      // 모의 응답 지연 시간 (실제로는 API 응답 시간)
      const delay = Math.random() * 2000 + 1000 // 1-3초
      
      setTimeout(() => {
        const mockResponses = {
          'precise': `정확성 우선 프로필 응답: "${testPrompt}"에 대한 신뢰할 수 있는 답변입니다. 이 답변은 검증된 정보만을 바탕으로 작성되었으며, 불확실한 부분은 명시하였습니다.`,
          'creative': `창의성 우선 프로필 응답: "${testPrompt}"에 대해 독창적인 관점에서 답변드리겠습니다. 혁신적인 아이디어와 다양한 접근 방식을 제시하여 새로운 가능성을 탐색해보겠습니다.`,
          'balanced': `균형 잡힌 프로필 응답: "${testPrompt}"에 대해 정확성과 창의성을 균형있게 조합한 답변입니다. 실용적이면서도 포괄적인 접근 방식을 통해 도움이 되는 정보를 제공합니다.`
        }

        const mockResponse = mockResponses[profileId as keyof typeof mockResponses] || 
          `${profile.name} 프로필을 사용한 "${testPrompt}"에 대한 응답입니다. 이 프로필의 특성에 맞게 최적화된 답변을 제공합니다.`

        setCompareResults(prev => ({
          ...prev,
          [profileId]: {
            response: mockResponse,
            responseTime: Math.round(delay),
            tokens: Math.floor(mockResponse.length / 4), // 대략적인 토큰 수
            cost: Math.round((Math.floor(mockResponse.length / 4) * 0.001) * 100) / 100,
            isLoading: false
          }
        }))
      }, delay)
    }

    setTimeout(() => {
      setIsComparing(false)
    }, 3000)
  }

  return (
    <MainLayout title="AI 상세 설정">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs defaultValue="profiles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profiles">AI 프로필</TabsTrigger>
              <TabsTrigger value="advanced">고급 설정</TabsTrigger>
              <TabsTrigger value="compare">모델 비교</TabsTrigger>
            </TabsList>

            {/* AI 프로필 탭 */}
            <TabsContent value="profiles" className="p-6">
              <div className="min-h-[600px] grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 프로필 목록 */}
                <div className="lg:col-span-1 space-y-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">프로필 목록</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedProfile({
                          id: '',
                          name: '새 프로필',
                          description: '',
                          model: 'gemini-flash-3.5',
                          temperature: 0.7,
                          maxTokens: 2000,
                          systemPrompt: '',
                          contextWindow: 4000,
                          responseSpeed: 'normal',
                          includeExamples: false,
                          examples: []
                        })
                        setIsEditing(false)
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {profiles.map(profile => (
                    <motion.div
                      key={profile.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setSelectedProfile(profile)
                        setIsEditing(true)
                      }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedProfile.id === profile.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{profile.name}</h4>
                          <p className="text-sm text-gray-500">{profile.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{profile.model}</p>
                        </div>
                        {defaultProfiles.some(p => p.id === profile.id) ? (
                          <Shield className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteProfile(profile.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 프로필 편집 */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">프로필 설정</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDuplicateProfile}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        복제
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        저장
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={handleApplyProfile}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        적용
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="profile-name">프로필 이름</Label>
                      <Input
                        id="profile-name"
                        value={selectedProfile.name}
                        onChange={(e) => setSelectedProfile({
                          ...selectedProfile,
                          name: e.target.value
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="profile-model">AI 모델</Label>
                      <Select
                        value={selectedProfile.model}
                        onValueChange={(value) => setSelectedProfile({
                          ...selectedProfile,
                          model: value
                        })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map(model => (
                            <SelectItem key={model.id} value={model.id}>
                              <div className="flex items-center justify-between w-full">
                                <span>{model.name}</span>
                                <span className="text-xs text-gray-500 ml-2">{model.provider}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="profile-description">설명</Label>
                    <Input
                      id="profile-description"
                      value={selectedProfile.description}
                      onChange={(e) => setSelectedProfile({
                        ...selectedProfile,
                        description: e.target.value
                      })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="temperature">
                      창의성 (Temperature): {selectedProfile.temperature}
                    </Label>
                    <Slider
                      id="temperature"
                      value={[selectedProfile.temperature]}
                      onValueChange={([value]) => setSelectedProfile({
                        ...selectedProfile,
                        temperature: value
                      })}
                      min={0}
                      max={1}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>정확한 답변</span>
                      <span>창의적인 답변</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="max-tokens">
                        최대 토큰: {selectedProfile.maxTokens}
                      </Label>
                      <Slider
                        id="max-tokens"
                        value={[selectedProfile.maxTokens]}
                        onValueChange={([value]) => setSelectedProfile({
                          ...selectedProfile,
                          maxTokens: value
                        })}
                        min={500}
                        max={8000}
                        step={100}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="context-window">
                        컨텍스트 윈도우: {selectedProfile.contextWindow}
                      </Label>
                      <Slider
                        id="context-window"
                        value={[selectedProfile.contextWindow]}
                        onValueChange={([value]) => setSelectedProfile({
                          ...selectedProfile,
                          contextWindow: value
                        })}
                        min={2000}
                        max={16000}
                        step={1000}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="response-speed">응답 속도</Label>
                    <Select
                      value={selectedProfile.responseSpeed}
                      onValueChange={(value: any) => setSelectedProfile({
                        ...selectedProfile,
                        responseSpeed: value
                      })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 mr-2" />
                            빠름 - 신속한 응답 우선
                          </div>
                        </SelectItem>
                        <SelectItem value="normal">
                          <div className="flex items-center">
                            <Brain className="h-4 w-4 mr-2" />
                            보통 - 균형잡힌 응답
                          </div>
                        </SelectItem>
                        <SelectItem value="slow">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 mr-2" />
                            신중 - 정확성 우선
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="system-prompt">시스템 프롬프트</Label>
                    <Textarea
                      id="system-prompt"
                      value={selectedProfile.systemPrompt}
                      onChange={(e) => setSelectedProfile({
                        ...selectedProfile,
                        systemPrompt: e.target.value
                      })}
                      className="mt-1 font-mono text-sm"
                      rows={6}
                      placeholder="AI의 역할과 행동 지침을 입력하세요..."
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 고급 설정 탭 */}
            <TabsContent value="advanced" className="p-6">
              <div className="min-h-[600px] space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Few-shot 예시 관리</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-examples">예시 포함</Label>
                      <Switch
                        id="include-examples"
                        checked={selectedProfile.includeExamples}
                        onCheckedChange={(checked) => setSelectedProfile({
                          ...selectedProfile,
                          includeExamples: checked
                        })}
                      />
                    </div>

                    {selectedProfile.includeExamples && (
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProfile({
                            ...selectedProfile,
                            examples: [
                              ...selectedProfile.examples,
                              { input: '', output: '' }
                            ]
                          })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          예시 추가
                        </Button>

                        {selectedProfile.examples.map((example, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">예시 {index + 1}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedProfile({
                                  ...selectedProfile,
                                  examples: selectedProfile.examples.filter((_, i) => i !== index)
                                })}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div>
                              <Label>입력</Label>
                              <Input
                                value={example.input}
                                onChange={(e) => {
                                  const newExamples = [...selectedProfile.examples]
                                  newExamples[index].input = e.target.value
                                  setSelectedProfile({
                                    ...selectedProfile,
                                    examples: newExamples
                                  })
                                }}
                                placeholder="사용자 입력 예시"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>출력</Label>
                              <Textarea
                                value={example.output}
                                onChange={(e) => {
                                  const newExamples = [...selectedProfile.examples]
                                  newExamples[index].output = e.target.value
                                  setSelectedProfile({
                                    ...selectedProfile,
                                    examples: newExamples
                                  })
                                }}
                                placeholder="AI 응답 예시"
                                className="mt-1"
                                rows={3}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">응답 포맷 설정</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <Label>응답 템플릿</Label>
                      <Textarea
                        className="mt-2 font-mono text-sm"
                        rows={8}
                        placeholder={`예시:
## 요약
{summary}

## 상세 내용
{details}

## 참고 자료
{sources}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* 모델 비교 탭 */}
            <TabsContent value="compare" className="p-6">
              <div className="min-h-[600px] space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">AI 모델 비교 도구</h3>
                  <p className="text-gray-600 mb-6">
                    동일한 질문에 대해 여러 AI 모델의 응답을 비교해보세요.
                  </p>
                </div>

                <div>
                  <Label>비교할 프로필 선택</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {profiles.map(profile => (
                      <label
                        key={profile.id}
                        className="flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCompareProfiles.includes(profile.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCompareProfiles(prev => [...prev, profile.id])
                            } else {
                              setSelectedCompareProfiles(prev => 
                                prev.filter(id => id !== profile.id)
                              )
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{profile.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="test-prompt">테스트 프롬프트</Label>
                  <Textarea
                    id="test-prompt"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    className="mt-1"
                    rows={4}
                    placeholder="비교할 질문을 입력하세요..."
                  />
                </div>

                <Button 
                  className="w-full"
                  disabled={selectedCompareProfiles.length < 2 || !testPrompt || isComparing}
                  onClick={handleCompareResponses}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isComparing ? '비교 중...' : '응답 비교하기'}
                </Button>

                {/* 비교 결과 영역 */}
                {compareMode && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">비교 결과</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCompareMode(false)
                          setCompareResults({})
                        }}
                      >
                        결과 지우기
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {selectedCompareProfiles.map(profileId => {
                        const profile = profiles.find(p => p.id === profileId)
                        const result = compareResults[profileId]
                        if (!profile) return null
                        
                        return (
                          <div key={profileId} className="border rounded-lg p-4 bg-white">
                            <div className="mb-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{profile.name}</h4>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                  {profile.model}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{profile.description}</p>
                            </div>
                            
                            <div className="space-y-3">
                              {/* 응답 내용 */}
                              <div className="text-sm bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                                {result?.isLoading ? (
                                  <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                                    <p className="text-gray-600">응답 생성 중...</p>
                                  </div>
                                ) : result?.response ? (
                                  <p className="text-gray-800">{result.response}</p>
                                ) : (
                                  <p className="text-gray-600">응답 대기 중...</p>
                                )}
                              </div>
                              
                              {/* 성능 지표 */}
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="bg-blue-50 p-2 rounded text-center">
                                  <p className="text-blue-600 font-medium">
                                    {result?.responseTime || '-'}ms
                                  </p>
                                  <p className="text-blue-500">응답시간</p>
                                </div>
                                <div className="bg-green-50 p-2 rounded text-center">
                                  <p className="text-green-600 font-medium">
                                    {result?.tokens || '-'}
                                  </p>
                                  <p className="text-green-500">토큰</p>
                                </div>
                                <div className="bg-purple-50 p-2 rounded text-center">
                                  <p className="text-purple-600 font-medium">
                                    ${result?.cost || '-'}
                                  </p>
                                  <p className="text-purple-500">예상비용</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {selectedCompareProfiles.length > 0 && !isComparing && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">💡 비교 분석</h5>
                        <p className="text-sm text-blue-800">
                          각 프로필의 특성에 따라 응답 스타일과 품질이 다릅니다. 
                          용도에 맞는 프로필을 선택하여 최적의 결과를 얻으세요.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  )
}