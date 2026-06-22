import { describe, it, vi, beforeAll } from 'vitest'
import { verifyToken } from '../lib/auth'

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-for-testing-only-32bytes!'
})

describe('auth - JWT verification', () => {
  it('should return null for invalid token', async () => {
    const payload = await verifyToken('invalid.token.here')
    expect(payload).toBeNull()
  })

  it('should return null for malformed token', async () => {
    const payload = await verifyToken('not-a-valid-jwt')
    expect(payload).toBeNull()
  })

  it('should return null for empty token', async () => {
    const payload = await verifyToken('')
    expect(payload).toBeNull()
  })
})