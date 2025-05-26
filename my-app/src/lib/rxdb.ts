'use client'

import {
  createRxDatabase,
  addRxPlugin,
  RxDatabase,
  RxCollection
} from 'rxdb'

import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { RxDBUpdatePlugin } from 'rxdb/plugins/update'
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv'
import { commentSchema, CommentDocType } from './schema'

// Collection and database types
export type CommentCollection = RxCollection<CommentDocType>
export type CommentDatabase = RxDatabase<{
  comments: CommentCollection
}>

// Enable dev mode plugin (dev only)
if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

addRxPlugin(RxDBUpdatePlugin);

let dbPromise: Promise<CommentDatabase> | null = null

export const getDB = async (): Promise<CommentDatabase> => {
  if (!dbPromise) {
    try {
      const storage =
        process.env.NODE_ENV === 'development'
          ? wrappedValidateAjvStorage({ storage: getRxStorageLocalstorage() })
          : getRxStorageLocalstorage()

      const db = await createRxDatabase<CommentDatabase>({
        name: 'commentsdb',
        storage,
        multiInstance: true
      })

      await db.addCollections({
        comments: {
          schema: commentSchema
        }
      })

      dbPromise = Promise.resolve(db)
    } catch (err) {
      console.error('❌ Failed to initialize RxDB:', err)
      throw err
    }
  }

  return dbPromise
}



