'use client'

import EnhancedDemoFlow from './demo/EnhancedDemoFlow'

interface DemoModalProps {
  open: boolean
  onClose: () => void
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  return <EnhancedDemoFlow open={open} onClose={onClose} />
}