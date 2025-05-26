'use client'

import { useState } from 'react'
import { CommentTree } from '@/lib/useComments'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'

type CommentNodeProps = {
  comment: CommentTree
  onReply: (text: string, parentId?: string) => void
  onDelete: (id: string) => void
  onToggle: (id: string) => void
}

export function CommentNode({
  comment,
  onReply,
  onDelete,
  onToggle
}: CommentNodeProps) {
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText, comment.id)
      setReplyText('')
      setShowReply(false)
    }
  }

  return (
    <div className="ml-4 mt-4">
      <Card className="w-full">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm">{comment.text}</p>
          <p className="text-xs text-muted-foreground">
           {new Date(comment.createdAt).toLocaleString()}
          </p>

          <div className="flex gap-2 text-xs">
            <Button variant="ghost" size="sm" onClick={() => setShowReply(!showReply)}>
              {showReply ? 'Cancel' : 'Reply'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onToggle(comment.id)}>
              {comment.isVisible ? 'Hide' : 'Show'}
            </Button>
            <ConfirmDeleteDialog onConfirm={() => onDelete(comment.id)} />
          </div>

          {showReply && (
            <div className="space-y-2 pt-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button size="sm" onClick={handleReply}>
                Post Reply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recursive children rendering */}
      {comment.isVisible &&
        comment.children.map((child) => (
          <CommentNode
            key={child.id}
            comment={child}
            onReply={onReply}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
    </div>
  )
}

export default CommentNode

