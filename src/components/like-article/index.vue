<template>
  <van-button
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ liked: value === 1 }"
    style="border:none"
    @click="onLike"
    :loading="loading"
  />
</template>

<script>
import { addLike, delLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  components: {},
  props: {
    // 接受父组件传入的点赞状态
    value: {
      type: Number,
      required: true
    },
    art_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLike() {
      this.loading = true
      try {
        if (this.value === 1) {
          // 执行取消点赞
          await delLike(this.art_id)
        } else {
          // 执行点赞
          await addLike(this.art_id)
        }
        // 提示
        this.$toast.success(this.value === 1 ? '取消点赞!' : '点赞成功!')
        // 把点赞后的状态传递给父组件
        this.$emit('input', this.value === 1 ? -1 : 1)
      } catch (err) {
        // console.log(err)
        this.$toast.fail('点赞失败!')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
