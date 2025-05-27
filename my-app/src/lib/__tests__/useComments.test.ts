import { renderHook, act, waitFor } from '@testing-library/react'
import { useComments } from '../useComments'
import { getDB } from '../rxdb'

if (!globalThis.crypto) globalThis.crypto = {} as any

(globalThis.crypto.randomUUID as any) = () => 'mocked-uuid'

jest.mock('../rxdb')

type MockDoc = { toJSON: () => any }

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

describe('useComments', () => {
  const mockInsert = jest.fn()
  const mockFind = jest.fn()
  const mockFindOne = jest.fn()
  const mockRemove = jest.fn()
  const mockUpdate = jest.fn()
  let subscriber: (docs: any[]) => void = () => {}

  beforeEach(() => {
  jest.resetAllMocks()

  mockInsert.mockReset()
  mockFind.mockReset()
  mockFindOne.mockReset()
  mockRemove.mockReset()

  const dbMock = {
    comments: {
      insert: mockInsert,
      find: () => ({
        exec: mockFind,
        $: {
          subscribe: (cb: any) => {
            subscriber = cb
            return { unsubscribe: jest.fn() }
          },
        },
      }),
      findOne: mockFindOne,
    },
  }

  ;(getDB as jest.Mock).mockResolvedValue(dbMock)
})

  it('adds a comment', async () => {
  // Arrange: render the hook
  const { result } = renderHook(() => useComments())

  // Act: add a comment
  await act(async () => {
    await result.current.addComment('Test comment')
  })

  // Assert: insert was called with correct shape
  expect(mockInsert).toHaveBeenCalledTimes(1)

  const inserted = mockInsert.mock.calls[0][0]
  expect(inserted.text).toBe('Test comment')
  expect(typeof inserted.id).toBe('string')
  expect(inserted.isVisible).toBe(true)
  expect(typeof inserted.createdAt).toBe('number')
})

  it('toggles visibility of a comment', async () => {
    const doc = {
      get: () => true,
      update: mockUpdate,
    }

    mockFindOne.mockReturnValue({ exec: () => Promise.resolve(doc) })

    const { result } = renderHook(() => useComments())

    await act(async () => {
      await result.current.toggleVisibility('123')
    })

    expect(mockUpdate).toHaveBeenCalledWith({
      $set: { isVisible: false },
    })
  })

 it('deletes a comment and descendants', async () => {
  const mockDocs = [
    {
      toJSON: () => ({
        id: '1',
        parentId: undefined,
        text: 'Parent',
        createdAt: Date.now(),
        isVisible: true,
      }),
      remove: mockRemove,
    },
    {
      toJSON: () => ({
        id: '2',
        parentId: '1',
        text: 'Child',
        createdAt: Date.now(),
        isVisible: true,
      }),
      remove: mockRemove,
    },
  ]

  // Ensure .find().exec() returns full RxDB-like documents
  mockFind.mockResolvedValue(mockDocs)

  // Ensure .findOne({ selector: { id } }).exec() returns matching doc
  mockFindOne.mockImplementation(({ selector }) => {
    const found = mockDocs.find((doc) => doc.toJSON().id === selector.id)
    return {
      exec: () => Promise.resolve(found || null),
    }
  })

  const { result } = renderHook(() => useComments())

  const spy = jest.spyOn(result.current, 'deleteComment')

  await act(async () => {
    await result.current.deleteComment('1')
  })

  expect(spy).toHaveBeenCalled();

  // Assert: both the parent and child were deleted
  expect(mockRemove).toHaveBeenCalledTimes(2)

  // Optionally, assert which IDs were removed
  const removedIds = mockRemove.mock.calls.map((_, i) => mockDocs[i].toJSON().id)
  expect(removedIds).toContain('1')
  expect(removedIds).toContain('2')
})
it('responds to subscription updates', async () => {
    const now = Date.now()

    const sampleDocs: MockDoc[] = [
      {
        toJSON: () => ({
          id: '1',
          text: 'Parent',
          createdAt: now,
          isVisible: true,
        }),
      },
      {
        toJSON: () => ({
          id: '2',
          text: 'Child',
          createdAt: now,
          isVisible: true,
          parentId: '1',
        }),
      },
    ]

    const { result } = renderHook(() => useComments())

    await waitFor(() => result.current.dbReady === true)

    await act(async () => {
      subscriber(sampleDocs)
    })

    expect(result.current.comments.length).toBe(1)
    expect(result.current.comments[0].children.length).toBe(1)
  })
})
