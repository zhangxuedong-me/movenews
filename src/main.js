import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/register-vant.js'
import './styles/index.less'
// 用来设置rem的精准值
import 'amfe-flexible'
import './utils/validation.js'
import './utils/datatime.js'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
