<template>
  <div class="article-list">
    <!-- List 列表组件 (触底后加载下一页)
      loading: 控制上拉加载更多的loading 状态 ==> 每次加载数据完成后要设置为false
      finished: 控制数据是否加载结束 ==> 判断数据全部加载完成后要设置为true
      load: 触底或初始化会触发调用load事件 ==> 请求下一页数据,追加到列表末尾
    -->
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <!-- 3. 使用文章列表项组件的位置 -->
        <!-- 4. 传递props数据到子组件中 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
// 1. 导入组件
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  // 2. 注册组件
  components: { ArticleItem },
  props: {
    // 当前的频道对象
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中loading状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页的时间戳
      error: false,
      isLoading: false, // 下拉加载中状态
      refreshText: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 初始化或滚动到底部的时候会触发调用onload
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: this.timestamp || Date.now(),
          // timestamp简单理解就是请求数据的页码
          // 请求第1页数据: 当前最新时间戳
          // 用于请求之后的时间戳会在当前请求结果中返回给你
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // console.log(data)

        // 2. 把请求结果数据放到 list 数组中 ==> 一定要记住是追加, 因为只有追加才会让列表高度不断增加
        const { results } = data.data
        this.list.push(...results)

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        // loading 关闭之后才能触发下一次的加载更多
        this.loading = false

        // 4. 判断数据是否全部加载完成
        if (results.length === 0) {
          // 如果没有数据了, 把finished设置为true, 之后不再触发更多
          this.finished = true
        } else {
          // 5. 更新请求下一页的时间戳
          this.timestamp = data.data.pre_timestamp
        }
      } catch (err) {
        // console.log('请求失败', err)
        // 开启错误提示
        this.error = true
        // 取消加载中的状态
        this.loading = false
      }
    },
    // onLoad() {
    //   console.log('onload')
    //   // 1. 请求获取数据
    //   setTimeout(() => {
    //     // 2. 把请求结果数据放到 list 数组中
    //     for (let i = 0; i < 10; i++) {
    //       this.list.push(this.list.length + 1)
    //     }

    //     // 3. 本次数据加载结束之后要把加载状态设置为结束
    //     // loading 关闭之后才能触发下一次的加载更多
    //     this.loading = false

    //     // 4. 判断数据是否全部加载完成
    //     if (this.list.length >= 40) {
    //       // 如果没有数据了, 把finished设置为true, 之后不再触发更多
    //       this.finished = true
    //     }
    //   }, 1000)
    // }
    // 下拉刷新事件
    async onRefresh() {
      // console.log('刷新中...')
      try {
        // 1.请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(), // 请求第1页数据: 当前最新时间戳
          with_top: 1
        })

        // 随机模拟失败情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('fdskfkakf')
        // }

        // 2. 把请求结果数据放到 list 数组顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3. 关闭下拉刷新的loading状态
        this.isLoading = false

        // 4.更新下拉刷新成功提示文本
        this.refreshText = `刷新成功, 更新了${results.length} 条数据`
      } catch (err) {
        // console.log('请求失败', err)
        // 关闭下拉刷新的loading状态
        this.isLoading = false
        // 更新提示文本
        this.refreshText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;

  // 视口（在移动端是布局视口）单位：vw 和 vh，不受父元素影响
  // 1vw = 视口宽度的百分之一
  // 1vh = 视口高度的百分之一

  // 兼容不同的手机高度 (cal 计算css单位)
  height: 79vh;
  overflow-y: auto;
}
</style>
