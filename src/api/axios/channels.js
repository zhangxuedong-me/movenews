import request from '../../utils/request.js'
// 获取频道列表数据
export function getChannelsList () {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'get'
  })
}
// 获取全部的频道数据
export function getAllChannels () {
  return request({
    url: '/app/v1_0/channels',
    method: 'get'
  })
}
