'use client'

import { cn } from '@/lib/utils'
import { useState, useEffect, useRef } from 'react'

type CollapsibleProps = {
  isOpen: boolean
  children: React.ReactNode
  className?: string
  duration?: number
}

export function Collapsible({
  isOpen,
  children,
  className,
  duration = 300
}: CollapsibleProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight)
    }
  }, [children])

  return (
    <div
      className={cn(
        'transition-all overflow-hidden ease-in-out',
        className
      )}
      style={{
        maxHeight: isOpen ? height : 0,
        opacity: isOpen ? 1 : 0,
        transitionDuration: `${duration}ms`
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  )
}

