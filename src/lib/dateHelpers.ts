// Date 직렬화/역직렬화 헬퍼
export function serializeDate(date: Date | undefined | null): string | null {
  if (!date) return null
  return date instanceof Date ? date.toISOString() : date
}

export function deserializeDate(dateString: string | undefined | null): Date | null {
  if (!dateString) return null
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}

// 객체의 모든 날짜 필드를 변환
export function deserializeDates<T extends Record<string, any>>(obj: T): T {
  const dateFields = ['createdAt', 'updatedAt', 'uploadDate', 'lastAccessed', 'lastMessageAt']
  
  const result = { ...obj }
  
  // 최상위 날짜 필드 변환
  dateFields.forEach(field => {
    if (result[field]) {
      const date = deserializeDate(result[field])
      if (date) (result as any)[field] = date
    }
  })
  
  // metadata 내부 날짜 필드 변환
  if ((result as any).metadata && (result as any).metadata.lastAccessed) {
    const date = deserializeDate((result as any).metadata.lastAccessed)
    if (date) {
      (result as any).metadata = {
        ...(result as any).metadata,
        lastAccessed: date
      }
    }
  }
  
  // messages 배열의 날짜 필드 변환
  if (Array.isArray((result as any).messages)) {
    (result as any).messages = (result as any).messages.map((msg: any) => ({
      ...msg,
      createdAt: deserializeDate(msg.createdAt) || new Date()
    }))
  }
  
  return result
}