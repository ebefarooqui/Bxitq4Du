'use client'

import CommentList from '@/components/CommentList'

export default function Home() {
  return (
    
<section className="space-y-6">
  <div className="space-y-2">
    <h1 className="text-2xl font-semibold tracking-tight">
      Comment Thread
    </h1>
    <p className="text-sm text-muted-foreground">
      Post, reply, and interact with nested comments — stored locally and synced across tabs.
    </p>
  </div>

  <CommentList />
</section>

  )
}

