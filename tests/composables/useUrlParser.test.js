import { afterEach, describe, expect, it, vi } from 'vitest'
import { useSubscription } from '@/composables/useSubscription'
import { useSubscriptionForm } from '@/composables/useSubscriptionForm'
import { useUrlParser } from '@/composables/useUrlParser'
import { processSubUrl } from '@/utils/formatters'

const createState = () => {
  const state = useSubscriptionForm()
  state.form.clientType = 'clash'
  return state
}

describe('useUrlParser', () => {
  const parser = useUrlParser()

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns long subscription URLs without fetching', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const url = 'https://backend.example/sub?target=clash&url=https%3A%2F%2Fexample.com'

    await expect(parser.analyzeUrl(url)).resolves.toBe(url)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('expands a short URL through fetch', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      url: 'https://backend.example/sub?target=clash&url=https%3A%2F%2Fexample.com'
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(parser.analyzeUrl('https://short.example/target-in-path')).resolves.toContain(
      'target=clash'
    )
    expect(fetchMock).toHaveBeenCalledWith('https://short.example/target-in-path', {
      method: 'GET',
      redirect: 'follow'
    })
  })

  it('reports short-link expansion errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))

    await expect(parser.analyzeUrl('https://short.example/a')).rejects.toThrow(
      '解析短链接失败，请检查短链接服务端是否配置跨域'
    )
  })

  it('rejects blank and incomplete URLs', async () => {
    const { form, customParams } = createState()
    const onSuccess = vi.fn()
    const onError = vi.fn()

    await expect(parser.parseUrl('   ', form, customParams, onSuccess, onError)).resolves.toBe(
      false
    )
    expect(onError).toHaveBeenCalledWith('订阅链接不能为空')

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ url: 'https://backend.example/sub?foo=bar' })
    )
    await expect(
      parser.parseUrl('https://backend.example/sub?foo=bar', form, customParams, onSuccess, onError)
    ).resolves.toBe(false)
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).toHaveBeenLastCalledWith('请输入正确的订阅地址!')
  })

  it('preserves optional form defaults when a basic URL omits them', async () => {
    const { form, customParams } = createState()
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const url =
      'https://backend.example/sub?target=clash&url=' +
      encodeURIComponent('https://one.example/sub|vmess://node') +
      '&insert=false'

    await expect(parser.parseUrl(url, form, customParams, onSuccess, onError)).resolves.toBe(true)
    expect(form.sourceSubUrl).toBe('https://one.example/sub\nvmess://node')
    expect(form.emoji).toBe(true)
    expect(form.scv).toBe(true)
    expect(form.udp).toBe(true)
    expect(form.expand).toBe(true)
    expect(form.new_name).toBe(true)
    expect(onSuccess).toHaveBeenCalledOnce()
    expect(onError).not.toHaveBeenCalled()
  })

  it('clears stale optional values before applying a basic URL', async () => {
    const { form, customParams } = createState()
    form.remoteConfig = 'https://stale.example/config.ini'
    form.emoji = false
    const url =
      'https://backend.example/sub?target=clash&url=' +
      encodeURIComponent('https://one.example/sub') +
      '&insert=false'

    await expect(parser.parseUrl(url, form, customParams, vi.fn(), vi.fn())).resolves.toBe(true)
    expect(form.remoteConfig).toBe('')
    expect(form.emoji).toBe(true)
  })

  it('round-trips advanced and custom parameters', async () => {
    const source = createState()
    source.form.sourceSubUrl = 'https://one.example/sub\r\nvmess://fake-node\nss://fake-node'
    source.form.remoteConfig = 'https://config.example/a.ini'
    source.form.includeRemarks = '香港|日本'
    source.form.userAgent = 'Clash Meta'
    source.form.emoji = false
    source.form.tpl.clash.doh = true
    const customParams = [{ name: 'x option', value: 'a&b' }]
    const url = useSubscription().makeUrl(
      source.form,
      '2',
      processSubUrl(source.form.sourceSubUrl),
      'https://backend.example',
      customParams,
      true
    )

    const target = createState()
    const onSuccess = vi.fn()
    const onError = vi.fn()
    await expect(
      parser.parseUrl(url, target.form, target.customParams, onSuccess, onError)
    ).resolves.toBe(true)

    expect(target.form.sourceSubUrl).toBe(
      'https://one.example/sub\nvmess://fake-node\nss://fake-node'
    )
    expect(target.form.remoteConfig).toBe(source.form.remoteConfig)
    expect(target.form.includeRemarks).toBe(source.form.includeRemarks)
    expect(target.form.userAgent).toBe(source.form.userAgent)
    expect(target.form.emoji).toBe(false)
    expect(target.form.tpl.clash.doh).toBe(true)
    expect(target.customParams).toEqual(customParams)
    expect(onError).not.toHaveBeenCalled()
  })

  it('restores surge target and version fields', async () => {
    const { form, customParams } = createState()
    const onError = vi.fn()
    const url =
      'https://backend.example/sub?target=surge&ver=5&url=' +
      encodeURIComponent('https://one.example/sub') +
      '&insert=true'

    await expect(parser.parseUrl(url, form, customParams, vi.fn(), onError)).resolves.toBe(true)
    expect(form.clientType).toBe('surge&ver=5')
    expect(form.insert).toBe(true)
    expect(customParams).toEqual([])
    expect(onError).not.toHaveBeenCalled()
  })
})
