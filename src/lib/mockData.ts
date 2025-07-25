import type { 
  Document, 
  DocumentSource, 
  Message, 
  Conversation, 
  User, 
  Folder, 
  Tag,
  DocumentCategory,
  ConversationCategory 
} from "@/types"

// Mock 사용자 데이터
export const mockUser: User = {
  id: 'user1',
  name: '김지혜',
  email: 'jihye.kim@syncinsight.com',
  avatar: '/avatars/user1.jpg',
  role: 'user',
  preferences: {
    theme: 'light',
    language: 'ko',
    timezone: 'Asia/Seoul',
    notifications: {
      email: true,
      push: true,
      documentUpdates: true,
      conversationReplies: true
    },
    ui: {
      sidebarCollapsed: false,
      showSourcePanel: true,
      messageAnimation: true,
      compactMode: false,
      showTimestamps: true
    }
  },
  stats: {
    totalConversations: 45,
    totalMessages: 127,
    totalDocuments: 8,
    averageSessionTime: 1800,
    mostUsedTags: ['인사', '보안', '프로젝트'],
    documentsUploaded: 3,
    lastActiveAt: new Date()
  },
  createdAt: new Date('2024-01-01')
}

// Mock 폴더 데이터
export const mockFolders: Folder[] = [
  {
    id: 'folder1',
    name: '업무 규정',
    color: '#3B82F6',
    icon: 'FileText',
    type: 'document',
    createdAt: new Date('2024-01-10'),
    order: 0
  },
  {
    id: 'folder2',
    name: '프로젝트 관리',
    color: '#10B981',
    icon: 'Folder',
    type: 'document',
    createdAt: new Date('2024-01-15'),
    order: 1
  },
  {
    id: 'folder3',
    name: '일반 문의',
    color: '#F59E0B',
    icon: 'MessageCircle',
    type: 'conversation',
    createdAt: new Date('2024-01-20'),
    order: 0
  },
  {
    id: 'folder4',
    name: '기술 지원',
    color: '#EF4444',
    icon: 'Settings',
    type: 'conversation',
    createdAt: new Date('2024-01-25'),
    order: 1
  }
]

// Mock 태그 데이터
export const mockTags: Tag[] = [
  {
    id: 'tag1',
    name: '인사',
    color: '#3B82F6',
    count: 12,
    category: 'auto',
    createdAt: new Date('2024-01-10')
  },
  {
    id: 'tag2',
    name: '보안',
    color: '#EF4444',
    count: 8,
    category: 'auto',
    createdAt: new Date('2024-01-12')
  },
  {
    id: 'tag3',
    name: '프로젝트',
    color: '#10B981',
    count: 15,
    category: 'manual',
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'tag4',
    name: '회계',
    color: '#F59E0B',
    count: 6,
    category: 'auto',
    createdAt: new Date('2024-01-18')
  },
  {
    id: 'tag5',
    name: '긴급',
    color: '#DC2626',
    count: 3,
    category: 'manual',
    createdAt: new Date('2024-01-20')
  }
]

// Mock 문서 카테고리
export const mockDocumentCategories: DocumentCategory[] = [
  {
    id: 'cat1',
    name: '정책 및 규정',
    color: '#3B82F6',
    icon: 'Shield'
  },
  {
    id: 'cat2',
    name: '업무 가이드',
    color: '#10B981',
    icon: 'BookOpen'
  },
  {
    id: 'cat3',
    name: '기술 문서',
    color: '#8B5CF6',
    icon: 'Code'
  }
]

// Mock 대화 카테고리
export const mockConversationCategories: ConversationCategory[] = [
  {
    id: 'conv-cat1',
    name: '일반 질문',
    color: '#6B7280',
    icon: 'MessageCircle'
  },
  {
    id: 'conv-cat2',
    name: '기술 지원',
    color: '#3B82F6',
    icon: 'Settings'
  },
  {
    id: 'conv-cat3',
    name: '정책 문의',
    color: '#F59E0B',
    icon: 'HelpCircle'
  }
]

