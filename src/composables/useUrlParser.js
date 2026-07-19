import { useSubscriptionForm } from '@/composables/useSubscriptionForm'

/**
 * URL解析逻辑
 */
export function useUrlParser() {
  /**
   * 异步分析URL
   * @param {string} loadConfig - 待分析的URL
   * @returns {Promise<string>} 分析结果
   */
  const analyzeUrl = async (loadConfig) => {
    try {
      const url = new URL(loadConfig)
      if (url.searchParams.has('target')) {
        return loadConfig
      }
    } catch {
      // Let fetch report invalid or unreachable short links with the shared error message.
    }

    try {
      const response = await fetch(loadConfig, {
        method: 'GET',
        redirect: 'follow'
      })
      return response.url
    } catch (error) {
      throw new Error('解析短链接失败，请检查短链接服务端是否配置跨域：' + error)
    }
  }

  /**
   * 确认并加载配置
   * @param {string} loadConfig - 待解析的配置URL
   * @param {Object} form - 表单对象
   * @param {Array} customParams - 自定义参数数组
   * @param {Function} onSuccess - 成功回调
   * @param {Function} onError - 错误回调
   * @returns {Promise<boolean>} 是否成功
   */
  const parseUrl = async (loadConfig, form, customParams, onSuccess, onError) => {
    // Check if 'loadConfig' is empty
    if (loadConfig.trim() === '') {
      onError('订阅链接不能为空')
      return false
    }

    try {
      // Analyze the URL and extract its components
      const url = new URL(await analyzeUrl(loadConfig))

      // Parse the URL parameters
      const params = new URLSearchParams(url.search)

      const knownParams = new Set([
        'target',
        'ver',
        'url',
        'insert',
        'config',
        'exclude',
        'include',
        'filename',
        'ua',
        'append_type',
        'emoji',
        'list',
        'tfo',
        'scv',
        'fdn',
        'sort',
        'udp',
        'expand',
        'surge.doh',
        'clash.doh',
        'new_name'
      ])

      // Get the 'target' parameter
      const target = params.get('target')
      const sourceSubUrl = params.get('url')
      if (!target || !sourceSubUrl) {
        throw new Error('缺少必要的订阅参数')
      }

      Object.assign(form, useSubscriptionForm().form)
      form.customBackend = url.origin + url.pathname + '?'

      // Set the client type based on the 'target' parameter
      if (target === 'surge') {
        const ver = params.get('ver') || '4'
        form.clientType = target + '&ver=' + ver
      } else {
        form.clientType = target
      }

      // Set other form properties based on the URL parameters
      form.sourceSubUrl = sourceSubUrl.replace(/\|/g, '\n')
      form.insert = params.get('insert') === 'true'
      const textParams = {
        config: 'remoteConfig',
        exclude: 'excludeRemarks',
        include: 'includeRemarks',
        filename: 'filename',
        ua: 'userAgent'
      }
      Object.entries(textParams).forEach(([paramName, formField]) => {
        if (params.has(paramName)) {
          form[formField] = params.get(paramName)
        }
      })

      const booleanParams = {
        append_type: 'appendType',
        emoji: 'emoji',
        list: 'nodeList',
        tfo: 'tfo',
        scv: 'scv',
        fdn: 'fdn',
        sort: 'sort',
        udp: 'udp',
        expand: 'expand',
        new_name: 'new_name'
      }
      Object.entries(booleanParams).forEach(([paramName, formField]) => {
        if (params.has(paramName)) {
          form[formField] = params.get(paramName) === 'true'
        }
      })

      if (params.has('surge.doh')) {
        form.tpl.surge.doh = params.get('surge.doh') === 'true'
      }
      if (params.has('clash.doh')) {
        form.tpl.clash.doh = params.get('clash.doh') === 'true'
      }

      // Filter custom parameters
      customParams.splice(0, customParams.length)
      Array.from(
        params
          .entries()
          .filter((e) => !knownParams.has(e[0]))
          .map((e) => ({ name: e[0], value: e[1] }))
      ).forEach((param) => customParams.push(param))

      onSuccess()
      return true
    } catch (error) {
      onError('请输入正确的订阅地址!')
      return false
    }
  }

  return {
    analyzeUrl,
    parseUrl
  }
}
