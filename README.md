# SyncInsight - AI Knowledge Management System

SyncInsight는 RAG(Retrieval-Augmented Generation) 기반의 지능형 지식 관리 시스템입니다.

## 🚀 주요 기능

- **AI 챗봇**: 자연어로 질문하고 정확한 답변을 즉시 받아보세요
- **통합 지식베이스**: 문서, 파일, 데이터를 하나로 연결하여 관리
- **다중 AI 모델**: 여러 AI 모델의 응답을 동시에 비교
- **지식 그래프**: 문서 간의 관계를 시각적으로 탐색
- **실시간 분석**: 사용 패턴과 인사이트를 대시보드에서 확인

## 🛠️ 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Animation**: Framer Motion
- **UI Components**: Radix UI, shadcn/ui
- **Deployment**: Vercel

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 🌐 Vercel 배포 가이드

### 방법 1: Vercel 대시보드를 통한 배포

1. [Vercel](https://vercel.com)에 로그인
2. "Import Git Repository" 클릭
3. GitHub 저장소 연결: `https://github.com/gmlcjf0326/250725SYNCINSIGHT2`
4. 프로젝트 설정:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Deploy 클릭

### 방법 2: Git Push를 통한 자동 배포

1. GitHub에 코드 푸시:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. Vercel이 자동으로 변경 사항을 감지하고 배포합니다.

### 환경 변수 설정 (선택사항)

Vercel 대시보드에서 다음 환경 변수를 설정할 수 있습니다:

```
NEXT_PUBLIC_API_URL=your-api-url
```

## 📱 주요 페이지

- `/` - 메인 랜딩 페이지
- `/chat` - AI 채팅 인터페이스
- `/knowledge` - 지식베이스 관리
- `/dashboard` - 분석 대시보드
- `/multi-ai` - 다중 AI 모델 비교
- `/pricing` - 요금제 안내

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── chat/              # 채팅 인터페이스
│   ├── knowledge/         # 지식베이스 관리
│   ├── dashboard/         # 분석 대시보드
│   └── multi-ai/          # 다중 AI 비교
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── chat/             # 채팅 관련 컴포넌트
│   └── knowledge/        # 지식베이스 관련 컴포넌트
├── lib/                  # 유틸리티 및 서비스
├── stores/               # Zustand 상태 관리
└── types/                # TypeScript 타입 정의
```

## 🎨 디자인 시스템

- **Primary Colors**: Blue to Purple Gradient
- **Typography**: Inter Font Family
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 🔒 보안

- 모든 데이터는 암호화되어 저장됩니다
- 사용자 인증 및 권한 관리 시스템
- 안전한 API 통신

## 📝 라이선스

이 프로젝트는 비공개 소스입니다.

## 👥 기여

문제를 발견하셨거나 개선 사항이 있으시면 이슈를 생성해 주세요.

---

© 2024 SyncInsight. All rights reserved.