import request from '@/utils/request'
// import store from '@/store'

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    data
  })
}
// 发送短信验证码
// 注意： 每个手机号每分钟只能发送一次
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意: 该接口需要授权才可以访问
    //   Authorization: `Bearer ${store.state.user.token}`
    //   // Bearer 后面有空格 这里格式 名字 都非常重要
    // }
    // 优化 : 配置请求拦截器
  })
}

// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}
