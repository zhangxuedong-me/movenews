import request from '../../utils/request.js'

// 获取用户登录验证
export function getUserInfo (data) {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'post',
    data
  })
}

// 获取短信验证码
export function getCodeInfo (mobile) {
  return request({
    url: `/app/v1_0/sms/codes/${mobile}`,
    method: 'get'
  })
}
