import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navbar from './Navbar'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

global.fetch = vi.fn()

describe('Navbar', () => {
  it('renders logo and brand name', () => {
    render(<Navbar />)
    
    expect(screen.getByText('Têtes Brûlées')).toBeDefined()
    // Desktop nav has multiple links - check at least one exists
    expect(screen.getAllByRole('link', { name: /accueil/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: /sorties club/i }).length).toBeGreaterThan(0)
  })

  it('shows login button when not authenticated', async () => {
    ;(fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null }),
    })
    
    render(<Navbar />)
    
    // Should have at least one "Se connecter" link (desktop or mobile)
    expect(screen.getAllByRole('link', { name: /se connecter/i }).length).toBeGreaterThan(0)
  })
})