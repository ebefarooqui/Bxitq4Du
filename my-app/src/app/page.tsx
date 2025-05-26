
'use client'

import CommentList from '@/components/CommentList'

export default function Home() {
  return (
    <div className="flex flex-col h-full">
      {/* Static header */}
      <div className="shrink-0 py-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Comment Thread
        </h1>
        <p className="text-sm text-muted-foreground">
          Post, reply, and interact with nested comments — stored locally and synced across tabs.
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <CommentList />
      </div>
    </div>
  )
}

