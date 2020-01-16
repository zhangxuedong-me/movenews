import axios from 'axios'
// 超出js安全整数范围的问题
import jsonBig from 'json-bigint'
// 引入store也就是vuex，因为在js文件中使用this.$store是拿不到store实例的
// 所以必须引入进来
import store from '@/store'
// 相当于复制了一个axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn' // 基础路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // 先拿到本地存储的token
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 在响应之前设置js超出整数安全范围的问题
request.defaults.transformResponse = [function (data) {
  try {
    return jsonBig.parse(data)
  } catch (err) {
    return []
  }
}]

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

export default request
