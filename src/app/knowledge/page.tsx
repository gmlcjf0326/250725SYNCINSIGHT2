'use client'

import MainLayout from '@/components/layout/MainLayout'
import ClientOnly from '@/components/ClientOnly'
import KnowledgeClient from './KnowledgeClient'

export default function KnowledgePage() {
  return (
    <MainLayout title="지식베이스">
      <div className="bg-gray-50 min-h-full">
        <ClientOnly fallback={
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          <KnowledgeClient />
        </ClientOnly>
      </div>
    </MainLayout>
  )
}