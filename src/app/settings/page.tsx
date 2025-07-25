'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Monitor,
  Moon,
  Sun,
  Check,
  X,
  Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/stores/chatStore'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, settings, updateUser, updateSettings, updateUserPreferences } = useChatStore()
  
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    bio: ''
  })

  const [aiSettings, setAiSettings] = useState({
    model: settings.model,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    responseSpeed: settings.responseSpeed,
    streamResponse: settings.streamResponse
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    documentProcessing: true,
    systemUpdates: true,
    marketingEmails: false
  })

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(user.preferences.theme || 'light')
  const [language, setLanguage] = useState(user.preferences.language || 'ko')

  const handleSaveProfile = () => {
    updateUser({
      name: profileData.name,
      email: profileData.email
    })
    toast.success('프로필이 업데이트되었습니다.')
  }

  const handleSaveAISettings = () => {
    updateSettings(aiSettings)
    toast.success('AI 설정이 업데이트되었습니다.')
  }

  const handleSavePreferences = () => {
    updateUserPreferences({
      theme,
      language
    })
    toast.success('환경설정이 업데이트되었습니다.')
  }

  return (
    <MainLayout title="설정">
      <div className="min-h-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">프로필</TabsTrigger>
                <TabsTrigger value="ai">AI 설정</TabsTrigger>
                <TabsTrigger value="notifications">알림</TabsTrigger>
                <TabsTrigger value="preferences">환경설정</TabsTrigger>
                <TabsTrigger value="security">보안</TabsTrigger>
              </TabsList>

              {/* 프로필 탭 */}
              <TabsContent value="profile" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.role === 'admin' ? '관리자' : '일반 사용자'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">이름</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">이메일</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">자기소개</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="간단한 자기소개를 작성해주세요..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* AI 설정 탭 */}
              <TabsContent value="ai" className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="model">AI 모델</Label>
                    <Select
                      value={aiSettings.model}
                      onValueChange={(value) => setAiSettings({ ...aiSettings, model: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-flash-3.5">Gemini Flash 3.5</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="temperature">창의성 (Temperature): {aiSettings.temperature}</Label>
                    <Slider
                      id="temperature"
                      value={[aiSettings.temperature]}
                      onValueChange={([value]) => setAiSettings({ ...aiSettings, temperature: value })}
                      min={0}
                      max={1}
                      step={0.1}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      낮을수록 일관된 답변, 높을수록 창의적인 답변
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="maxTokens">최대 토큰 수: {aiSettings.maxTokens}</Label>
                    <Slider
                      id="maxTokens"
                      value={[aiSettings.maxTokens]}
                      onValueChange={([value]) => setAiSettings({ ...aiSettings, maxTokens: value })}
                      min={500}
                      max={4000}
                      step={100}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="responseSpeed">응답 속도</Label>
                    <Select
                      value={aiSettings.responseSpeed}
                      onValueChange={(value) => setAiSettings({ ...aiSettings, responseSpeed: value as any })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">빠름</SelectItem>
                        <SelectItem value="normal">보통</SelectItem>
                        <SelectItem value="careful">신중</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="streamResponse">실시간 스트리밍</Label>
                      <p className="text-xs text-gray-500">응답을 실시간으로 표시합니다</p>
                    </div>
                    <Switch
                      id="streamResponse"
                      checked={aiSettings.streamResponse}
                      onCheckedChange={(checked) => setAiSettings({ ...aiSettings, streamResponse: checked })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveAISettings}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* 알림 설정 탭 */}
              <TabsContent value="notifications" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    알림 설정
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">이메일 알림</Label>
                        <p className="text-xs text-gray-500">중요한 업데이트를 이메일로 받습니다</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">푸시 알림</Label>
                        <p className="text-xs text-gray-500">브라우저 푸시 알림을 받습니다</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="documentProcessing">문서 처리 완료</Label>
                        <p className="text-xs text-gray-500">문서 처리가 완료되면 알림을 받습니다</p>
                      </div>
                      <Switch
                        id="documentProcessing"
                        checked={notificationSettings.documentProcessing}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, documentProcessing: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="systemUpdates">시스템 업데이트</Label>
                        <p className="text-xs text-gray-500">새로운 기능 및 업데이트 알림</p>
                      </div>
                      <Switch
                        id="systemUpdates"
                        checked={notificationSettings.systemUpdates}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketingEmails">마케팅 이메일</Label>
                        <p className="text-xs text-gray-500">프로모션 및 이벤트 정보</p>
                      </div>
                      <Switch
                        id="marketingEmails"
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({ ...notificationSettings, marketingEmails: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => toast.success('알림 설정이 업데이트되었습니다.')}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* 환경설정 탭 */}
              <TabsContent value="preferences" className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="theme">테마</Label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'light' ? 'border-primary' : 'border-gray-200'
                        }`}
                      >
                        <Sun className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">라이트</p>
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'dark' ? 'border-primary' : 'border-gray-200'
                        }`}
                      >
                        <Moon className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">다크</p>
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          theme === 'system' ? 'border-primary' : 'border-gray-200'
                        }`}
                      >
                        <Monitor className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">시스템</p>
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="language">언어</Label>
                    <Select
                      value={language}
                      onValueChange={(value) => setLanguage(value as 'ko' | 'en')}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ko">한국어</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSavePreferences}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* 보안 탭 */}
              <TabsContent value="security" className="p-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    보안 설정
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">비밀번호 변경</h4>
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4 mr-2" />
                          변경
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">마지막 변경: 30일 전</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">2단계 인증</h4>
                        <Button variant="outline" size="sm">
                          활성화
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">계정 보안을 강화합니다</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">로그인 기록</h4>
                        <Button variant="outline" size="sm">
                          보기
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">최근 로그인 활동을 확인합니다</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">데이터 백업</h4>
                        <Button variant="outline" size="sm">
                          <Database className="h-4 w-4 mr-2" />
                          백업
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">모든 데이터를 안전하게 백업합니다</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}