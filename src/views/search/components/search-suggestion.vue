<template>
  <!-- 搜索建议 -->
  <div class="search-suggestion">
    <van-cell v-for="(text, index) in suggestions" :key="index" icon="search">
      <!-- 改写插槽 -->
      <template #title>
        <span v-html="hightlight(text)" @click="$emit('search', text)"></span>
      </template>
    </van-cell>
    <!-- v-html 指令可以渲染带有 html 标签的文本内容, {{}} 只能渲染纯文本 -->
    <!-- <p>{{ str }}</p>
    <p v-html="str"></p> -->
  </div>
</template>

<script>
import { getSugList } from '@/api/search.js'
// 按需加载 好处: 只会把使用到的成员打包到结果中
import { debounce } from 'lodash'

// 测试
// console.log(getSugList)

export default {
  name: 'SearchSuggestion',
  components: {},
  props: {
    // 用来接受父组件传入的搜索文本
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 搜索建议
      // str: '<span style="color:red">hello</span>'
    }
  },
  computed: {},
  watch: {
    // 监听输入框内容改变
    searchText: {
      // handler(val) {
      //   console.log(val)
      //   this.loadSearchSug(val)
      // },

      // debounce 函数
      // 参数1: 一个函数
      // 参数2: 延迟时间,单位毫秒
      // 返回值: 防抖之后的函数
      // 创建一个 debounce(func,wait) (防抖动)函数, 该函数会从上一次被调用后, 延迟 wait 毫秒后调用 func 方法
      handler: debounce(function(value) {
        console.log(value)
        this.loadSearchSug(value)
      }, 1000),
      immediate: true // 首次立即触发handler
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSug(val) {
      try {
        const { data } = await getSugList(val)
        // console.log(data)
        this.suggestions = data.data.options
      } catch (err) {
        this.$toast('获取数据失败,请稍后再试')
      }
    },
    // 处理文字高亮
    hightlight(text) {
      // 使用 replace 方法把搜索词替换为 带有样式的 html 标签
      // return text.replace(/a/gi, '<span style="color:red">a</span>')

      // 正则表达式 // 中间的内容都会被当做匹配字符来使用, 而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式,则手动new RegExp
      // RegExp 正则表达式构造函数
      // 参数1: 匹配模式字符串, 它会根据这个字符创建正则对象
      // 参数2: 匹配模式, 要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(
        reg,
        `<span style='color:red;'>${this.searchText}</span>`
      )
    }
  }
}
</script>

<style lang="less" scoped></style>
