// 请求模块

import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net' // 基础路径
  // baseURL: 'http://192.168.17.27:8000/' // 本地
})

// 配置请求拦截器
request.interceptors.request.use(
  config => {
    // 请求发起会经过这里
    // config ：本次请求的配置对象
    // console.log(config)
    // config 里面有一个属性：headers
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 注意: 这里务必要返回 config 配置对象, 否则请求就停在这里出不去了
    return config
  },
  error => {
    // 如果请求出错了(还没发出去) 会及进入这里
    return Promise.reject(error)
  }
)

// 配置响应拦截器

// 暴露出去
export default request
