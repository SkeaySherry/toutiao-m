<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
  >
    <comment-item
      v-for="(comment, index) in list"
      :key="index"
      :comment="comment"
      @reply-click="$emit('reply-click', $event)"
    ></comment-item>
  </van-list>
</template>
<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item.vue'
// console.log(getComments)
export default {
  name: 'CommentList',
  components: { CommentItem },
  props: {
    // 接受父组件传来的文章 id
    source: {
      type: String,
      required: true
    },
    // 接受父组件传入的评论列表
    list: {
      type: Array,
      default: () => [] // 不是必传项,当没有传list过来时默认是空数组
    },
    // 接受父组件传入的type
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data() {
    return {
      // list: [], // 评论列表 >>> 状态提升 到父组件
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 加载下一页列表的页码值
      limit: 5, // 每页评论的数量
      error: false // 控制是否加载失败
    }
  },

  methods: {
    async onLoad() {
      try {
        // 1. 调用接口,获取列表数据
        const { data } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source, // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })
        console.log(data)
        // 2. 得到的数据追加到list数组中
        const { results } = data.data
        this.list.push(...results)
        // 3. 关闭loading状态
        this.loading = false
        // 4. 判断数据是否都全部加载完成
        if (results.length === 0) {
          // 4.1 已完成 >>> finished 设为 true
          this.finished = true
        } else {
          // 4.2 未完成 >>> 更新下一页的页码值
          this.offset = data.data.last_id
        }
      } catch (err) {
        // 打开失败的提示
        this.error = true
        // 关闭loading加载中
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
