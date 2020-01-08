import axios from 'axios'
// 超出js安全整数范围的问题
import jsonBig from 'json-bigint'
// 相当于复制了一个axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn' // 基础路径
})

// 请求拦截器
request.interceptors.request.use(function (config) {
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
