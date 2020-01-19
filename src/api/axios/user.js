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

// 获取用户自己的信息
export function getMeInfo () {
  return request({
    url: '/app/v1_0/user',
    method: 'get'
  })
}

// 关注用户
export const followUser = userId => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'post',
    data: {
      target: userId
    }
  })
}

// 取消关注用户
export const cancelFollowUser = target => {
  return request({
    url: `/app/v1_0/user/followings/${target}`,
    method: 'delete'
  })
}

// 获取用户的个人资料
export const getUserData = data => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'get'
  })
}

// 编辑用户资料
export const editUserData = data => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'patch',
    data
  })
}

// 上传用户头像
export const editUploadImg = data => {
  return request({
    url: '/app/v1_0/user/photo',
    method: 'patch',
    data
  })
}
