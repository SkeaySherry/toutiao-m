<template>
  <!-- 搜索结果 -->
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败,点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search.js'
// 测试
// console.log(getSearchResult)
export default {
  name: 'SearchResult',
  components: {},
  props: {
    // 接受父组件传入的搜索文本
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [], // 列表数组
      loading: false, // 控制加载中的状态
      finished: false, // 控制加载完成的状态
      page: 1, // 页码值
      per_page: 10, // 每一页显示的文章数量
      error: false // 控制是否显示失败的提示
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      // 1. 调用接口,获取下一页的数据
      try {
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText
        })
        console.log(data)
        // 2.把得到的数据追加到list数组中
        const { results } = data.data
        this.list.push(...results)
        // 3.关闭加载中状态
        this.loading = false
        // 4.判断数据是否全部加载完成
        if (results.length === 0) {
          // (1) 如果已完成 >>> 把 finished 设为 true
          this.finished = true
        } else {
          // (2) 没有完成 >>> 更新页码值
          this.page++
        }
      } catch (err) {
        // 5.(1)请求失败,显示错误信息
        this.error = true
        // (2)关闭加载中状态
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
