'use client'

import { useEffect, useState } from 'react'
import { getDB } from './rxdb'
import { CommentDocType } from './schema'
import { toast } from '@/hooks/use-toast'

export type CommentTree = CommentDocType & {
  children: CommentTree[]
}

// Helper: builds a nested comment tree from flat list
function buildCommentTree(flat: CommentDocType[]): CommentTree[] {
  const lookup: Record<string, CommentTree> = {}
  const roots: CommentTree[] = []

  for (const c of flat) {
    lookup[c.id] = { ...c, children: [] }
  }

  for (const c of flat) {
    if (c.parentId && lookup[c.parentId]) {
      lookup[c.parentId].children.push(lookup[c.id])
    } else {
      roots.push(lookup[c.id])
    }
  }

  return roots
}

export function useComments() {
  const [comments, setComments] = useState<CommentTree[]>([])

  
  const [dbReady, setDbReady] = useState(false)

  
  useEffect(() => {
    let sub: any
    let mounted = true

    getDB().then((db) => {
      setDbReady(true)

      const observable = db.comments.find().$.subscribe((docs) => {
        if (!mounted) return
        const json = docs.map((d) => d.toJSON())
        const tree = buildCommentTree(json)
        setComments(tree)
      })

      sub = observable
    })

    return () => {
      mounted = false
      sub?.unsubscribe()
    }
  }, [])



  const refreshComments = async () => {
    const db = await getDB()
    const docs = await db.comments.find().exec()
    const json = docs.map((d) => d.toJSON())
    setComments(buildCommentTree(json))
  }

  const addComment = async (text: string, parentId?: string) => {
    const db = await getDB()
    await db.comments.insert({
      id: crypto.randomUUID(),
      text,
      createdAt: Date.now(),
      parentId,
      isVisible: true
    })
    await refreshComments() // ⬅️ Force UI update
  }

  const deleteComment = async (id: string) => {
    const db = await getDB()

    // Load all comments
    const allDocs = await db.comments.find().exec()
    const all = allDocs.map(doc => doc.toJSON())

    // Collect all child comment IDs recursively
    const toDelete = new Set<string>()

    const collectDescendants = (currentId: string) => {
      toDelete.add(currentId)
      for (const comment of all) {
        if (comment.parentId === currentId) {
          collectDescendants(comment.id)
        }
      }
    }

    collectDescendants(id)

    // Remove them all
    await Promise.all(
      [...toDelete].map(async (deleteId) => {
        const doc = await db.comments.findOne({ selector: { id: deleteId } }).exec()
        if (doc) await doc.remove()
      })
    )

    await refreshComments()
    toast({
      description: 'All nested replies were removed.'
    })
  }


  const toggleVisibility = async (id: string) => {
    const db = await getDB()
    const doc = await db.comments.findOne({ selector: { id } }).exec()
    if (doc) {
      await doc.update({
        $set: {
          isVisible: !doc.get('isVisible')
        }
      })
      await refreshComments()
    }
  }

  return {
    comments,
    addComment,
    deleteComment,
    toggleVisibility,
    dbReady
  }
}

