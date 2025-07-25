'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2, Filter } from "lucide-react"
import KnowledgeGraph from "@/components/knowledge/KnowledgeGraph"
import Link from "next/link"

export default function KnowledgeGraphPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/knowledge">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">지식 그래프</h1>
                <p className="text-muted-foreground">문서 간의 연관관계를 시각화합니다</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                내보내기
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-card rounded-lg border p-6">
          <KnowledgeGraph />
        </div>

        {/* Instructions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="font-semibold mb-2">🖱️ 마우스 조작</div>
            <p className="text-muted-foreground">
              드래그하여 이동, 휠로 확대/축소
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="font-semibold mb-2">🎯 노드 상호작용</div>
            <p className="text-muted-foreground">
              노드를 드래그하여 위치 조정
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="font-semibold mb-2">🏷️ 연결선 의미</div>
            <p className="text-muted-foreground">
              선의 굵기는 연관도를 나타냄
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="font-semibold mb-2">ℹ️ 정보 보기</div>
            <p className="text-muted-foreground">
              노드에 마우스를 올려 상세 정보 확인
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}