import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/icon.css'
import './assets/styles/global.scss'
import i18n from './lang'
import './utils/boost'
import './utils/create-api'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// import './mock'

Vue.config.productionTip = false

// 路由跳转加载条
Nprogress.configure({
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3 // 初始化最小百分比
})

router.beforeEach((to, from, next) => {
  Nprogress.start()

  next()
})

router.afterEach(() => {
  Nprogress.done()
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
