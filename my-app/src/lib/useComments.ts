'use client'

import { useEffect, useState } from 'react'
import { getDB } from './rxdb'
import { CommentDocType } from './schema'

export type CommentTree = CommentDocType & {
  children: CommentTree[]
}

// Helper: builds a nested comment tree from flat list
export function buildCommentTree(flat: CommentDocType[]): CommentTree[] {
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
  
  roots.sort((a, b) => b.createdAt - a.createdAt)

  return roots
}

export function useComments() {
  const [comments, setComments] = useState<CommentTree[]>([])
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    let sub: any
    let mounted = true

    getDB()
      .then((db) => {
        setDbReady(true)

        const observable = db.comments.find().$.subscribe((docs) => {
          if (!mounted) return
          try {
            const json = docs.map((d) => d.toJSON())
            const tree = buildCommentTree(json)
            setComments(tree)
          } catch (err) {
            console.error('Failed to process subscription docs', err)
          }
        })

        sub = observable
      })
      .catch((err) => {
        console.error('Failed to initialize DB in useEffect', err)
      })

    return () => {
      mounted = false
      sub?.unsubscribe()
    }
  }, [])

  const refreshComments = async () => {
    try {
      const db = await getDB()
      const docs = await db.comments.find().exec()
      const json = docs.map((d) => d.toJSON())
      setComments(buildCommentTree(json))
    } catch (err) {
      console.error('Failed to refresh comments', err)
    }
  }

  const addComment = async (text: string, parentId?: string) => {
    try {
      const db = await getDB()
      await db.comments.insert({
        id: crypto.randomUUID(),
        text,
        createdAt: Date.now(),
        parentId,
        isVisible: true
      })
      await refreshComments()
    } catch (err) {
      console.error('Failed to add comment', err)
    }
  }

  const deleteComment = async (id: string) => {
    try {
      const db = await getDB()
      const allDocs = await db.comments.find().exec()
      const all = allDocs.map(doc => doc.toJSON())

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

      await Promise.all(
        Array.from(toDelete).map(async (deleteId) => {
          try {
            const doc = await db.comments.findOne({ selector: { id: deleteId } }).exec()
            if (doc) await doc.remove()
          } catch (err) {
            console.error(`Failed to remove comment with id ${deleteId}`, err)
          }
        })
      )

      await refreshComments()
    } catch (err) {
      console.error('Failed to delete comment tree', err)
    }
  }

  const toggleVisibility = async (id: string) => {
    try {
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
    } catch (err) {
      console.error(`Failed to toggle visibility for comment ${id}`, err)
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

