import { buildCommentTree } from '../useComments'

describe('buildCommentTree', () => {
  it('creates a tree from flat list', () => {
    const flat = [
      { id: '1', text: 'Parent', createdAt: 1, isVisible: true },
      { id: '2', text: 'Child', createdAt: 2, isVisible: true, parentId: '1' },
      { id: '3', text: 'Unrelated', createdAt: 3, isVisible: true },
    ]

    const tree = buildCommentTree(flat)

    expect(tree.length).toBe(2)
    expect(tree[0].id).toBe('1')
    expect(tree[0].children[0].id).toBe('2')
    expect(tree[1].id).toBe('3')
  })
})
