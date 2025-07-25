'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import DemoModal from '@/components/DemoModal'
import { MessageCircle, BookOpen, Users, Zap, ArrowRight, Star, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const features = [
  {
    icon: MessageCircle,
    title: "지능형 AI 챗봇",
    description: "자연어로 질문하고 정확한 답변을 즉시 받아보세요"
  },
  {
    icon: BookOpen,
    title: "통합 지식베이스",
    description: "문서, 파일, 데이터를 하나로 연결하여 관리합니다"
  },
  {
    icon: Users,
    title: "팀 협업 지원",
    description: "조직 구성원들과 지식을 공유하고 협업하세요"
  },
  {
    icon: Zap,
    title: "실시간 학습",
    description: "새로운 정보를 추가할 때마다 AI가 자동으로 학습합니다"
  }
]

const testimonials = [
  {
    name: "김지현",
    role: "IT 팀장",
    company: "테크코리아",
    content: "SyncInsight 덕분에 팀의 지식 공유가 획기적으로 개선되었습니다.",
    rating: 5
  },
  {
    name: "박민수",
    role: "프로덕트 매니저",
    company: "이노베이션랩",
    content: "복잡한 문서에서 필요한 정보를 찾는 시간이 90% 단축되었어요.",
    rating: 5
  },
  {
    name: "이소영",
    role: "HR 디렉터",
    company: "글로벌텍",
    content: "직원들의 업무 효율성이 눈에 띄게 향상되었습니다.",
    rating: 5
  }
]

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false)
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">SyncInsight</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground">기능</button>
            <button onClick={() => scrollToSection('testimonials')} className="text-muted-foreground hover:text-foreground">후기</button>
            <button onClick={() => scrollToSection('pricing')} className="text-muted-foreground hover:text-foreground">요금제</button>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">로그인</Button>
            <Button asChild>
              <Link href="/chat">시작하기</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI로 더 스마트한<br />지식 관리를 경험하세요
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              RAG 기반 AI 기술로 조직의 모든 지식을 연결하고, 
              자연어 질문만으로 필요한 정보를 즉시 찾아보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/chat">
                  무료로 시작하기 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6"
                onClick={() => setDemoOpen(true)}
              >
                데모 보기
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              강력한 기능들
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              SyncInsight의 혁신적인 기능들로 업무 효율성을 극대화하세요
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              고객 후기
            </h2>
            <p className="text-muted-foreground text-lg">
              실제 사용자들의 생생한 경험담을 들어보세요
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-background p-6 rounded-xl shadow-sm border"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              합리적인 요금제
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              팀 규모와 필요에 맞는 플랜을 선택하세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-background p-8 rounded-xl border hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-2">무료</h3>
              <p className="text-muted-foreground mb-4">개인 사용자를 위한 기본 기능</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₩0</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>월 100개 AI 대화</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>최대 10개 문서</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>기본 검색 기능</span>
                </li>
              </ul>
              <Button variant="outline" asChild className="w-full">
                <Link href="/chat">무료로 시작하기</Link>
              </Button>
            </motion.div>
            
            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background p-8 rounded-xl border-2 border-blue-500 hover:shadow-lg transition-shadow relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  인기
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">프로</h3>
              <p className="text-muted-foreground mb-4">전문가와 소규모 팀을 위한 고급 기능</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₩29,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>무제한 AI 대화</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>최대 1,000개 문서</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>고급 검색 및 분석</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>다중 AI 모델 접근</span>
                </li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/pricing">프로 시작하기</Link>
              </Button>
            </motion.div>
            
            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background p-8 rounded-xl border hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-2">엔터프라이즈</h3>
              <p className="text-muted-foreground mb-4">대규모 조직을 위한 맞춤형 솔루션</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">₩99,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>무제한 모든 기능</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>무제한 문서 및 사용자</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>커스텀 AI 모델</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>24/7 전담 지원</span>
                </li>
              </ul>
              <Button variant="outline" asChild className="w-full">
                <Link href="/pricing">문의하기</Link>
              </Button>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              모든 플랜에는 30일 무료 체험이 포함됩니다. 신용카드 없이 시작하세요.
            </p>
            <Button variant="link" asChild className="mt-4">
              <Link href="/pricing">
                전체 기능 비교 보기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl mb-8 opacity-90">
            무료 체험으로 SyncInsight의 강력함을 직접 경험해보세요
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/chat">
              무료 체험 시작하기 <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="text-lg font-semibold text-foreground">SyncInsight</span>
          </div>
          <p>&copy; 2024 SyncInsight. All rights reserved.</p>
        </div>
      </footer>
      
      {/* 데모 모달 */}
      <DemoModal 
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
      />
    </div>
  )
}