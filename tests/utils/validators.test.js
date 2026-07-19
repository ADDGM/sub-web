import { describe, expect, it } from 'vitest'
import { validateForm, validateSubUrl } from '@/utils/validators'

describe('validateSubUrl', () => {
  it.each([undefined, '', '   '])('rejects an empty value: %s', (value) => {
    expect(validateSubUrl(value)).toEqual({
      valid: false,
      message: '订阅链接不能为空'
    })
  })

  it.each([
    'https://example.com/sub',
    'http://example.com/sub',
    'ss://node',
    'vmess://node',
    'abc123'
  ])('accepts a supported subscription value: %s', (value) => {
    expect(validateSubUrl(value)).toEqual({ valid: true })
  })

  it('rejects an unsupported value', () => {
    expect(validateSubUrl('not-a-subscription')).toEqual({
      valid: false,
      message: '订阅链接格式可能不正确'
    })
  })
})

describe('validateForm', () => {
  it.each([
    undefined,
    { sourceSubUrl: '', clientType: 'clash' },
    { sourceSubUrl: '   ', clientType: 'clash' },
    { sourceSubUrl: 'https://example.com/sub', clientType: '   ' }
  ])('rejects an incomplete form', (form) => {
    expect(validateForm(form)).toBe(false)
  })

  it('accepts a complete form', () => {
    expect(
      validateForm({
        sourceSubUrl: 'https://example.com/sub',
        clientType: 'clash'
      })
    ).toBe(true)
  })
})
