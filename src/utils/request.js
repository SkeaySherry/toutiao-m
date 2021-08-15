// 请求模块

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 导入 json-bigint
// import JSONBig from 'json-bigint'   // 使用新接口就不用处理大数字问题了

// const jsonStr = '{"art_id": 1234567789907753}'

// console.log(JSON.parse(jsonStr)) // 会丢失精度

// console.log(JSONBig.parse(jsonStr)) // 不会丢失精度, 使用对象来表示大整数数字
// console.log(JSONBig.parse(jsonStr).art_id.toString())

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net' // 基础路径 移动端和PC端都可以使用
  // baseURL: 'http://192.168.17.27:8000/' // 本地
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  // transformResponse: [
  //   function(data) {
  //     // 对 data 进行任意转换处理
  //     try {
  //       return JSONBig.parse(data)
  //     } catch (err) {
  //       return data
  //     }
  //   }
  // ]
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

// 配置响应拦截器 (可以拦截所有的401未授权失败,统一跳转到登录页)
// request.interceptors.response.use(
//   function(response) {
//     return response
//   },
//   function(error) {
//     if (error.response && error.response.status === 401) {
//       return router.push('/login')
//     }
//     return Promise.reject(error)
//   }
// )
request.interceptors.response.use(
  // 响应成功进入第1个函数
  // 该函数的参数是响应对象
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  // 响应失败进入第2个函数，该函数的参数是错误对象
  async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // 如果响应码是 401 ，则请求获取新的 token

    // 响应拦截器中的 error 就是那个响应的错误对象
    console.dir(error)
    if (error.response && error.response.status === 401) {
      // 校验是否有 refresh_token
      const user = store.state.user

      if (!user || !user.refresh_token) {
        router.push('/login')

        // 代码不要往后执行了
        return
      }

      // 如果有refresh_token，则请求获取新的 token
      try {
        const res = await axios({
          method: 'PUT',
          url: 'http://toutiao.itheima.net/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })

        // 如果获取成功，则把新的 token 更新到容器中
        console.log('刷新 token  成功', res)
        store.commit('setUser', {
          token: res.data.data.token, // 最新获取的可用 token
          refresh_token: user.refresh_token // 还是原来的 refresh_token
        })

        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config)
      } catch (err) {
        // 如果获取失败，直接跳转 登录页
        console.log('请求刷线 token 失败', err)
        router.push('/login')
      }
    }

    return Promise.reject(error)
  }
)

// 暴露出去
export default request
