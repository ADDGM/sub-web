import { describe, expect, it } from 'vitest'
import { backendSearch, createFilter } from '@/utils/search'

const backends = [{ value: 'Alpha' }, { value: 'alpine' }, { value: 'Beta' }]

describe('backend search', () => {
  it('matches prefixes case-insensitively', () => {
    expect(backends.filter(createFilter('AL'))).toEqual([backends[0], backends[1]])
  })

  it('returns all backends for an empty query', () => {
    expect(backendSearch('', backends)).toBe(backends)
  })

  it('filters backends for a query', () => {
    expect(backendSearch('be', backends)).toEqual([backends[2]])
  })
})
