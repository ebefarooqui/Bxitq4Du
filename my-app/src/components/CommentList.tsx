'use client'

import { useComments } from '@/lib/useComments'
import CommentNode from './CommentNode'
import CommentForm from './CommentForm'

export default function CommentList() {
  const { comments, addComment, deleteComment, toggleVisibility, dbReady } = useComments()


  return (
    <div className="space-y-6">
      
      <CommentForm onSubmit={(text) => addComment(text)} disabled={!dbReady} />

      <div className="mt-4 space-y-4">
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

