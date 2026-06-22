import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BackButton from './BackButton'

// Mock Next.js router
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('BackButton', () => {
  it('renders back button with correct text', () => {
    render(<BackButton />)
    
    expect(screen.getByText('Retour à l\'accueil')).toBeDefined()
  })

  it('renders as a link to homepage', () => {
    render(<BackButton />)
    
    const link = screen.getByRole('link', { name: /retour à l'accueil/i })
    expect(link).toHaveAttribute('href', '/')
  })

  it('has correct styling classes', () => {
    render(<BackButton />)
    
    const link = screen.getByRole('link', { name: /retour à l'accueil/i })
    expect(link).toHaveClass('inline-flex', 'items-center', 'gap-2')
  })
})