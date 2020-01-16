// 处理和日期格式相关的操作
import Vue from 'vue'
import moment from 'moment'
// 设置国家语言
moment.locale('zh-cn')
// 注册全局过滤器
Vue.filter('relativeTime', value => {
  return moment(value).startOf('second').fromNow()
})
// 格式化日期
Vue.filter('formatTime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(value).format(format)
})
