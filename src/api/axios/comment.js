import request from '../../utils/request.js'

// 获取评论数据或者评论回复的数据
export const getCommentData = params => {
  return request({
    url: '/app/v1_0/comments',
    method: 'get',
    params
  })
}

// 给评论点赞
export const commentClickHelp = commentId => {
  return request({
    url: '/app/v1_0/comment/likings',
    method: 'post',
    data: {
      target: commentId
    }
  })
}

// 取消对评论点赞
export const cacelCommentHelp = commentId => {
  return request({
    url: `/app/v1_0/comment/likings/${commentId}`,
    method: 'delete'
  })
}

// 发表评论或者评论回复
export const publishComments = data => {
  return request({
    url: '/app/v1_0/comments',
    method: 'post',
    data
  })
}
