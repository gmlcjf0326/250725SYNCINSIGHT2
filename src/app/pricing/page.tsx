'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Check, X, Zap, Shield, Crown, Brain, 
  MessageSquare, FileText, BarChart3, Users,
  Sparkles, Clock, Download, Headphones
} from 'lucide-react'
import { toast } from 'sonner'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  badge?: string
  badgeColor?: string
  icon: React.ComponentType<any>
  features: {
    name: string
    included: boolean
    limit?: string
  }[]
  popular?: boolean
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: '무료',
    description: '개인 사용자를 위한 기본 기능',
    price: {
      monthly: 0,
      yearly: 0
    },
    badge: '무료 체험',
    badgeColor: 'bg-gray-100 text-gray-700',
    icon: Brain,
    features: [
      { name: '월 100개 AI 대화', included: true, limit: '100회/월' },
      { name: '문서 업로드', included: true, limit: '최대 10개' },
      { name: '기본 검색 기능', included: true },
      { name: '1개 AI 모델', included: true },
      { name: '기본 지식 그래프', included: true },
      { name: '이메일 지원', included: true },
      { name: '다중 AI 응답', included: false },
      { name: '고급 분석', included: false },
      { name: '우선순위 지원', included: false },
      { name: 'API 접근', included: false }
    ]
  },
  {
    id: 'pro',
    name: '프로',
    description: '전문가와 소규모 팀을 위한 고급 기능',
    price: {
      monthly: 29,
      yearly: 290
    },
    badge: '인기',
    badgeColor: 'bg-blue-100 text-blue-700',
    icon: Zap,
    popular: true,
    features: [
      { name: '무제한 AI 대화', included: true },
      { name: '문서 업로드', included: true, limit: '최대 1,000개' },
      { name: '고급 검색 및 필터', included: true },
      { name: '모든 AI 모델 접근', included: true },
      { name: '고급 지식 그래프', included: true },
      { name: '다중 AI 응답 비교', included: true },
      { name: '상세 분석 대시보드', included: true },
      { name: '폴더 관리 무제한', included: true },
      { name: '우선순위 이메일 지원', included: true },
      { name: 'API 접근 (제한적)', included: true, limit: '1,000회/월' }
    ]
  },
  {
    id: 'enterprise',
    name: '엔터프라이즈',
    description: '대규모 조직을 위한 맞춤형 솔루션',
    price: {
      monthly: 99,
      yearly: 990
    },
    badge: '최고 가치',
    badgeColor: 'bg-purple-100 text-purple-700',
    icon: Crown,
    features: [
      { name: '무제한 AI 대화', included: true },
      { name: '무제한 문서 업로드', included: true },
      { name: '엔터프라이즈 검색', included: true },
      { name: '모든 AI 모델 + 커스텀', included: true },
      { name: '고급 지식 그래프 + 협업', included: true },
      { name: '무제한 다중 AI 비교', included: true },
      { name: '고급 분석 + 보고서', included: true },
      { name: '팀 관리 및 권한 제어', included: true },
      { name: '24/7 전화 지원', included: true },
      { name: '무제한 API 접근', included: true }
    ]
  }
]

