'use client'

import { useComments } from '@/lib/useComments'
import CommentNode from './CommentNode'
import CommentForm from './CommentForm'

export default function CommentList() {
  const { comments, addComment, deleteComment, toggleVisibility, dbReady } = useComments()

  return (
    <div className="flex flex-col h-full pb-12">
      {/* Fixed form at top */}
      <div className="shrink-0 pb-4 ">
        <CommentForm onSubmit={(text) => addComment(text)} disabled={!dbReady} />
      </div>

      {/* Scrollable comment thread */}
      <div className="flex-1 overflow-y-auto pt-4 space-y-4 pb-32 pr-2">
        {comments.map((comment) => (
          <CommentNode
            key={comment.id}
            comment={comment}
            onReply={addComment}
            onDelete={deleteComment}
            onToggle={toggleVisibility}
          />
        ))}
      </div>
    </div>
  )
}

