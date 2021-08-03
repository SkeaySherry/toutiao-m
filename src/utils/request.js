// 请求模块

import axios from 'axios'

const request = axios.create({
  baseUrl: 'http://toutiao-app.itheima.net' // 基础路径
})

// 配置请求拦截器

// 配置响应拦截器

// 暴露出去
export default request
