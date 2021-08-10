<template>
  <!-- 搜索页面 -->
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        background="#3296fa"
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
      <!-- 当搜索框获取焦点时,关闭搜索结果显示 -->
    </form>

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    ></search-result>
    <!-- /搜索结果 -->
    <!-- 搜索建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- /搜索建议 -->
    <!-- 搜索历史-->
    <search-history v-else></search-history>
    <!-- /搜索历史 -->
  </div>
</template>

<script>
/* a. 搜索功能项组件化
  (1) 创建组件 >>> 导入组件 >>> 注册组件 >>> 使用组件

  b. 按需显示三个组件
  (1) 如果有搜索结果, 有限显示搜索结果组件
  (2) 如果没有搜索结果, 看有没有搜索文本, 有则显示搜索建议组件
  (3) 都没有, 展示搜索历史组件
  (4) 补充: 当搜索框获取焦点时, 关闭搜索结果显示

  c. 获取搜索建议
  (1) 搜索建议子组件需要根据搜索文本来请求数据, 先用父传子把搜索词传进去
  (2) 利用 watch 监听输入框内容改变
  (3) 封装接口 >>> 导入接口 >>> 定义请求方法 >>> 调用方法, 获取数据 >>> 保存数据 >>> 渲染数据
  (4) 性能优化: 对输入框进行防抖处理, 使用 lodash 工具库
  (5) 高亮搜索文本: 定义一个高亮方法; 使用 replace 方法配合动态正则表达式完成搜索词的替换; 再使用 v-html 标签渲染

  */

import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
export default {
  name: 'SearchPage',
  components: { SearchResult, SearchSuggestion, SearchHistory },
  props: {},
  data() {
    return {
      searchText: '', // 搜索文本
      isResultShow: false // 控制搜索结果的展示
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      // console.log(val)

      // 把子组件传递过来的搜索建议显示到输入框中
      this.searchText = val

      this.isResultShow = true
    },
    onCancel() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  padding-bottom: 100px;
  .van-search__action {
    color: #fff;
  }
  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