// 한국 기업 환경에 맞는 Mock 문서 데이터
export const mockDocuments: Document[] = [
  {
    id: 'doc1',
    title: '인사 관리 규정',
    content: `제1장 총칙
제1조 (목적) 이 규정은 회사의 인사관리에 관한 제반사항을 정함으로써 직원의 근무질서를 확립하고 합리적인 인사행정을 도모함을 목적으로 한다.

제2조 (적용범위) 이 규정은 회사의 모든 직원에게 적용한다.

제2장 채용
제3조 (채용원칙) 회사는 적격자를 공정하게 선발하여 채용한다.
- 서류전형
- 필기시험 (해당자)
- 면접전형
- 신체검사

제3장 휴가
제4조 (연차휴가) 
- 입사 1년 후부터 15일 부여
- 3년 이상 근무시 매년 2일씩 추가 (최대 25일)
- 미사용 연차는 다음연도로 이월 불가

제5조 (병가)
- 연간 10일까지 사용 가능
- 3일 이상 시 의사 진단서 필요`,
    type: 'pdf',
    uploadDate: new Date('2024-01-15'),
    fileSize: 245000,
    tags: ['tag1', 'tag3'],
    processed: true,
    folderId: 'folder1',
    category: mockDocumentCategories[0],
    metadata: {
      author: 'HR 팀',
      keywords: ['인사', '휴가', '채용', '규정'],
      summary: '회사 인사 관리에 관한 전반적인 규정을 다루는 문서로, 채용 절차와 휴가 제도에 대한 상세한 내용을 포함합니다.',
      language: 'ko',
      readingTime: 8,
      difficulty: 'beginner',
      lastAccessed: new Date('2024-01-22'),
      accessCount: 24
    },
    relationships: [
      {
        targetDocumentId: 'doc2',
        type: 'reference',
        strength: 0.3,
        context: '보안 정책과 연관된 인사 규정'
      }
    ],
    version: 2,
    versions: [
      {
        id: 'v1-doc1',
        version: 1,
        changes: '초기 버전 생성',
        timestamp: new Date('2024-01-15'),
        userId: 'user1'
      },
      {
        id: 'v2-doc1',
        version: 2,
        changes: '병가 규정 업데이트',
        timestamp: new Date('2024-01-20'),
        userId: 'user1'
      }
    ],
    chunks: [
      {
        id: 'chunk1-1',
        content: '연차휴가는 입사 1년 후부터 15일이 부여되며, 3년 이상 근무 시 매년 2일씩 추가됩니다.',
        documentId: 'doc1',
        chunkIndex: 0,
        metadata: { page: 12, section: '휴가', headings: ['제3장 휴가', '제4조 연차휴가'] }
      },
      {
        id: 'chunk1-2',
        content: '병가는 연간 10일까지 사용 가능하며, 3일 이상 사용 시 의사 진단서가 필요합니다.',
        documentId: 'doc1',
        chunkIndex: 1,
        metadata: { page: 12, section: '휴가', headings: ['제3장 휴가', '제5조 병가'] }
      }
    ]
  },
  {
    id: 'doc2',
    title: '정보보안 정책',
    content: `정보보안 정책 및 절차

1. 개요
본 정책은 회사의 정보자산을 보호하고 정보보안 사고를 예방하기 위해 수립되었습니다.

2. 적용범위
- 모든 임직원
- 협력업체 및 외부 방문자
- 회사의 모든 정보시스템

3. 보안 원칙
- 기밀성 (Confidentiality)
- 무결성 (Integrity) 
- 가용성 (Availability)

4. 패스워드 정책
- 최소 8자 이상
- 영문 대소문자, 숫자, 특수문자 조합
- 3개월마다 변경
- 이전 3개 패스워드 재사용 금지

5. 접근 통제
- 업무상 필요한 최소한의 권한만 부여
- 정기적인 접근권한 검토
- 퇴사자 즉시 권한 회수`,
    type: 'docx',
    uploadDate: new Date('2024-02-20'),
    fileSize: 180000,
    tags: ['tag2'],
    processed: true,
    folderId: 'folder1',
    category: mockDocumentCategories[0],
    metadata: {
      author: 'IT 보안팀',
      keywords: ['보안', '정책', '패스워드', '접근통제', 'CIA'],
      summary: '회사의 정보자산 보호를 위한 종합적인 보안 정책 문서로, 패스워드 정책과 접근 통제에 대한 구체적인 가이드라인을 제시합니다.',
      language: 'ko',
      readingTime: 6,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-02-25'),
      accessCount: 18
    },
    relationships: [
      {
        targetDocumentId: 'doc1',
        type: 'reference',
        strength: 0.3,
        context: '인사 규정과 연관된 보안 정책'
      },
      {
        targetDocumentId: 'doc3',
        type: 'similar',
        strength: 0.6,
        context: '업무 프로세스 내 보안 요소'
      }
    ],
    version: 1,
    versions: [
      {
        id: 'v1-doc2',
        version: 1,
        changes: '초기 보안 정책 문서 생성',
        timestamp: new Date('2024-02-20'),
        userId: 'user1'
      }
    ],
    chunks: [
      {
        id: 'chunk2-1',
        content: '패스워드는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 조합해야 합니다.',
        documentId: 'doc2',
        chunkIndex: 0,
        metadata: { section: '패스워드 정책', headings: ['4. 패스워드 정책'] }
      }
    ]
  },
  {
    id: 'doc3',
    title: '업무 프로세스 가이드',
    content: `업무 프로세스 관리 가이드

1. 프로젝트 관리 프로세스
- 기획 단계: 요구사항 분석 및 계획 수립
- 설계 단계: 시스템 설계 및 아키텍처 정의
- 개발 단계: 코딩 및 단위 테스트
- 테스트 단계: 통합 테스트 및 사용자 테스트
- 배포 단계: 운영 환경 배포 및 모니터링

2. 품질 관리
- 코드 리뷰 필수
- 테스트 커버리지 80% 이상
- 문서화 의무

3. 커뮤니케이션
- 일일 스탠드업 미팅
- 주간 진행상황 보고
- 분기별 회고 미팅

4. 이슈 관리
- 이슈 등록 및 분류
- 우선순위 설정
- 해결 과정 추적`,
    type: 'md',
    uploadDate: new Date('2024-03-10'),
    fileSize: 95000,
    tags: ['tag3'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: '개발팀',
      keywords: ['프로세스', '프로젝트', '품질관리', '커뮤니케이션', '이슈관리'],
      summary: '효율적인 업무 진행을 위한 프로젝트 관리 프로세스와 품질 관리 가이드라인을 제시하는 실무 중심 문서입니다.',
      language: 'ko',
      readingTime: 5,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-03-15'),
      accessCount: 32
    },
    relationships: [
      {
        targetDocumentId: 'doc2',
        type: 'similar',
        strength: 0.6,
        context: '프로세스 내 보안 요소'
      }
    ],
    version: 1,
    versions: [
      {
        id: 'v1-doc3',
        version: 1,
        changes: '업무 프로세스 가이드 초기 작성',
        timestamp: new Date('2024-03-10'),
        userId: 'user1'
      }
    ],
    chunks: [
      {
        id: 'chunk3-1',
        content: '프로젝트는 기획, 설계, 개발, 테스트, 배포 단계로 진행됩니다.',
        documentId: 'doc3',
        chunkIndex: 0,
        metadata: { section: '프로젝트 관리', headings: ['1. 프로젝트 관리 프로세스'] }
      }
    ]
  },
  {
    id: 'doc4',
    title: '회계 처리 절차',
    content: `회계 처리 및 결산 절차

1. 일반 원칙
- 복식부기 원칙 준수
- 회계기준 (K-IFRS) 적용
- 증빙서류 보관 의무

2. 매입/매출 관리
- 세금계산서 발행/수령
- 전자세금계산서 시스템 활용
- 부가세 신고 및 납부

3. 경비 처리
- 법인카드 사용 원칙
- 접대비 한도 관리
- 증빙서류 첨부 필수

4. 급여 관리
- 근로소득세 원천징수
- 4대보험 처리
- 연말정산 업무

5. 월별 마감
- 매월 15일까지 전월 마감
- 시산표 작성 및 검토
- 관리 보고서 작성`,
    type: 'hwp',
    uploadDate: new Date('2024-02-28'),
    fileSize: 156000,
    tags: ['tag4'],
    processed: true,
    folderId: 'folder1',
    category: mockDocumentCategories[0],
    metadata: {
      author: '회계팀',
      keywords: ['회계', '결산', '세무', '급여', 'K-IFRS'],
      summary: '회계 처리 업무와 관련된 전반적인 절차를 설명하는 문서로, 매입/매출 관리부터 월별 마감까지의 과정을 다룹니다.',
      language: 'ko',
      readingTime: 7,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-01'),
      accessCount: 12
    },
    relationships: [],
    version: 1,
    versions: [
      {
        id: 'v1-doc4',
        version: 1,
        changes: '회계 처리 절차 문서 생성',
        timestamp: new Date('2024-02-28'),
        userId: 'user1'
      }
    ],
    chunks: []
  }
]

