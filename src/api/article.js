// 文章请求模块
import request from '@/utils/request'

// 请求获取文章列表数据
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_1/articles',
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
