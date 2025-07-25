'use client'

import { useMemo } from 'react'
import { useChatStore } from '@/stores/chatStore'
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import { motion } from 'framer-motion'
import { 
  FileText, TrendingUp, Clock, Users, 
  BarChart3, PieChartIcon, Activity, Layers
} from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export default function KnowledgeAnalytics() {
  const { documents, tags, folders, conversations } = useChatStore()

  // 문서 타입별 분포 데이터
  const documentTypeData = useMemo(() => {
    const typeCount = documents.reduce((acc, doc) => {
      const type = doc.type.toUpperCase()
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / documents.length) * 100)
    }))
  }, [documents])

  // 시간대별 활동 데이터 (최근 7일)
  const activityData = useMemo(() => {
    const days = ['월', '화', '수', '목', '금', '토', '일']
    const hours = Array.from({ length: 24 }, (_, i) => i)
    
    // 시뮬레이션 데이터 (실제로는 로그에서 가져와야 함)
    return days.map((day, dayIndex) => ({
      day,
      data: hours.map(hour => ({
        hour,
        value: Math.floor(Math.random() * 10) + (dayIndex < 5 ? 5 : 2) // 평일에 더 높은 활동
      }))
    }))
  }, [])

  // 월별 문서 접근 추이
  const accessTrendData = useMemo(() => {
    const months = ['1월', '2월', '3월', '4월', '5월', '6월']
    return months.map((month, index) => ({
      month,
      문서접근: Math.floor(Math.random() * 50) + 100 + index * 10,
      대화생성: Math.floor(Math.random() * 30) + 50 + index * 5,
      업로드: Math.floor(Math.random() * 20) + 10 + index * 2
    }))
  }, [])

  // 폴더별 문서 분포
  const folderDistributionData = useMemo(() => {
    const folderCount = folders.map(folder => ({
      name: folder.name,
      문서수: documents.filter(doc => doc.folderId === folder.id).length,
      color: folder.color
    }))
    
    // 폴더 없는 문서 추가
    const noFolderCount = documents.filter(doc => !doc.folderId).length
    if (noFolderCount > 0) {
      folderCount.push({ name: '미분류', 문서수: noFolderCount, color: '#6B7280' })
    }
    
    return folderCount.sort((a, b) => b.문서수 - a.문서수)
  }, [documents, folders])

  // 태그 클라우드 데이터
  const tagCloudData = useMemo(() => {
    return tags.map(tag => ({
      text: tag.name,
      value: tag.count,
      color: tag.color
    })).sort((a, b) => b.value - a.value)
  }, [tags])

  // AI 모델별 사용 통계 (시뮬레이션)
  const aiModelStats = useMemo(() => {
    const models = ['Gemini Flash 3.5', 'Gemini Pro', 'Claude 3', 'GPT-4']
    return models.map(model => ({
      model,
      사용횟수: Math.floor(Math.random() * 100) + 50,
      평균응답시간: (Math.random() * 2 + 0.5).toFixed(2)
    }))
  }, [])

  // 문서 카테고리별 성능 지표
  const categoryPerformance = useMemo(() => {
    const categories = ['기술문서', '정책문서', '업무문서']
    return categories.map(category => ({
      category,
      정확도: Math.floor(Math.random() * 20) + 80,
      활용도: Math.floor(Math.random() * 30) + 70,
      만족도: Math.floor(Math.random() * 15) + 85
    }))
  }, [])

  return (
    <div className="space-y-8">
      {/* 상단 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 문서</p>
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-xs text-green-600 mt-1">+12% 이번 달</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">활성 대화</p>
              <p className="text-2xl font-bold">{conversations.length}</p>
              <p className="text-xs text-green-600 mt-1">+8% 이번 주</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">평균 응답 시간</p>
              <p className="text-2xl font-bold">1.2초</p>
              <p className="text-xs text-orange-600 mt-1">-15% 개선</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">활성 태그</p>
              <p className="text-2xl font-bold">{tags.length}</p>
              <p className="text-xs text-purple-600 mt-1">+5 새로운</p>
            </div>
            <Layers className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 문서 타입 분포 - 원형 차트 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <PieChartIcon className="h-5 w-5 mr-2" />
            문서 타입 분포
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={documentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {documentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 월별 활동 추이 - 라인 차트 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            월별 활동 추이
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={accessTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="문서접근" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="대화생성" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="업로드" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 폴더별 문서 분포 - 막대 차트 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            폴더별 문서 분포
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={folderDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="문서수" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* AI 모델 성능 비교 - 레이더 차트 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            카테고리별 성능 지표
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={categoryPerformance}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="정확도" dataKey="정확도" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Radar name="활용도" dataKey="활용도" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
              <Radar name="만족도" dataKey="만족도" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* 하단 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 태그 클라우드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">인기 태그</h3>
          <div className="flex flex-wrap gap-2">
            {tagCloudData.slice(0, 20).map((tag, index) => (
              <motion.span
                key={tag.text}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1 rounded-full text-white"
                style={{
                  backgroundColor: tag.color,
                  fontSize: `${Math.min(16, 10 + tag.value / 5)}px`
                }}
              >
                {tag.text} ({tag.value})
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* AI 모델 사용 통계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">AI 모델 사용 통계</h3>
          <div className="space-y-3">
            {aiModelStats.map((stat, index) => (
              <div key={stat.model} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{stat.model}</span>
                  <span className="text-gray-500">{stat.사용횟수}회</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.사용횟수 / 150) * 100}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500">평균 응답: {stat.평균응답시간}초</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 시간대별 활동 히트맵 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">주간 활동 패턴</h3>
          <div className="space-y-2">
            {activityData.map((day, dayIndex) => (
              <div key={day.day} className="flex items-center space-x-2">
                <span className="text-xs w-8">{day.day}</span>
                <div className="flex space-x-1">
                  {day.data.slice(8, 20).map((hour, hourIndex) => (
                    <motion.div
                      key={hourIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (dayIndex * 12 + hourIndex) * 0.01 }}
                      className="w-4 h-4 rounded-sm"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${hour.value / 15})`
                      }}
                      title={`${hour.hour}시: ${hour.value}회`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span>8시</span>
              <span>14시</span>
              <span>20시</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}