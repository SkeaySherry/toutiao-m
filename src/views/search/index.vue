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
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear="searchHistories = []"
      @search="onSearch"
    ></search-history>
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

  d.获取搜索结果
  (1) 点击建议项, 输入框中显示建议项内容, 并显示搜索结果 >>> 子传父技术
  (2) 在 api 中封装搜索结果接口
  (3) 调用接口, 获取下一页的数据
  (4) 把得到的数据追加到 list 数组中
  (5) 关闭加载中状态
  (6) 判断数据是否全部加载完成
  (7) 如果已完成 >>> 把 finished 设为 true
  (8) 没有完成 >>> 更新页码值
  (9) 判断请求失败, 显示错误提示信息 && 关闭加载中状态

  e. 获取搜索历史
  (1) 触发了搜素事件后,我们要保存搜索的文本
  (2) 添加历史记录要求: 不能有重复的记录项, 且最新的搜索记录显示在最前面
  (3) 渲染搜索历史记录: 父传子, 把历史记录传入子组件 >>> 遍历循环, 进行渲染
  (4) 切换删除状态: 定义删除状态的数据变量 >>> 模板中进行条件渲染 >>> 点击后切换状态值
  (5) 删除历史记录项: 单个删除直接用 splice 方法, 全部删除使用 子传父
  (6) 历史记录持久化存储: 在 watch 中监听数据改变存入本地; 在 data 中从本地取出初始值进行赋值

  */

import SearchResult from './components/search-result.vue'
import SearchSuggestion from './components/search-suggestion.vue'
import SearchHistory from './components/search-history.vue'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchPage',
  components: { SearchResult, SearchSuggestion, SearchHistory },
  props: {},
  data() {
    return {
      searchText: '', // 搜索文本
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORY') || [] // 搜索的历史记录数据
    }
  },
  computed: {},
  watch: {
    searchHistories() {
      setItem('TOUTIAO_SEARCH_HISTORY', this.searchHistories)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onSearch(val) {
      // console.log(val)

      // 把子组件传递过来的搜索建议显示到输入框中
      this.searchText = val

      // 储存搜索历史
      // 不能有重复历史记录项存在, 把最新的搜索文本显示在历史记录的最前面[LRU缓存]
      const index = this.searchHistories.indexOf(val)

      if (index !== -1) {
        // 有重复项, 删除重复项
        this.searchHistories.splice(index, 1)
      }
      // 把当前搜索文本显示到最前面
      this.searchHistories.unshift(val)

      // 渲染搜索结果
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
