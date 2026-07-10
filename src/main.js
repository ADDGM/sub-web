import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/plugins/element-ui'
import '@/plugins/clipboard'
import '@/plugins/axios'
import '@/plugins/device'
import { printConsoleBanner } from '@/utils/consoleBanner'

import '@/icons' // icon

Vue.config.productionTip = false

printConsoleBanner()

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
