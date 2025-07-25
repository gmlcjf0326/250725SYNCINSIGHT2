'use client'

import { motion } from "framer-motion"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Clock,
  Star,
  Eye,
  Users,
  Activity
} from "lucide-react"
import { useChatStore } from "@/stores/chatStore"

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

// 통계 카드 컴포넌트
const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "blue" 
}: {
  title: string
  value: string | number
  change?: string
  icon: any
  color?: string
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  )
}

export default function DashboardStats() {
  const { 
    conversations, 
    documents, 
    user, 
    tags,
    getUsageAnalytics,
    getPopularDocuments 
  } = useChatStore()

  // 기본 통계 계산
  const totalMessages = (conversations || []).reduce((sum, conv) => sum + conv.messages.length, 0)
  const avgRating = conversations
    .filter(conv => conv.rating)
    .reduce((sum, conv) => sum + (conv.rating || 0), 0) / 
    (conversations || []).filter(conv => conv.rating).length || 0

  // 주간 사용 분석 데이터
  const weeklyAnalytics = getUsageAnalytics('week')
  
  // 시간대별 활동 데이터
  const hourlyActivity = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${hour}:00`,
    conversations: Math.floor(Math.random() * 8) + 1,
    documents: Math.floor(Math.random() * 5) + 1
  }))

  // 태그별 사용량 데이터
  const tagUsageData = (tags || [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(tag => ({
      name: tag?.name || '알수없음',
      value: tag?.count || 0,
      color: tag?.color || '#6B7280'
    }))

  // 문서 타입별 분포 데이터
  const documentTypeData = [
    { name: 'PDF', value: (documents || []).filter(d => d.type === 'pdf').length },
    { name: 'DOCX', value: (documents || []).filter(d => d.type === 'docx').length },
    { name: 'MD', value: (documents || []).filter(d => d.type === 'md').length },
    { name: 'HWP', value: (documents || []).filter(d => d.type === 'hwp').length },
    { name: 'TXT', value: (documents || []).filter(d => d.type === 'txt').length }
  ].filter(item => item.value > 0)

  // 최근 7일 활동 트렌드
  const activityTrend = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return {
      date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      conversations: Math.floor(Math.random() * 15) + 5,
      documents: Math.floor(Math.random() * 8) + 2,
      queries: Math.floor(Math.random() * 25) + 10
    }
  }).reverse()

  return (
    <div className="space-y-6">
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="총 대화"
          value={(conversations || []).length}
          change="+12% 이번 주"
          icon={MessageSquare}
          color="blue"
        />
        <StatCard
          title="총 문서"
          value={documents.length}
          change="+8% 이번 주"
          icon={FileText}
          color="green"
        />
        <StatCard
          title="총 메시지"
          value={totalMessages}
          change="+24% 이번 주"
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="평균 만족도"
          value={`${avgRating.toFixed(1)}/5`}
          change="+0.3 이번 주"
          icon={Star}
          color="yellow"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 활동 트렌드 차트 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
            최근 7일 활동 트렌드
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="대화"
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stackId="1"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.6}
                  name="질문"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 시간대별 활동 패턴 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            시간대별 활동 패턴
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="hour" 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  interval={2}
                />
                <YAxis 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="conversations"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="대화"
                />
                <Line
                  type="monotone"
                  dataKey="documents"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="문서 접근"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 태그 사용량 분포 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-purple-600" />
            인기 태그 분포
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tagUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tagUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 문서 타입 분포 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl border shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-yellow-600" />
            문서 타입 분포
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={documentTypeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" fontSize={12} tick={{ fill: '#6B7280' }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  fontSize={12}
                  tick={{ fill: '#6B7280' }}
                  width={60}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 세부 통계 테이블 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl border shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-indigo-600" />
          인기 문서 순위
        </h3>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">문서명</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">카테고리</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">조회수</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">최근 접근</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">난이도</th>
              </tr>
            </thead>
            <tbody>
              {(getPopularDocuments(5) || []).map((doc, index) => (
                <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doc.title}</p>
                        <p className="text-sm text-gray-500">{doc.type.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {doc.category?.name || '일반'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{doc.metadata?.accessCount || 0}</td>
                  <td className="py-3 px-4 text-gray-500">
                    {doc.metadata?.lastAccessed?.toLocaleDateString('ko-KR') || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      doc.metadata?.difficulty === 'beginner' 
                        ? 'bg-green-100 text-green-800'
                        : doc.metadata?.difficulty === 'intermediate'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {doc.metadata?.difficulty === 'beginner' ? '초급' : 
                       doc.metadata?.difficulty === 'intermediate' ? '중급' : '고급'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}