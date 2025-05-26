import { render, screen, fireEvent } from '@testing-library/react'
import CommentNode from './CommentNode'
import { CommentTree } from '@/lib/useComments'

const baseComment: CommentTree = {
  id: '1',
  text: 'This is a root comment',
  createdAt: Date.now(),
  isVisible: true,
  children: [],
}

const nestedComment: CommentTree = {
  id: '2',
  text: 'Nested comment',
  createdAt: Date.now(),
  isVisible: true,
  parentId: '1',
  children: [],
}

describe('<CommentNode />', () => {
  it('renders the comment text', () => {
    render(
      <CommentNode
        comment={baseComment}
        onReply={jest.fn()}
        onDelete={jest.fn()}
        onToggle={jest.fn()}
      />
    )

    expect(screen.getByText('This is a root comment')).toBeInTheDocument()
  })

  it('shows the reply form when "Reply" is clicked', () => {
    render(
      <CommentNode
        comment={baseComment}
        onReply={jest.fn()}
        onDelete={jest.fn()}
        onToggle={jest.fn()}
      />
    )

    fireEvent.click(screen.getByText('Reply'))
    expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument()
  })

  it('calls onReply when "Post Reply" is clicked', () => {
    const onReply = jest.fn()

    render(
      <CommentNode
        comment={baseComment}
        onReply={onReply}
        onDelete={jest.fn()}
        onToggle={jest.fn()}
      />
    )

    fireEvent.click(screen.getByText('Reply'))
    fireEvent.change(screen.getByPlaceholderText('Write a reply...'), {
      target: { value: 'Nested comment' },
    })
    fireEvent.click(screen.getByText('Post Reply'))

    expect(onReply).toHaveBeenCalledWith('Nested comment', '1')
  })

  it('calls onToggle when "Hide" or "Show" is clicked', () => {
    const onToggle = jest.fn()

    const commentWithChildren: CommentTree = {
      ...baseComment,
      children: [nestedComment],
    }

    render(
      <CommentNode
        comment={commentWithChildren}
        onReply={jest.fn()}
        onDelete={jest.fn()}
        onToggle={onToggle}
      />
    )

    fireEvent.click(screen.getByText('Hide'))
    expect(onToggle).toHaveBeenCalledWith('1')
  })

  it('calls onDelete when delete is confirmed', () => {
    const onDelete = jest.fn()

    render(
      <CommentNode
        comment={baseComment}
        onReply={jest.fn()}
        onDelete={onDelete}
        onToggle={jest.fn()}
      />
    )

    fireEvent.click(screen.getByText('Delete'))

    // Assuming the dialog opens and contains a "Confirm" button
    fireEvent.click(screen.getByText('Confirm'))

    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('renders nested comments recursively', () => {
    const commentWithChild: CommentTree = {
      ...baseComment,
      children: [nestedComment],
    }

    render(
      <CommentNode
        comment={commentWithChild}
        onReply={jest.fn()}
        onDelete={jest.fn()}
        onToggle={jest.fn()}
      />
    )

    expect(screen.getByText('Nested comment')).toBeInTheDocument()
  })
})
