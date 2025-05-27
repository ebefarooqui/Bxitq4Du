'use client'

import { useState } from 'react'
import { CommentTree } from '@/lib/useComments'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { AnimatePresence, motion } from 'framer-motion'

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
    <div className="ml-4 mt-4 space-y-4">
      <Card className="w-full">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm text-foreground">{comment.text}</p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{new Date(comment.createdAt).toLocaleString()}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => setShowReply(!showReply)}
              >
                {showReply ? 'Cancel' : 'Reply'}
              </Button>

              {comment.children.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => onToggle(comment.id)}
                >
                  {comment.isVisible ? 'Hide' : 'Show'}
                </Button>
              )}

              <ConfirmDeleteDialog onConfirm={() => onDelete(comment.id)} />
            </div>
          </div>
          {/* Using Framer Motion for animations */}
          <AnimatePresence initial={false}>
            {showReply && (
              <motion.div
                key="reply"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <div className="space-y-3 pt-3">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" variant="secondary" onClick={handleReply}>
                      Post Reply
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Recursive children */}
      <AnimatePresence initial={false}>
        {comment.isVisible && (
          <motion.div
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden ml-4 border-l pl-4 border-muted"
          >
            <div className="space-y-4">
              {comment.children.map((child) => (
                <CommentNode
                  key={child.id}
                  comment={child}
                  onReply={onReply}
                  onDelete={onDelete}
                  onToggle={onToggle}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CommentNode

