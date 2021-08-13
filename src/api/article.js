// 文章请求模块
import request from '@/utils/request'

// 请求获取文章列表数据
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}

// 获取文章详情
export const getArticleById = id => {
  return request({
    url: '/v1_0/articles/' + id,
    method: 'GET'
  })
}

// 收藏文章
export const addCollect = target => {
  return request({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target // 收藏的目标文章
    }
  })
}
// 取消收藏文章
export const delCollect = target => {
  return request({
    url: '/v1_0/article/collections/' + target,
    method: 'DELETE'
  })
}
// 点赞
export const addLike = target => {
  return request({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target // 点赞的目标文章
    }
  })
}
// 取消点赞文章
export const delLike = target => {
  return request({
    url: '/v1_0/article/likings/' + target,
    method: 'DELETE'
  })
}
