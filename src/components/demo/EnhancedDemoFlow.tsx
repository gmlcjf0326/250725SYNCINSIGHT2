'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, FileText, Settings, MessageSquare, Network,
  Check, ChevronRight, ChevronLeft, X, Play,
  Bot, User, Sparkles, FileUp, Folder, Brain,
  Hash, ZoomIn, ZoomOut, Shuffle, Eye
} from 'lucide-react'

interface DemoStep {
  id: string
  title: string
  description: string
  component: React.ReactNode
}

interface EnhancedDemoFlowProps {
  open: boolean
  onClose: () => void
}

export default function EnhancedDemoFlow({ open, onClose }: EnhancedDemoFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const demoSteps: DemoStep[] = [
    {
      id: 'intro',
      title: 'SyncInsight에 오신 것을 환영합니다!',
      description: 'AI 기반 지식 관리 시스템의 주요 기능을 살펴보겠습니다.',
      component: <IntroStep />
    },
    {
      id: 'upload',
      title: '지식베이스 구축하기',
      description: '문서를 업로드하거나 텍스트를 직접 입력하여 지식베이스를 만들어보세요.',
      component: <UploadStep />
    },
    {
      id: 'ai-settings',
      title: 'AI 설정 구성하기',
      description: '원하는 AI 모델과 세부 설정을 선택하여 최적화된 응답을 받아보세요.',
      component: <AISettingsStep />
    },
    {
      id: 'chat',
      title: '스마트한 대화 시작하기',
      description: '지식베이스를 선택하고 AI와 대화하며 인사이트를 얻어보세요.',
      component: <ChatStep />
    },
    {
      id: 'graph',
      title: '지식 그래프 탐색하기',
      description: '문서, 태그, 폴더 간의 관계를 시각적으로 탐색해보세요.',
      component: <GraphStep />
    },
    {
      id: 'complete',
      title: '준비 완료!',
      description: 'SyncInsight의 모든 기능을 활용할 준비가 되었습니다.',
      component: <CompleteStep />
    }
  ]

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCompletedSteps(prev => new Set(prev).add(currentStep))
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleStepClick = (index: number) => {
    if (index <= Math.max(...Array.from(completedSteps)) + 1) {
      setCurrentStep(index)
    }
  }

  const progress = ((currentStep + 1) / demoSteps.length) * 100

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[95vh] sm:h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full relative">
          {/* 닫기 버튼 - 상단 우측 고정 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-lg hover:bg-gray-100 bg-white/80 backdrop-blur-sm shadow-sm"
          >
            <X className="h-5 w-5" />
          </button>

          {/* 왼쪽 사이드바 */}
          <div className="w-80 bg-gray-50 p-6 border-r overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">데모 가이드</h2>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="space-y-2">
              {demoSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  disabled={index > Math.max(...Array.from(completedSteps)) + 1}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    currentStep === index
                      ? 'bg-primary text-primary-foreground'
                      : completedSteps.has(index)
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : index <= Math.max(...Array.from(completedSteps)) + 1
                      ? 'hover:bg-gray-100'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === index
                        ? 'bg-primary-foreground/20'
                        : completedSteps.has(index)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300'
                    }`}>
                      {completedSteps.has(index) ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 오른쪽 콘텐츠 영역 */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 pt-16">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: isAnimating ? 20 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: isAnimating ? -20 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold mb-3">{demoSteps[currentStep].title}</h3>
                    <p className="text-gray-600 mb-6">{demoSteps[currentStep].description}</p>
                    {demoSteps[currentStep].component}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* 하단 네비게이션 */}
            <div className="border-t p-6 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                이전
              </Button>

              <div className="flex items-center space-x-2">
                {demoSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentStep === index
                        ? 'w-8 bg-primary'
                        : completedSteps.has(index)
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentStep === demoSteps.length - 1 ? (
                <Button onClick={onClose}>
                  시작하기
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  다음
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Step Components
function IntroStep() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-8"
      >
        <Brain className="h-16 w-16 text-white" />
      </motion.div>
      <h1 className="text-4xl font-bold mb-4">
        AI와 함께하는 스마트한 지식 관리
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl">
        SyncInsight는 RAG 기술을 활용하여 여러분의 모든 문서와 지식을 
        하나로 연결하고, AI가 즉시 찾아 답변해드립니다.
      </p>
    </div>
  )
}

function UploadStep() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (fileName: string) => {
    setUploadedFiles(prev => [...prev, fileName])
  }

  return (
    <div className="space-y-6">
      {/* 파일 업로드 영역 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        <FileUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium mb-2">파일을 드래그하여 업로드하세요</p>
        <p className="text-sm text-gray-500 mb-4">또는 클릭하여 파일 선택</p>
        <Button variant="outline" onClick={() => handleFileUpload('회사규정.pdf')}>
          <Upload className="h-4 w-4 mr-2" />
          파일 선택
        </Button>
      </div>

      {/* 텍스트 입력 영역 */}
      <div className="space-y-2">
        <h4 className="font-medium">또는 텍스트를 직접 입력하세요</h4>
        <textarea
          className="w-full p-3 border rounded-lg resize-none"
          rows={4}
          placeholder="지식베이스에 추가할 내용을 입력하세요..."
        />
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          텍스트 추가
        </Button>
      </div>

      {/* 업로드된 파일 목록 */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">업로드된 파일</h4>
          {uploadedFiles.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>{file}</span>
              </div>
              <Check className="h-5 w-5 text-green-500" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function AISettingsStep() {
  const [selectedModel, setSelectedModel] = useState('gemini-flash-3.5')
  const [temperature, setTemperature] = useState(0.7)
  const [selectedProfile, setSelectedProfile] = useState('balanced')

  const models = [
    { id: 'gemini-flash-3.5', name: 'Gemini Flash 3.5', description: '빠르고 효율적인 응답' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: '균형잡힌 성능' },
    { id: 'claude-3', name: 'Claude 3', description: '깊이 있는 분석' },
    { id: 'gpt-4', name: 'GPT-4', description: '최고 수준의 이해력' }
  ]

  const profiles = [
    { id: 'precise', name: '정확성 우선', icon: '🎯' },
    { id: 'balanced', name: '균형', icon: '⚖️' },
    { id: 'creative', name: '창의성 우선', icon: '💡' }
  ]

  return (
    <div className="space-y-6">
      {/* AI 모델 선택 */}
      <div>
        <h4 className="font-medium mb-3">AI 모델 선택</h4>
        <div className="grid grid-cols-2 gap-3">
          {models.map(model => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedModel === model.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{model.name}</div>
              <div className="text-sm text-gray-500">{model.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 프로필 선택 */}
      <div>
        <h4 className="font-medium mb-3">응답 스타일</h4>
        <div className="flex space-x-3">
          {profiles.map(profile => (
            <button
              key={profile.id}
              onClick={() => setSelectedProfile(profile.id)}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                selectedProfile === profile.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{profile.icon}</div>
              <div className="font-medium">{profile.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 세부 설정 */}
      <div>
        <h4 className="font-medium mb-3">창의성 레벨: {temperature}</h4>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>정확한 답변</span>
          <span>창의적인 답변</span>
        </div>
      </div>

      {/* 설정 프리뷰 */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">현재 설정</h4>
        <div className="space-y-1 text-sm">
          <p>모델: {models.find(m => m.id === selectedModel)?.name}</p>
          <p>스타일: {profiles.find(p => p.id === selectedProfile)?.name}</p>
          <p>창의성: {temperature}</p>
        </div>
      </div>
    </div>
  )
}

function ChatStep() {
  const [selectedFolders, setSelectedFolders] = useState<string[]>(['folder1'])
  const [message, setMessage] = useState('')
  const [showResponse, setShowResponse] = useState(false)

  const folders = [
    { id: 'folder1', name: '회사 정책', count: 15 },
    { id: 'folder2', name: '기술 문서', count: 23 },
    { id: 'folder3', name: '프로젝트 자료', count: 8 }
  ]

  const handleSend = () => {
    if (message) {
      setShowResponse(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* 지식베이스 선택 */}
      <div>
        <h4 className="font-medium mb-3">지식베이스 선택</h4>
        <div className="space-y-2">
          {folders.map(folder => (
            <label
              key={folder.id}
              className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedFolders.includes(folder.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedFolders(prev => [...prev, folder.id])
                  } else {
                    setSelectedFolders(prev => prev.filter(id => id !== folder.id))
                  }
                }}
                className="rounded"
              />
              <Folder className="h-5 w-5 text-yellow-600" />
              <span className="flex-1">{folder.name}</span>
              <span className="text-sm text-gray-500">{folder.count}개 문서</span>
            </label>
          ))}
        </div>
      </div>

      {/* 채팅 영역 */}
      <div className="border rounded-lg p-4 h-64 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {message && (
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-xs">
                <User className="h-4 w-4 mb-1" />
                <p className="text-sm">{message}</p>
              </div>
            </div>
          )}
          
          {showResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border rounded-lg p-3 max-w-md">
                <div className="flex items-center space-x-2 mb-2">
                  <Bot className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">AI Assistant</span>
                </div>
                <p className="text-sm">
                  선택하신 지식베이스를 기반으로 답변해드리겠습니다. 
                  회사 정책 문서에서 관련 정보를 찾았습니다...
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  📄 출처: 회사규정.pdf (신뢰도 95%)
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 메시지 입력 */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="질문을 입력하세요..."
          className="flex-1 p-3 border rounded-lg"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button onClick={handleSend}>
          <MessageSquare className="h-4 w-4 mr-2" />
          전송
        </Button>
      </div>
    </div>
  )
}

function GraphStep() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [viewMode, setViewMode] = useState<'documents' | 'relationships' | 'tags'>('documents')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2))
  }
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6))
  }
  
  const handleRearrange = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 패널 */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold flex items-center">
            <Network className="h-5 w-5 mr-2 text-blue-600" />
            지식 그래프 탐색
          </h4>
          <div className="flex items-center space-x-2">
            {/* 뷰 모드 선택 */}
            <div className="flex rounded-lg border border-gray-200 p-1">
              {[
                { key: 'documents', label: '문서', icon: FileText },
                { key: 'relationships', label: '관계', icon: Network },
                { key: 'tags', label: '태그', icon: Hash }
              ].map((mode) => {
                const IconComponent = mode.icon
                return (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key as any)}
                    className={`px-2 py-1 text-xs font-medium rounded-md transition-colors flex items-center space-x-1 ${
                      viewMode === mode.key
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="h-3 w-3" />
                    <span>{mode.label}</span>
                  </button>
                )
              })}
            </div>
            
            {/* 줌 컨트롤 */}
            <div className="flex items-center space-x-1">
              <Button variant="outline" size="sm" onClick={handleZoomOut} className="h-8 px-2">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-xs text-gray-600 px-2 py-1">{Math.round(zoomLevel * 100)}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn} className="h-8 px-2">
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleRearrange} className="h-8 px-2">
              <Shuffle className="h-3 w-3 mr-1" />
              재배치
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDetails(!showDetails)}
              className="h-8 px-2"
            >
              <Eye className="h-3 w-3 mr-1" />
              {showDetails ? '간단히' : '자세히'}
            </Button>
          </div>
        </div>
        
        {/* 그래프 통계 */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-gray-50 rounded-lg"
          >
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">12</div>
                <div className="text-xs text-gray-600">문서</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">8</div>
                <div className="text-xs text-gray-600">연결</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">15</div>
                <div className="text-xs text-gray-600">태그</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">3</div>
                <div className="text-xs text-gray-600">클러스터</div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 지식 그래프 시뮬레이션 */}
        <div 
          className="h-80 bg-gray-50 rounded-lg relative overflow-hidden border"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {/* 그래프 배경 그리드 */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* 연결선들 */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#3B82F6',stopOpacity:0.6}} />
                <stop offset="100%" style={{stopColor:'#8B5CF6',stopOpacity:0.6}} />
              </linearGradient>
            </defs>
            {/* 중앙에서 각 노드로의 연결선 */}
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <motion.line
                key={`line-${index}`}
                x1="50%"
                y1="50%"
                x2={`${50 + 30 * Math.cos((index * 60) * Math.PI / 180)}%`}
                y2={`${50 + 30 * Math.sin((index * 60) * Math.PI / 180)}%`}
                stroke="url(#linkGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              />
            ))}
            {/* 노드 간 연결선 */}
            {[
              { x1: 35, y1: 35, x2: 65, y2: 35 },
              { x1: 65, y1: 65, x2: 35, y2: 65 },
              { x1: 35, y1: 80, x2: 80, y2: 20 }
            ].map((line, index) => (
              <motion.line
                key={`connection-${index}`}
                x1={`${line.x1}%`}
                y1={`${line.y1}%`}
                x2={`${line.x2}%`}
                y2={`${line.y2}%`}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="3,3"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 2, delay: 1 + index * 0.3 }}
              />
            ))}
          </svg>

          <div className="absolute inset-0">
            {/* 중앙 메인 노드 */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              onClick={() => setSelectedNode('main')}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-600 rounded-full flex flex-col items-center justify-center text-white text-xs shadow-lg cursor-pointer hover:scale-110 transition-all duration-200 z-10"
            >
              <FileText className="h-6 w-6 mb-1" />
              <span className="font-semibold">회사규정</span>
            </motion.div>
            
            {/* 주변 노드들 */}
            {[
              { id: 'hr', label: '인사규정', type: 'document', color: 'bg-green-600', icon: FileText, x: 35, y: 35, altX: 25, altY: 60 },
              { id: 'security', label: '보안정책', type: 'document', color: 'bg-red-600', icon: FileText, x: 65, y: 35, altX: 75, altY: 40 },
              { id: 'finance', label: '재무규정', type: 'document', color: 'bg-purple-600', icon: FileText, x: 80, y: 65, altX: 60, altY: 75 },
              { id: 'project', label: '프로젝트', type: 'folder', color: 'bg-yellow-600', icon: Folder, x: 65, y: 80, altX: 40, altY: 25 },
              { id: 'guide', label: '가이드', type: 'document', color: 'bg-indigo-600', icon: FileText, x: 35, y: 80, altX: 80, altY: 80 },
              { id: 'manual', label: '매뉴얼', type: 'document', color: 'bg-gray-600', icon: FileText, x: 20, y: 50, altX: 15, altY: 30 }
            ].map((node, index) => {
              const IconComponent = node.icon
              const currentX = isAnimating ? node.altX : node.x
              const currentY = isAnimating ? node.altY : node.y
              
              return (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: selectedNode === node.id ? 1.2 : 1, 
                    opacity: 1,
                    x: isAnimating ? `${node.altX - node.x}%` : '0%',
                    y: isAnimating ? `${node.altY - node.y}%` : '0%'
                  }}
                  transition={{
                    scale: { duration: 0.2 },
                    opacity: { duration: 0.5, delay: 1 + index * 0.1 },
                    x: { duration: 1, ease: "easeInOut" },
                    y: { duration: 1, ease: "easeInOut" }
                  }}
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    position: 'absolute',
                    top: `${node.y}%`,
                    left: `${node.x}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`w-14 h-14 ${node.color} rounded-full flex flex-col items-center justify-center text-white text-xs shadow-md cursor-pointer hover:scale-110 transition-all duration-200 ${
                    selectedNode === node.id ? 'ring-2 ring-blue-400 ring-offset-2' : ''
                  } ${viewMode === 'documents' ? 'block' : viewMode === 'relationships' && (node.id === 'hr' || node.id === 'security' || node.id === 'finance') ? 'block' : viewMode === 'tags' ? 'opacity-50' : 'block'}`}
                >
                  <IconComponent className="h-4 w-4 mb-1" />
                  <span className="font-medium text-[10px] leading-none">{node.label}</span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* 선택된 노드 정보 */}
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="font-medium text-blue-900">
                  {selectedNode === 'main' ? '회사규정.pdf' : 
                   selectedNode === 'hr' ? '인사규정.pdf' :
                   selectedNode === 'security' ? '보안정책.pdf' :
                   selectedNode === 'finance' ? '재무규정.pdf' :
                   selectedNode === 'project' ? '프로젝트 폴더' :
                   selectedNode === 'guide' ? '가이드.pdf' :
                   selectedNode === 'manual' ? '매뉴얼.pdf' : '선택된 문서'
                  }
                </span>
              </div>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  열기
                </Button>
                <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                  <Brain className="h-3 w-3 mr-1" />
                  분석
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 mb-3 text-xs">
              <div className="text-center p-2 bg-white rounded border">
                <div className="font-semibold text-blue-600">
                  {selectedNode === 'main' ? '5' : Math.floor(Math.random() * 3) + 1}
                </div>
                <div className="text-gray-600">연결</div>
              </div>
              <div className="text-center p-2 bg-white rounded border">
                <div className="font-semibold text-green-600">95%</div>
                <div className="text-gray-600">관련성</div>
              </div>
              <div className="text-center p-2 bg-white rounded border">
                <div className="font-semibold text-purple-600">
                  {selectedNode === 'project' ? '폴더' : 'PDF'}
                </div>
                <div className="text-gray-600">타입</div>
              </div>
            </div>
            
            <p className="text-sm text-blue-700">
              연관된 문서들과의 관계를 확인할 수 있습니다. AI가 내용을 분석하여 자동으로 연결점을 찾아냅니다.
            </p>
            
            {/* 연관 태그 */}
            <div className="flex flex-wrap gap-1 mt-3">
              {['업무규정', '회사정책', selectedNode === 'hr' ? '인사' : selectedNode === 'security' ? '보안' : '일반'].map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 기능 설명 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
        >
          <h4 className="font-semibold mb-2 flex items-center">
            <Brain className="h-4 w-4 mr-2 text-purple-600" />
            스마트 연결
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            AI가 문서 내용을 분석하여 자동으로 관련성을 찾아 연결합니다.
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-purple-600 font-medium">정확도 94%</span>
            <span className="text-gray-400">실시간 분석</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
        >
          <h4 className="font-semibold mb-2 flex items-center">
            <Network className="h-4 w-4 mr-2 text-blue-600" />
            시각화
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            복잡한 지식 구조를 직관적인 그래프로 표현하여 이해를 돕습니다.
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-600 font-medium">3D 렌더링</span>
            <span className="text-gray-400">실시간 업데이트</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow"
        >
          <h4 className="font-semibold mb-2 flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-600" />
            인사이트 도출
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            연결된 문서들에서 숨겨진 패턴과 인사이트를 자동으로 발견합니다.
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-yellow-600 font-medium">패턴 인식</span>
            <span className="text-gray-400">딥러닝 기반</span>
          </div>
        </motion.div>
      </div>
      
      {/* 추가 인터랙티브 가이드 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
      >
        <h4 className="font-semibold mb-3 flex items-center">
          <Eye className="h-4 w-4 mr-2 text-blue-600" />
          탐색 가이드
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>노드를 클릭하여 상세 정보 확인</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>줌 기능으로 그래프 확대/축소</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>뷰 모드 변경으로 다양한 관점 탐색</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>재배치 버튼으로 새로운 레이아웃 생성</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function CompleteStep() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mb-8"
      >
        <Check className="h-16 w-16 text-green-600" />
      </motion.div>
      <h1 className="text-3xl font-bold mb-4">
        축하합니다! 🎉
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-xl">
        SyncInsight의 주요 기능을 모두 살펴보셨습니다. 
        이제 실제로 사용해보며 스마트한 지식 관리를 시작해보세요!
      </p>
      <div className="space-y-3">
        <h4 className="font-medium">다음 단계:</h4>
        <div className="text-left space-y-2 text-sm">
          <p>✓ 실제 문서를 업로드하여 지식베이스 구축</p>
          <p>✓ 다양한 AI 설정을 실험하며 최적화</p>
          <p>✓ 팀원들과 지식 공유 및 협업</p>
          <p>✓ 분석 도구로 인사이트 발견</p>
        </div>
      </div>
    </div>
  )
}