'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type CommentFormProps = {
  onSubmit: (text: string) => void
  disabled?: boolean
}


export function CommentForm({ onSubmit, disabled }: CommentFormProps) {
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text)
      setText('')
    }
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} size="sm" disabled={disabled}>
          Post Comment
        </Button>
      </div>
    </div>
  )
}

export default CommentForm