// 대화 기록 Mock 데이터
export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    title: '휴가 규정 문의',
    messages: [
      {
        id: 'msg1',
        content: '연차휴가는 얼마나 받을 수 있나요?',
        role: 'user',
        timestamp: new Date('2024-01-20T09:30:00')
      },
      {
        id: 'msg2',
        content: '연차휴가는 입사 1년 후부터 15일이 부여됩니다. 3년 이상 근무하신 경우 매년 2일씩 추가되어 최대 25일까지 받으실 수 있습니다.',
        role: 'assistant',
        timestamp: new Date('2024-01-20T09:30:30'),
        confidence: 0.95,
        sources: [
          {
            id: 'doc1',
            title: '인사 관리 규정',
            excerpt: '연차휴가는 입사 1년 후부터 15일이 부여되며, 3년 이상 근무 시 매년 2일씩 추가됩니다.',
            relevanceScore: 0.96,
            documentType: 'pdf',
            page: 12
          }
        ]
      }
    ],
    createdAt: new Date('2024-01-20T09:30:00'),
    updatedAt: new Date('2024-01-20T09:35:00'),
    folderId: 'folder3',
    tags: ['tag1'],
    pinned: true,
    archived: false,
    shared: false,
    category: mockConversationCategories[2],
    summary: '회사 연차휴가 규정에 대한 문의 및 답변',
    rating: 5
  },
  {
    id: 'conv2',
    title: '보안 정책 확인',
    messages: [
      {
        id: 'msg3',
        content: '패스워드 정책이 어떻게 되나요?',
        role: 'user',
        timestamp: new Date('2024-02-22T14:15:00')
      },
      {
        id: 'msg4',
        content: '패스워드는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 조합해야 합니다. 또한 3개월마다 변경하셔야 하고, 이전 3개 패스워드는 재사용할 수 없습니다.',
        role: 'assistant',
        timestamp: new Date('2024-02-22T14:15:45'),
        confidence: 0.92,
        sources: [
          {
            id: 'doc2',
            title: '정보보안 정책',
            excerpt: '패스워드는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 조합해야 합니다.',
            relevanceScore: 0.98,
            documentType: 'docx'
          }
        ]
      }
    ],
    createdAt: new Date('2024-02-22T14:15:00'),
    updatedAt: new Date('2024-02-22T14:20:00'),
    folderId: 'folder4',
    tags: ['tag2', 'tag5'],
    pinned: false,
    archived: false,
    shared: true,
    category: mockConversationCategories[1],
    summary: '회사 패스워드 정책에 대한 기술 지원 요청',
    rating: 4
  },
  {
    id: 'conv3',
    title: '프로젝트 진행 프로세스 질문',
    messages: [
      {
        id: 'msg5',
        content: '새로운 프로젝트를 시작할 때 어떤 단계로 진행해야 하나요?',
        role: 'user',
        timestamp: new Date('2024-03-12T11:20:00')
      },
      {
        id: 'msg6',
        content: '프로젝트는 다음 5단계로 진행됩니다: 1) 기획 단계에서 요구사항 분석 및 계획 수립, 2) 설계 단계에서 시스템 설계 및 아키텍처 정의, 3) 개발 단계에서 코딩 및 단위 테스트, 4) 테스트 단계에서 통합 테스트 및 사용자 테스트, 5) 배포 단계에서 운영 환경 배포 및 모니터링을 수행합니다.',
        role: 'assistant',
        timestamp: new Date('2024-03-12T11:20:45'),
        confidence: 0.91,
        sources: [
          {
            id: 'doc3',
            title: '업무 프로세스 가이드',
            excerpt: '프로젝트는 기획, 설계, 개발, 테스트, 배포 단계로 진행됩니다.',
            relevanceScore: 0.94,
            documentType: 'md'
          }
        ]
      }
    ],
    createdAt: new Date('2024-03-12T11:20:00'),
    updatedAt: new Date('2024-03-12T11:25:00'),
    folderId: 'folder4',
    tags: ['tag3'],
    pinned: false,
    archived: false,
    shared: false,
    category: mockConversationCategories[1],
    summary: '프로젝트 관리 프로세스에 대한 가이드 요청'
  }
]