const faqs = [
  {
    question: '언제든지 플랜을 변경할 수 있나요?',
    answer: '네, 언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 다음 결제 주기부터 적용됩니다.'
  },
  {
    question: '무료 플랜에는 어떤 제한이 있나요?',
    answer: '무료 플랜은 월 100개의 AI 대화, 최대 10개의 문서 업로드, 그리고 기본 기능들로 제한됩니다.'
  },
  {
    question: '연간 결제 시 할인이 있나요?',
    answer: '네, 연간 결제 시 월간 결제 대비 약 17% 할인된 가격으로 이용하실 수 있습니다.'
  },
  {
    question: '기업용 플랜에는 어떤 추가 기능이 있나요?',
    answer: '기업용 플랜에는 팀 관리, 권한 제어, 24/7 전화 지원, 무제한 API 접근, 커스텀 AI 모델 등이 포함됩니다.'
  },
  {
    question: '데이터 보안은 어떻게 보장되나요?',
    answer: '모든 데이터는 암호화되어 저장되며, SOC 2 Type II 인증을 받은 보안 기준을 준수합니다.'
  },
  {
    question: '환불 정책은 어떻게 되나요?',
    answer: '30일 내 100% 환불이 가능합니다. 서비스에 만족하지 않으시면 언제든 연락주세요.'
  }
]

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId)
    const plan = pricingPlans.find(p => p.id === planId)
    if (plan) {
      if (planId === 'free') {
        toast.success('무료 플랜으로 시작합니다!')
      } else {
        toast.success(`${plan.name} 플랜 구독을 시작합니다!`)
        // 실제 환경에서는 결제 시스템 연동 (Stripe, PayPal 등)
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price)
  }

  return (
    <MainLayout title="요금제">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* 헤더 섹션 */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              >
                모든 팀을 위한 <span className="text-blue-600">AI 솔루션</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              >
                개인부터 기업까지, 규모에 맞는 최적의 AI 지식 관리 솔루션을 선택하세요.
                30일 무료 체험으로 시작해보세요.
              </motion.p>

              {/* 빌링 토글 */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center space-x-4 mb-12"
              >
                <span className={billingCycle === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                  월간 결제
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={billingCycle === 'yearly' ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                  연간 결제
                </span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-green-100 text-green-700 ml-2">
                    17% 할인
                  </Badge>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* 요금제 카드 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-white border-2 border-blue-500 shadow-xl scale-105' 
                    : 'bg-white border border-gray-200 shadow-lg'
                }`}
              >
                {/* 인기 배지 */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      가장 인기
                    </div>
                  </div>
                )}

                {/* 플랜 헤더 */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <plan.icon className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  {plan.badge && (
                    <Badge className={plan.badgeColor}>
                      {plan.badge}
                    </Badge>
                  )}
                </div>

                {/* 가격 */}
                <div className="text-center mb-8">
                  <div className="flex items-end justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      ₩{formatPrice(plan.price[billingCycle])}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? '월' : '년'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      월 ₩{formatPrice(Math.floor(plan.price.yearly / 12))} 상당
                    </p>
                  )}
                </div>

                {/* 기능 목록 */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-500'}`}>
                        {feature.name}
                        {feature.limit && (
                          <span className="text-gray-500 ml-1">({feature.limit})</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* 구독 버튼 */}
                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {selectedPlan === plan.id ? (
                    '처리 중...'
                  ) : plan.id === 'free' ? (
                    '무료로 시작하기'
                  ) : (
                    `${plan.name} 플랜 시작하기`
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 추가 기능 섹션 */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                모든 플랜에 포함된 기능
              </h2>
              <p className="text-lg text-gray-600">
                어떤 플랜을 선택하시든 기본적으로 제공되는 강력한 기능들
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: 'AI 대화',
                  description: '자연스러운 대화형 AI 인터페이스'
                },
                {
                  icon: FileText,
                  title: '문서 관리',
                  description: '스마트한 문서 업로드 및 검색'
                },
                {
                  icon: BarChart3,
                  title: '분석 도구',
                  description: '사용 패턴 및 성과 분석'
                },
                {
                  icon: Shield,
                  title: '보안',
                  description: '엔터프라이즈급 보안 및 암호화'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-center"
                >
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                자주 묻는 질문
              </h2>
              <p className="text-lg text-gray-600">
                궁금한 점이 있으시면 언제든 문의해주세요
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA 섹션 */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              지금 시작해보세요
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              30일 무료 체험으로 AI 지식 관리의 힘을 경험해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => handleSubscribe('free')}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                무료로 시작하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => window.open('mailto:support@syncinsight.ai')}
              >
                <Headphones className="h-5 w-5 mr-2" />
                문의하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}