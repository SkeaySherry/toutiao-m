// 请求模块

import axios from 'axios'
import store from '@/store'

// 导入 json-bigint
import JSONBig from 'json-bigint'

// const jsonStr = '{"art_id": 1234567789907753}'

// console.log(JSON.parse(jsonStr)) // 会丢失精度

// console.log(JSONBig.parse(jsonStr)) // 不会丢失精度, 使用对象来表示大整数数字
// console.log(JSONBig.parse(jsonStr).art_id.toString())

const request = axios.create({
  baseURL: 'http://toutiao-app.itheima.net', // 基础路径
  // baseURL: 'http://192.168.17.27:8000/' // 本地
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    function(data) {
      // 对 data 进行任意转换处理
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
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