// 빠른 질문 제안
export const quickQuestions = [
  '연차휴가는 얼마나 받을 수 있나요?',
  '병가 사용 시 필요한 서류는?',
  '패스워드 정책이 어떻게 되나요?',
  '프로젝트 진행 프로세스를 알려주세요',
  '경비 처리는 어떻게 하나요?',
  '회계 마감 일정은?'
]

// AI 응답을 위한 키워드 매칭 시스템
export const responseTemplates = [
  {
    keywords: ['휴가', '연차', '병가', '특별휴가'],
    responses: [
      {
        condition: (query: string) => query.includes('연차'),
        response: '연차휴가는 입사 1년 후부터 15일이 부여됩니다. 3년 이상 근무하신 경우 매년 2일씩 추가되어 최대 25일까지 받으실 수 있습니다. 미사용 연차는 다음연도로 이월되지 않습니다.',
        confidence: 0.95,
        sources: [mockDocuments[0]]
      },
      {
        condition: (query: string) => query.includes('병가'),
        response: '병가는 연간 10일까지 사용 가능합니다. 3일 이상 사용하실 경우 의사 진단서를 제출하셔야 합니다.',
        confidence: 0.93,
        sources: [mockDocuments[0]]
      }
    ]
  },
  {
    keywords: ['보안', '패스워드', '비밀번호', '접근', '권한'],
    responses: [
      {
        condition: (query: string) => query.includes('패스워드') || query.includes('비밀번호'),
        response: '패스워드는 최소 8자 이상이며, 영문 대소문자, 숫자, 특수문자를 조합해야 합니다. 3개월마다 변경하셔야 하고, 이전 3개 패스워드는 재사용할 수 없습니다.',
        confidence: 0.96,
        sources: [mockDocuments[1]]
      },
      {
        condition: (query: string) => query.includes('접근') || query.includes('권한'),
        response: '접근 권한은 업무상 필요한 최소한의 권한만 부여됩니다. 정기적으로 접근권한을 검토하며, 퇴사 시 즉시 모든 권한이 회수됩니다.',
        confidence: 0.88,
        sources: [mockDocuments[1]]
      }
    ]
  },
  {
    keywords: ['프로젝트', '프로세스', '업무', '진행', '관리'],
    responses: [
      {
        condition: (query: string) => query.includes('프로젝트') || query.includes('프로세스'),
        response: '프로젝트는 기획, 설계, 개발, 테스트, 배포 단계로 진행됩니다. 각 단계별로 품질 검토를 실시하며, 코드 리뷰와 테스트 커버리지 80% 이상을 필수로 합니다.',
        confidence: 0.91,
        sources: [mockDocuments[2]]
      }
    ]
  },
  {
    keywords: ['회계', '경비', '처리', '결산', '세무'],
    responses: [
      {
        condition: (query: string) => query.includes('경비'),
        response: '경비 처리는 법인카드 사용을 원칙으로 하며, 접대비 한도를 준수해야 합니다. 모든 경비는 증빙서류를 첨부하셔야 합니다.',
        confidence: 0.89,
        sources: [mockDocuments[3]]
      },
      {
        condition: (query: string) => query.includes('마감') || query.includes('결산'),
        response: '월별 마감은 매월 15일까지 전월 마감을 완료해야 합니다. 시산표 작성 및 검토 후 관리 보고서를 작성합니다.',
        confidence: 0.87,
        sources: [mockDocuments[3]]
      }
    ]
  },
  {
    id: 'doc5',
    title: '직원 온보딩 가이드',
    content: `신입 직원 온보딩 프로그램

1. 첫 주 일정
- 1일차: 회사 소개 및 오리엔테이션
- 2-3일차: 팀 소개 및 업무 환경 설정
- 4-5일차: 업무 시스템 교육 및 실습

2. 필수 교육
- 정보보안 교육
- 개인정보보호 교육
- 성희롱 예방 교육
- 안전 교육

3. 멘토링 프로그램
- 선임 멘토 배정
- 주간 1:1 미팅
- 월간 피드백 세션`,
    type: 'pdf',
    uploadDate: new Date('2024-01-25'),
    fileSize: 185000,
    tags: ['tag1', 'tag4'],
    processed: true,
    folderId: 'folder3',
    category: mockDocumentCategories[0],
    metadata: {
      author: '인사팀',
      keywords: ['온보딩', '신입사원', '교육', '멘토링'],
      summary: '신입 직원의 빠른 적응을 위한 체계적인 온보딩 프로그램',
      language: 'ko',
      readingTime: 8,
      difficulty: 'beginner',
      lastAccessed: new Date('2024-03-20'),
      accessCount: 45
    },
    relationships: [
      {
        targetDocumentId: 'doc1',
        type: 'related',
        strength: 0.8,
        context: '인사 관련 문서'
      }
    ],
    version: 1,
    versions: [],
    chunks: []
  },
  {
    id: 'doc6',
    title: '개발 환경 설정 가이드',
    content: `개발 환경 구축 가이드

1. 필수 도구 설치
- IDE: Visual Studio Code 또는 IntelliJ
- Git 및 Git 클라이언트
- Node.js LTS 버전
- Docker Desktop

2. 개발 환경 설정
- 코드 스타일 설정
- ESLint 설정
- Prettier 설정
- Git hooks 설정

3. 프로젝트 설정
- Repository 클론
- 의존성 설치
- 환경 변수 설정
- 로컬 DB 설정`,
    type: 'md',
    uploadDate: new Date('2024-02-08'),
    fileSize: 125000,
    tags: ['tag3', 'tag5'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: '개발팀',
      keywords: ['개발환경', 'IDE', 'Git', 'Docker'],
      summary: '신규 개발자를 위한 개발 환경 설정 가이드',
      language: 'ko',
      readingTime: 6,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-03-18'),
      accessCount: 67
    },
    relationships: [
      {
        targetDocumentId: 'doc3',
        type: 'related',
        strength: 0.9,
        context: '개발 프로세스 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  },
  {
    id: 'doc7',
    title: '재무 보고서 작성 요령',
    content: `재무 보고서 작성 가이드

1. 재무제표 구성
- 재무상태표
- 손익계산서
- 현금흐름표
- 자본변동표

2. 보고서 작성 기준
- K-IFRS 준수
- 분기별/연간 보고
- 감사 요구사항 충족

3. 주요 체크포인트
- 계정과목 정확성
- 금액 일치 여부
- 주석 사항 기재`,
    type: 'docx',
    uploadDate: new Date('2024-02-15'),
    fileSize: 215000,
    tags: ['tag4'],
    processed: true,
    folderId: 'folder4',
    category: mockDocumentCategories[2],
    metadata: {
      author: '재무팀',
      keywords: ['재무', '보고서', '재무제표', 'K-IFRS'],
      summary: '정확한 재무 보고서 작성을 위한 실무 가이드',
      language: 'ko',
      readingTime: 10,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-12'),
      accessCount: 23
    },
    relationships: [
      {
        targetDocumentId: 'doc4',
        type: 'related',
        strength: 0.95,
        context: '회계 관련 문서'
      }
    ],
    version: 1,
    versions: [],
    chunks: []
  },
  {
    id: 'doc8',
    title: '고객 서비스 매뉴얼',
    content: `고객 서비스 운영 매뉴얼

1. 고객 응대 원칙
- 친절하고 전문적인 응대
- 신속한 문제 해결
- 고객 니즈 파악

2. 채널별 응대 방법
- 전화: 3콜 이내 응답
- 이메일: 24시간 이내 회신
- 채팅: 실시간 응대

3. 에스컬레이션 절차
- 1차: 상담원 해결 시도
- 2차: 팀장 에스컬레이션
- 3차: 관련 부서 협업`,
    type: 'pdf',
    uploadDate: new Date('2024-02-20'),
    fileSize: 178000,
    tags: ['tag6'],
    processed: true,
    folderId: 'folder1',
    category: mockDocumentCategories[0],
    metadata: {
      author: '고객지원팀',
      keywords: ['고객서비스', 'CS', '응대', '에스컬레이션'],
      summary: '우수한 고객 서비스 제공을 위한 표준 운영 절차',
      language: 'ko',
      readingTime: 7,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-03-15'),
      accessCount: 89
    },
    relationships: [],
    version: 3,
    versions: [],
    chunks: []
  },
  {
    id: 'doc9',
    title: '데이터 보안 가이드라인',
    content: `데이터 보안 관리 가이드

1. 데이터 분류
- 공개: 외부 공개 가능
- 내부: 사내만 공유
- 기밀: 제한적 접근
- 극비: 최고 보안 등급

2. 보안 조치
- 암호화 필수 적용
- 접근 권한 관리
- 정기 보안 감사

3. 사고 대응
- 즉시 보고 체계
- 피해 최소화 조치
- 재발 방지 대책`,
    type: 'pdf',
    uploadDate: new Date('2024-02-25'),
    fileSize: 196000,
    tags: ['tag2', 'tag5'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: '정보보안팀',
      keywords: ['데이터보안', '암호화', '접근제어', '보안사고'],
      summary: '기업 데이터 보호를 위한 포괄적인 보안 가이드라인',
      language: 'ko',
      readingTime: 9,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-10'),
      accessCount: 76
    },
    relationships: [
      {
        targetDocumentId: 'doc2',
        type: 'related',
        strength: 0.85,
        context: '보안 정책 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  },
  {
    id: 'doc10',
    title: '원격 근무 정책',
    content: `원격 근무 운영 정책

1. 원격 근무 자격
- 수습 기간 완료
- 팀장 승인
- 업무 특성 적합

2. 근무 시간
- 코어 타임: 10:00-16:00
- 일일 8시간 근무
- 유연 근무 가능

3. 보안 준수사항
- VPN 필수 사용
- 화면 잠금 설정
- 공용 WiFi 사용 금지`,
    type: 'docx',
    uploadDate: new Date('2024-03-05'),
    fileSize: 156000,
    tags: ['tag1', 'tag7'],
    processed: true,
    folderId: 'folder3',
    category: mockDocumentCategories[0],
    metadata: {
      author: '인사팀',
      keywords: ['원격근무', '재택근무', '유연근무', 'VPN'],
      summary: '효율적인 원격 근무를 위한 정책 및 가이드라인',
      language: 'ko',
      readingTime: 5,
      difficulty: 'beginner',
      lastAccessed: new Date('2024-03-19'),
      accessCount: 134
    },
    relationships: [
      {
        targetDocumentId: 'doc1',
        type: 'related',
        strength: 0.7,
        context: '근무 정책 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  },
  {
    id: 'doc11',
    title: '마케팅 전략 2024',
    content: `2024년 마케팅 전략 계획

1. 시장 분석
- 타겟 고객층 분석
- 경쟁사 동향
- 시장 기회

2. 마케팅 목표
- 브랜드 인지도 30% 향상
- 신규 고객 50% 증가
- 고객 만족도 90% 달성

3. 실행 전략
- 디지털 마케팅 강화
- 콘텐츠 마케팅
- 파트너십 확대`,
    type: 'pptx',
    uploadDate: new Date('2024-03-08'),
    fileSize: 325000,
    tags: ['tag8'],
    processed: true,
    folderId: 'folder4',
    category: mockDocumentCategories[2],
    metadata: {
      author: '마케팅팀',
      keywords: ['마케팅', '전략', '브랜드', '디지털마케팅'],
      summary: '2024년 연간 마케팅 전략 및 실행 계획',
      language: 'ko',
      readingTime: 12,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-16'),
      accessCount: 56
    },
    relationships: [],
    version: 1,
    versions: [],
    chunks: []
  },
  {
    id: 'doc12',
    title: '성과 평가 시스템',
    content: `성과 평가 제도 안내

1. 평가 주기
- 분기별 체크인
- 반기 중간평가
- 연말 종합평가

2. 평가 기준
- 목표 달성도 (40%)
- 역량 평가 (30%)
- 협업 기여도 (20%)
- 자기 개발 (10%)

3. 평가 등급
- S: 탁월함
- A: 우수함
- B: 기대 충족
- C: 개선 필요`,
    type: 'pdf',
    uploadDate: new Date('2024-03-12'),
    fileSize: 198000,
    tags: ['tag1', 'tag4'],
    processed: true,
    folderId: 'folder3',
    category: mockDocumentCategories[0],
    metadata: {
      author: '인사팀',
      keywords: ['성과평가', 'KPI', '인사평가', '보상'],
      summary: '공정하고 투명한 성과 평가를 위한 시스템 안내',
      language: 'ko',
      readingTime: 8,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-03-17'),
      accessCount: 92
    },
    relationships: [
      {
        targetDocumentId: 'doc1',
        type: 'related',
        strength: 0.6,
        context: '인사 제도 관련'
      }
    ],
    version: 3,
    versions: [],
    chunks: []
  },
  {
    id: 'doc13',
    title: '제품 개발 로드맵',
    content: `제품 개발 로드맵 2024-2025

1. Q1 2024
- 기능 A 개발 완료
- 베타 테스트 진행
- 사용자 피드백 수집

2. Q2 2024
- 기능 B 개발 시작
- 성능 최적화
- UI/UX 개선

3. Q3 2024
- 신규 플랫폼 지원
- API 확장
- 보안 강화`,
    type: 'md',
    uploadDate: new Date('2024-03-15'),
    fileSize: 145000,
    tags: ['tag3', 'tag9'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: '제품개발팀',
      keywords: ['로드맵', '제품개발', '마일스톤', '릴리즈'],
      summary: '향후 2년간의 제품 개발 계획 및 주요 마일스톤',
      language: 'ko',
      readingTime: 6,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-03-18'),
      accessCount: 103
    },
    relationships: [
      {
        targetDocumentId: 'doc3',
        type: 'related',
        strength: 0.8,
        context: '개발 프로세스 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  },
  {
    id: 'doc14',
    title: '법무 컴플라이언스 가이드',
    content: `법적 규제 준수 가이드

1. 계약 관리
- 표준 계약서 사용
- 법무팀 검토 필수
- 전자 계약 시스템

2. 지적재산권
- 특허 출원 절차
- 저작권 보호
- 영업비밀 관리

3. 규제 대응
- 개인정보보호법
- 공정거래법
- 노동법`,
    type: 'docx',
    uploadDate: new Date('2024-03-18'),
    fileSize: 235000,
    tags: ['tag4', 'tag10'],
    processed: true,
    folderId: 'folder4',
    category: mockDocumentCategories[2],
    metadata: {
      author: '법무팀',
      keywords: ['컴플라이언스', '법규', '계약', '지적재산권'],
      summary: '기업 활동의 법적 리스크 관리를 위한 가이드',
      language: 'ko',
      readingTime: 11,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-19'),
      accessCount: 47
    },
    relationships: [],
    version: 1,
    versions: [],
    chunks: []
  },
  {
    id: 'doc15',
    title: '품질 관리 프로세스',
    content: `품질 관리 시스템 운영

1. 품질 기준
- ISO 9001 준수
- 내부 품질 기준
- 고객 요구사항

2. 품질 검사
- 입고 검사
- 공정 검사
- 출하 검사

3. 개선 활동
- 불량 원인 분석
- 개선 대책 수립
- 효과성 검증`,
    type: 'pdf',
    uploadDate: new Date('2024-03-20'),
    fileSize: 268000,
    tags: ['tag3', 'tag11'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: '품질관리팀',
      keywords: ['품질관리', 'ISO9001', '검사', '개선'],
      summary: '제품 및 서비스 품질 향상을 위한 체계적인 관리 프로세스',
      language: 'ko',
      readingTime: 9,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-03-21'),
      accessCount: 71
    },
    relationships: [
      {
        targetDocumentId: 'doc3',
        type: 'related',
        strength: 0.75,
        context: '프로세스 관리 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  },
  {
    id: 'doc16',
    title: '고객 데이터 분석 가이드',
    content: `고객 데이터 분석 방법론

1. 데이터 수집
- 구매 이력
- 웹사이트 행동
- 고객 피드백

2. 분석 기법
- RFM 분석
- 코호트 분석
- 고객 세분화

3. 인사이트 도출
- 구매 패턴 파악
- 이탈 예측
- 교차 판매 기회`,
    type: 'md',
    uploadDate: new Date('2024-03-22'),
    fileSize: 187000,
    tags: ['tag6', 'tag9'],
    processed: true,
    folderId: 'folder1',
    category: mockDocumentCategories[0],
    metadata: {
      author: '데이터분석팀',
      keywords: ['데이터분석', '고객분석', 'RFM', '세분화'],
      summary: '데이터 기반 고객 이해와 마케팅 전략 수립',
      language: 'ko',
      readingTime: 7,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-23'),
      accessCount: 118
    },
    relationships: [
      {
        targetDocumentId: 'doc8',
        type: 'related',
        strength: 0.8,
        context: '고객 관련 문서'
      }
    ],
    version: 1,
    versions: [],
    chunks: []
  },
  {
    id: 'doc17',
    title: '재해 복구 계획',
    content: `IT 재해 복구 계획 (DRP)

1. 위험 평가
- 자연 재해
- 시스템 장애
- 사이버 공격

2. 복구 전략
- RTO: 4시간
- RPO: 1시간
- 백업 주기: 일일

3. 복구 절차
- 비상 대응팀 소집
- 백업 시스템 활성화
- 서비스 복구 및 검증`,
    type: 'pdf',
    uploadDate: new Date('2024-03-25'),
    fileSize: 312000,
    tags: ['tag2', 'tag5', 'tag12'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: 'IT인프라팀',
      keywords: ['재해복구', 'DRP', 'BCP', '백업'],
      summary: 'IT 시스템 장애 시 신속한 복구를 위한 상세 계획',
      language: 'ko',
      readingTime: 13,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-26'),
      accessCount: 62
    },
    relationships: [
      {
        targetDocumentId: 'doc9',
        type: 'related',
        strength: 0.9,
        context: 'IT 보안 관련'
      }
    ],
    version: 3,
    versions: [],
    chunks: []
  },
  {
    id: 'doc18',
    title: '조직 문화 핸드북',
    content: `우리 회사의 문화와 가치

1. 핵심 가치
- 혁신: 끊임없는 도전
- 협업: 함께 성장하기
- 신뢰: 투명한 소통

2. 문화 활동
- 타운홀 미팅
- 팀 빌딩 프로그램
- 지식 공유 세션

3. 복지 제도
- 유연 근무제
- 자기계발 지원
- 건강 관리 프로그램`,
    type: 'pdf',
    uploadDate: new Date('2024-03-28'),
    fileSize: 225000,
    tags: ['tag1', 'tag7'],
    processed: true,
    folderId: 'folder3',
    category: mockDocumentCategories[0],
    metadata: {
      author: '경영지원팀',
      keywords: ['조직문화', '핵심가치', '복지', '타운홀'],
      summary: '건강한 조직 문화 구축을 위한 가이드북',
      language: 'ko',
      readingTime: 10,
      difficulty: 'beginner',
      lastAccessed: new Date('2024-03-29'),
      accessCount: 156
    },
    relationships: [
      {
        targetDocumentId: 'doc5',
        type: 'related',
        strength: 0.85,
        context: '조직 문화 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  },
  {
    id: 'doc19',
    title: '공급망 관리 매뉴얼',
    content: `공급망 관리 최적화

1. 공급업체 관리
- 평가 기준
- 정기 감사
- 파트너십 구축

2. 재고 관리
- JIT 시스템
- 안전 재고 수준
- ABC 분석

3. 물류 최적화
- 배송 경로 최적화
- 창고 관리
- 비용 절감 방안`,
    type: 'docx',
    uploadDate: new Date('2024-03-30'),
    fileSize: 298000,
    tags: ['tag13'],
    processed: true,
    folderId: 'folder4',
    category: mockDocumentCategories[2],
    metadata: {
      author: '구매물류팀',
      keywords: ['공급망', 'SCM', '재고관리', '물류'],
      summary: '효율적인 공급망 관리를 위한 종합 매뉴얼',
      language: 'ko',
      readingTime: 14,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-03-31'),
      accessCount: 38
    },
    relationships: [],
    version: 1,
    versions: [],
    chunks: []
  },
  {
    id: 'doc20',
    title: '환경 지속가능성 정책',
    content: `ESG 경영 - 환경 정책

1. 탄소 중립
- 2030년 탄소 중립 달성
- 재생 에너지 전환
- 탄소 배출 모니터링

2. 자원 순환
- 폐기물 감축
- 재활용률 향상
- 친환경 포장재 사용

3. 환경 보호
- 생물다양성 보전
- 수자원 관리
- 대기질 개선`,
    type: 'pdf',
    uploadDate: new Date('2024-04-01'),
    fileSize: 276000,
    tags: ['tag14'],
    processed: true,
    folderId: 'folder4',
    category: mockDocumentCategories[2],
    metadata: {
      author: 'ESG경영팀',
      keywords: ['ESG', '탄소중립', '지속가능성', '환경'],
      summary: '지속가능한 미래를 위한 환경 경영 정책',
      language: 'ko',
      readingTime: 11,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-04-02'),
      accessCount: 82
    },
    relationships: [],
    version: 1,
    versions: [],
    chunks: []
  },
  {
    id: 'doc21',
    title: 'API 개발 가이드라인',
    content: `RESTful API 개발 표준

1. API 설계 원칙
- RESTful 아키텍처
- 버전 관리
- 명명 규칙

2. 인증 및 보안
- OAuth 2.0
- API Key 관리
- Rate Limiting

3. 문서화
- OpenAPI 3.0
- 예제 코드
- 에러 코드 정의`,
    type: 'md',
    uploadDate: new Date('2024-04-03'),
    fileSize: 167000,
    tags: ['tag3', 'tag5', 'tag15'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: '플랫폼개발팀',
      keywords: ['API', 'REST', 'OAuth', 'OpenAPI'],
      summary: '일관성 있는 API 개발을 위한 표준 가이드',
      language: 'ko',
      readingTime: 8,
      difficulty: 'advanced',
      lastAccessed: new Date('2024-04-04'),
      accessCount: 124
    },
    relationships: [
      {
        targetDocumentId: 'doc6',
        type: 'related',
        strength: 0.95,
        context: '개발 가이드 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  },
  {
    id: 'doc22',
    title: '사내 교육 프로그램',
    content: `직원 역량 개발 프로그램

1. 리더십 교육
- 신임 팀장 과정
- 중간관리자 과정
- 임원 리더십 과정

2. 직무 교육
- 직무별 전문 교육
- 자격증 취득 지원
- 외부 교육 지원

3. 공통 교육
- 비즈니스 영어
- 디지털 리터러시
- 커뮤니케이션 스킬`,
    type: 'pdf',
    uploadDate: new Date('2024-04-05'),
    fileSize: 345000,
    tags: ['tag1', 'tag4', 'tag16'],
    processed: true,
    folderId: 'folder3',
    category: mockDocumentCategories[0],
    metadata: {
      author: '인재개발팀',
      keywords: ['교육', '리더십', '역량개발', '직무교육'],
      summary: '체계적인 직원 교육을 통한 조직 역량 강화',
      language: 'ko',
      readingTime: 15,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-04-06'),
      accessCount: 97
    },
    relationships: [
      {
        targetDocumentId: 'doc12',
        type: 'related',
        strength: 0.7,
        context: '인재 개발 관련'
      }
    ],
    version: 3,
    versions: [],
    chunks: []
  },
  {
    id: 'doc23',
    title: '모바일 앱 디자인 가이드',
    content: `모바일 UI/UX 디자인 시스템

1. 디자인 원칙
- 일관성
- 접근성
- 사용성

2. 컴포넌트
- 버튼 스타일
- 입력 필드
- 네비게이션

3. 디자인 토큰
- 색상 팔레트
- 타이포그래피
- 간격 시스템`,
    type: 'pdf',
    uploadDate: new Date('2024-04-07'),
    fileSize: 412000,
    tags: ['tag17'],
    processed: true,
    folderId: 'folder2',
    category: mockDocumentCategories[1],
    metadata: {
      author: 'UX디자인팀',
      keywords: ['UI', 'UX', '모바일', '디자인시스템'],
      summary: '일관된 모바일 경험을 위한 디자인 가이드라인',
      language: 'ko',
      readingTime: 12,
      difficulty: 'intermediate',
      lastAccessed: new Date('2024-04-08'),
      accessCount: 88
    },
    relationships: [
      {
        targetDocumentId: 'doc13',
        type: 'related',
        strength: 0.6,
        context: '제품 개발 관련'
      }
    ],
    version: 2,
    versions: [],
    chunks: []
  }
]