<template>
  <div class="comment-reply">
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>

    <div class="scroll-wrap">
      <!-- 当前评论项 (复用评论列表的评论项组件)-->
      <comment-item :comment="comment" />
      <!-- /当前评论项 -->

      <van-cell title="全部回复" />

      <!-- 评论的回复列表 -->
      <comment-list :source="comment.com_id" type="c" :list="replyList" />
      <!-- /评论的回复列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="reply-bottom">
      <van-button
        class="write-btn"
        size="small"
        round
        @click="isPostShow = true"
        >写评论</van-button
      >
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <comment-post
        @post-success="onPostSuccess"
        :target="comment.com_id"
        type="c"
      />
    </van-popup>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import CommentItem from './comment-item.vue'
import CommentList from './comment-list.vue'
import CommentPost from './comment-post.vue'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  props: {
    // 接受父组件传入的评论对象
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isPostShow: false, // 控制评论弹出层是否显示
      replyList: [] // 回复列表
    }
  },
  methods: {
    // 处理子组件发布评论成功的事件
    onPostSuccess(comment) {
      // 关闭弹出层
      this.isPostShow = false
      // 将评论内容添加到评论列表最前面
      this.replyList.unshift(comment)
      // 更新回复数据
      this.comment.reply_count++
    }
  }
}
</script>

<style scoped lang="less">
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.reply-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .write-btn {
    width: 60%;
  }
}
</style>
