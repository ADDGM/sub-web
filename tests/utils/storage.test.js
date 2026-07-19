import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getLocalStorageItem, setLocalStorageItem } from '@/utils/storage'

const createStorage = () => {
  const values = new Map()
  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, value)),
    removeItem: vi.fn((key) => values.delete(key))
  }
}

describe('local storage helpers', () => {
  let storage

  beforeEach(() => {
    storage = createStorage()
    vi.stubGlobal('localStorage', storage)
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-16T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('stores the value with TTL metadata', () => {
    setLocalStorageItem('sourceSubUrl', 'https://example.com/sub', 60)

    const data = JSON.parse(storage.setItem.mock.calls[0][1])
    expect(data).toEqual({
      setTime: Date.now(),
      ttl: 60,
      expire: Date.now() + 60000,
      value: 'https://example.com/sub'
    })
  })

  it('returns a value before it expires', () => {
    setLocalStorageItem('sourceSubUrl', 'cached', 60)
    vi.advanceTimersByTime(59999)

    expect(getLocalStorageItem('sourceSubUrl')).toBe('cached')
  })

  it('removes a value at its expiry boundary', () => {
    setLocalStorageItem('sourceSubUrl', 'cached', 60)
    vi.advanceTimersByTime(60000)

    expect(getLocalStorageItem('sourceSubUrl')).toBe('')
    expect(storage.removeItem).toHaveBeenCalledWith('sourceSubUrl')
  })

  it('removes malformed cached JSON instead of throwing', () => {
    storage.getItem.mockReturnValue('{broken')

    expect(getLocalStorageItem('sourceSubUrl')).toBe('')
    expect(storage.removeItem).toHaveBeenCalledWith('sourceSubUrl')
  })

  it('returns an empty string for a missing value', () => {
    expect(getLocalStorageItem('missing')).toBe('')
  })
})
