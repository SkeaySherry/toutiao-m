<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="onPost"
      :disabled="message.trim().length === 0"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'CommentPost',

  // 从祖先组件中获取provide 提供的数据
  inject: {
    articleId: {
      type: String,
      default: null
    }
  },

  props: {
    // 目标id, 接受文章 id 或 评论 id
    target: {
      type: String,
      required: true
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
      message: ''
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 发布评论
    /*
    思路: 组件化 >>> 绑定事件 >>> 封装接口 >>> 调用接口(父传子参数) >>> 处理成功或失败的结果(子传父更新状态)
    问题: 发布成功后, 如何向评论列表组件添加成功评论对象
    方法: (1) 把 list 状态提升到公共的父组件 (2) 使用 ref 直接获取到组件对象 (3) Event Bus(事件总线) (4) vuex
    */
    async onPost() {
      try {
        // 发送请求前,添加loading
        this.$toast.loading({
          message: '发布中...',
          duration: 0, // 一直显示
          forbidClick: true // 禁用背景点击
        })

        const { data } = await addComment({
          target: this.target, // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 评论内容
          art_id: this.type === 'c' ? this.articleId : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        console.log(data)
        // 清空输入框内容
        this.message = ''
        // 发布成功后的操作交给父组件处理
        this.$emit('post-success', data.data.new_obj)

        // 添加成功的提示
        this.$toast.success('发布成功!')
      } catch (err) {
        this.$toast.fail('发布失败!')
      }
    }
  }
}
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>
