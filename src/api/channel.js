// 关于频道编辑的相关接口

import request from '@/utils/request'

// 获取所有频道
export const getAllChannels = () => {
  return request({
    url: '/v1_0/channels',
    method: 'GET'
  })
}

// 在线添加频道
export const addUserChannels = data => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      // data 表示要添加的频道对象 { id, seq }
      channels: [data]
    }
  })
}
// 在线删除频道
export const delUserChannels = id => {
  return request({
    url: '/v1_0/user/channels/' + id,
    method: 'DELETE'
  })
}
