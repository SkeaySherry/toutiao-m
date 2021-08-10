// 搜索相关的接口

import request from '@/utils/request'

// 获取搜索建议
export const getSugList = q => {
  return request({
    url: '/v1_0/suggestion',
    method: 'GET',
    params: {
      q
    }
  })
}

// 获取搜索结果
export const getSearchResult = params => {
  return request({
    url: '/v1_0/search',
    method: 'GET',
    params
  })
}
