import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import JsonLd from './JsonLd'

describe('JsonLd', () => {
  it('renders script tag with ld+json type', () => {
    const { container } = render(<JsonLd />)
    
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).not.toBeNull()
  })

  it('contains valid schema.org data', () => {
    const { container } = render(<JsonLd />)
    
    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || '{}')
    
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('SportsClub')
    expect(schema.name).toBe('Têtes Brûlées')
  })

  it('includes club details', () => {
    const { container } = render(<JsonLd />)
    
    const script = container.querySelector('script[type="application/ld+json"]')
    const schema = JSON.parse(script?.textContent || '{}')
    
    expect(schema.description).toContain('parapente')
    expect(schema.url).toBe('https://tetes-brulees.vercel.app')
    expect(schema.sport).toContain('Paragliding')
  })
})