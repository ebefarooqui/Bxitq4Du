import { RxJsonSchema } from 'rxdb'

export type CommentDocType = {
  id: string
  text: string
  createdAt: number
  parentId?: string
  isVisible: boolean
}

export const commentSchema: RxJsonSchema<CommentDocType> = {
  title: 'comment schema',
  version: 0,
  description: 'Reddit-style comment with nesting',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', maxLength: 64 },
    text: { type: 'string', minLength: 1, maxLength: 1000 },
    createdAt: { type: 'number' },
    parentId: { type: 'string', maxLength: 64 },
    isVisible: { type: 'boolean' }
  },
  required: ['id', 'text', 'createdAt', 'isVisible'],
  indexes: ['parentId']
}

