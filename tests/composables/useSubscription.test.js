import { describe, expect, it } from 'vitest'
import { useSubscription } from '@/composables/useSubscription'
import { useSubscriptionForm } from '@/composables/useSubscriptionForm'
import { processSubUrl } from '@/utils/formatters'

const createForm = () => {
  const { form } = useSubscriptionForm()
  form.sourceSubUrl = 'https://example.com/sub'
  form.clientType = 'clash'
  return form
}

describe('useSubscription', () => {
  const subscription = useSubscription()

  it.each([
    ['', ''],
    ['   ', ''],
    ['https://backend.example', 'https://backend.example/sub?'],
    ['https://backend.example/', 'https://backend.example/sub?'],
    ['https://backend.example/sub', 'https://backend.example/sub?'],
    ['https://backend.example/sub?', 'https://backend.example/sub?'],
    ['https://backend.example/sub?token=1', 'https://backend.example/sub?token=1&']
  ])('normalizes backend URLs', (input, expected) => {
    expect(subscription.normalizeBackendUrl(input)).toBe(expected)
  })

  it('returns an empty URL for an invalid form', () => {
    const form = createForm()
    form.sourceSubUrl = '   '

    expect(subscription.makeUrl(form, '1', '', 'https://backend.example', [], true)).toBe('')
  })

  it('builds a basic URL without advanced parameters', () => {
    const form = createForm()
    const result = subscription.makeUrl(
      form,
      '1',
      'https://one.example/sub|vmess://node',
      'https://backend.example',
      [],
      true
    )

    expect(result).toBe(
      'https://backend.example/sub?target=clash&url=' +
        encodeURIComponent('https://one.example/sub|vmess://node') +
        '&insert=false'
    )
  })

  it('encodes multiple newline-separated subscription links as one URL parameter', () => {
    const form = createForm()
    const sourceSubUrl = 'https://one.example/sub\r\nvmess://fake-node\nss://fake-node'
    const processedSubUrl = processSubUrl(sourceSubUrl)
    const result = subscription.makeUrl(
      form,
      '1',
      processedSubUrl,
      'https://backend.example',
      [],
      true
    )

    expect(processedSubUrl).toBe('https://one.example/sub|vmess://fake-node|ss://fake-node')
    expect(new URL(result).searchParams.get('url')).toBe(processedSubUrl)
  })

  it('builds encoded advanced and custom parameters', () => {
    const form = createForm()
    form.remoteConfig = 'https://config.example/a b.ini'
    form.includeRemarks = '香港|日本'
    form.excludeRemarks = '过期'
    form.filename = '我的订阅'
    form.userAgent = 'Clash Meta'
    form.tpl.clash.doh = true

    const result = subscription.makeUrl(
      form,
      '2',
      form.sourceSubUrl,
      'https://backend.example/sub?',
      [
        { name: 'x option', value: 'a&b' },
        { name: '', value: 'ignored' }
      ],
      true
    )

    const url = new URL(result)
    expect(url.searchParams.get('config')).toBe(form.remoteConfig)
    expect(url.searchParams.get('include')).toBe(form.includeRemarks)
    expect(url.searchParams.get('exclude')).toBe(form.excludeRemarks)
    expect(url.searchParams.get('filename')).toBe(form.filename)
    expect(url.searchParams.get('ua')).toBe(form.userAgent)
    expect(url.searchParams.get('udp')).toBe('true')
    expect(url.searchParams.get('clash.doh')).toBe('true')
    expect(url.searchParams.get('x option')).toBe('a&b')
  })

  it('keeps the surge version query contract and omits UDP when disabled', () => {
    const form = createForm()
    form.clientType = 'surge&ver=4'

    const result = subscription.makeUrl(
      form,
      '2',
      form.sourceSubUrl,
      'https://backend.example',
      [],
      false
    )
    const url = new URL(result)

    expect(url.searchParams.get('target')).toBe('surge')
    expect(url.searchParams.get('ver')).toBe('4')
    expect(url.searchParams.has('udp')).toBe(false)
  })
})
