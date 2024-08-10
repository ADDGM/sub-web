/* eslint-disable no-console */

import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}sub-web.js`, {
    ready () {
      console.log(
        '应用程序由服务工作者从缓存中提供服务.\n' +
        '详情请访问 https://goo.gl/AFskqB'
      )
    },
    registered () {
      console.log('服务工作者已注册.')
    },
    cached () {
      console.log('内容已缓存供离线使用.')
    },
    updatefound () {
      console.log('正在下载新内容。')
    },
    updated () {
      console.log('有新内容；请刷新.')
    },
    offline () {
      console.log('未找到互联网连接。应用程序正在离线模式下运行.')
    },
    error (error) {
      console.error('服务工件注册过程中出错:', error)
    }
  })
}
