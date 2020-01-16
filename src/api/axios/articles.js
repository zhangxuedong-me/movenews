import request from '../../utils/request.js'

// 获取所有的文章
export const getArticlesList = params => {
  return request({
    url: '/app/v1_1/articles',
    method: 'get',
    params
  })
}
// 获取文章详情
export const getArticlesDatails = articleId => {
  return request({
    url: `/app/v1_0/articles/${articleId}`,
    method: 'get'
  })
}

// 收藏文章
export const collectArticle = articleId => {
  return request({
    url: '/app/v1_0/article/collections',
    method: 'post',
    data: {
      target: articleId
    }
  })
}

// 取消收藏文章
export const cancelCollect = articleId => {
  return request({
    url: `/app/v1_0/article/collections/${articleId}`,
    method: 'delete'
  })
}

// 对文章点赞
export const articleHelp = articleId => {
  return request({
    url: '/app/v1_0/article/likings',
    method: 'post',
    data: {
      target: articleId
    }
  })
}

// 取消对文章点赞
export const articleCancel = articleId => {
  return request({
    url: `/app/v1_0/article/likings/${articleId}`,
    method: 'delete'
  })
}
