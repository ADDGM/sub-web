import { describe, expect, it } from 'vitest'
import { formatErrorMessage, formatVersion, processSubUrl } from '@/utils/formatters'

describe('formatErrorMessage', () => {
  it('returns string errors unchanged', () => {
    expect(formatErrorMessage('请求失败')).toBe('请求失败')
  })

  it('prefers the response message over the error message', () => {
    expect(
      formatErrorMessage({
        response: { data: { message: '服务端错误' } },
        message: '网络错误'
      })
    ).toBe('服务端错误')
  })

  it('falls back through the error message to the default', () => {
    expect(formatErrorMessage(new Error('网络错误'))).toBe('网络错误')
    expect(formatErrorMessage(null)).toBe('操作失败，请重试')
  })
})

describe('formatVersion', () => {
  it('removes backend and subconverter markers', () => {
    expect(formatVersion('subconverter v0.9.0 backend\n')).toBe(' v0.9.0 ')
  })
})

describe('processSubUrl', () => {
  it.each([
    ['a\nb', 'a|b'],
    ['a\rb', 'a|b'],
    ['a\r\nb', 'a|b'],
    ['a\n\r\nb', 'a||b']
  ])('normalizes line endings without duplicating separators', (input, expected) => {
    expect(processSubUrl(input)).toBe(expected)
  })
})
