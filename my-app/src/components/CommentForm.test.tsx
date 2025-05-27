import { render, screen, fireEvent } from '@testing-library/react'
import CommentForm from './CommentForm'

describe('<CommentForm />', () => {
  it('renders the textarea and button', () => {
    render(<CommentForm onSubmit={jest.fn()} disabled={false} />)

    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument()
    expect(screen.getByText('Post Comment')).toBeInTheDocument()
  })

  it('calls onSubmit with the correct text', () => {
    const onSubmit = jest.fn()

    render(<CommentForm onSubmit={onSubmit} disabled={false} />)

    const textarea = screen.getByPlaceholderText('Write a comment...')
    const button = screen.getByText('Post Comment')

    fireEvent.change(textarea, { target: { value: 'Test comment' } })
    fireEvent.click(button)

    expect(onSubmit).toHaveBeenCalledWith('Test comment')
  })

  it('clears the textarea after submit', () => {
    const onSubmit = jest.fn()

    render(<CommentForm onSubmit={onSubmit} disabled={false} />)

    const textarea = screen.getByPlaceholderText('Write a comment...')
    const button = screen.getByText('Post Comment')

    fireEvent.change(textarea, { target: { value: 'Clear me' } })
    fireEvent.click(button)

    expect(textarea).toHaveValue('')
  })

  it('disables the button when disabled is true', () => {
    render(<CommentForm onSubmit={jest.fn()} disabled={true} />)

    expect(screen.getByText('Post Comment')).toBeDisabled()
  })

    it('does not call onSubmit if input is empty', () => {
    const onSubmit = jest.fn()

    render(<CommentForm onSubmit={onSubmit} disabled={false} />)

    const button = screen.getByText('Post Comment')
    fireEvent.click(button)

    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('does not call onSubmit if input is only whitespace', () => {
    const onSubmit = jest.fn()

    render(<CommentForm onSubmit={onSubmit} disabled={false} />)

    const textarea = screen.getByPlaceholderText('Write a comment...')
    const button = screen.getByText('Post Comment')

    fireEvent.change(textarea, { target: { value: '   \n\t  ' } })
    fireEvent.click(button)

    expect(onSubmit).not.toHaveBeenCalled()
  })

})
