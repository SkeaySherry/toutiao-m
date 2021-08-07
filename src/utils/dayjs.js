// 导入 Vue
import Vue from 'vue'
// 导入 dayjs 包
import dayjs from 'dayjs'

// 导入中文语言包
import 'dayjs/locale/zh-cn'

// 配置处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// 全局注册中文包(语言配置)
dayjs.locale('zh-cn') // 全局使用简体中文

// 时间格式化: dayjs(时间).format()
// console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'))

// 处理相对时间的方法:
// dayjs(timeA).to(timeB) : 从 timeA 到 timeB 的相对时间
// dayjs(timeA).from(timeB) : 从 timeB 到 timeA 的相对时间
// console.log(dayjs().to('2021-08-06 12:00:00'))
// console.log(dayjs().from('2021-08-06 12:00:00'))

// 全局过滤器：处理相对时间
// 参数1: 过滤器名称  参数2: 过滤器函数
// 使用方式: {{ 表达式 | 过滤器名称 }}
// 管道符前面的表达式结果回作为参数传递到过滤器函数中
// 过滤器的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
