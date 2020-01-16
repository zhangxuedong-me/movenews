import request from '@/utils/request.js'

// 获取搜索的联想建议
export function getAssociate (q) {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'get',
    params: {
      q
    }
  })
}

// 获取搜索的内容
export function getSearchResult (params) {
  return request({
    url: '/app/v1_0/search',
    method: 'get',
    params
  })
}
