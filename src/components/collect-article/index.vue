<template>
  <van-button
    :icon="value ? 'star' : 'star-o'"
    :class="{ collected: value }"
    style="border:none"
    @click="onCollect"
    :loading="loading"
  ></van-button>
</template>

<script>
import { addCollect, delCollect } from '@/api/article'
console.log(addCollect, delCollect)
export default {
  name: 'CollectArticle',
  components: {},
  props: {
    // 接收文章收藏状态
    value: {
      type: Boolean,
      required: true
    },
    art_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false // 控制加载中状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onCollect() {
      // 请求前 ： 打开loading状态
      this.loading = true
      try {
        if (this.value) {
          // 执行取消收藏
          // console.log(this.art_id)
          await delCollect(this.art_id)
          this.$toast.success('取消收藏!')
        } else {
          // 执行收藏文章
          await addCollect(this.art_id)
          this.$toast.success('收藏成功!')
        }
        // 通知父组件收藏状态更新后的值
        this.$emit('input', !this.value)
      } catch (err) {
        this.$toast.fail('操作失败!')
      }
      // 请求后 ： 关闭loading状态
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
