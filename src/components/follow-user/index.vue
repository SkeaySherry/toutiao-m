<template>
  <van-button
    v-if="is_followed"
    class="follow-btn"
    round
    size="small"
    @click="onFollow"
    :loading="loading"
  >
    已关注
  </van-button>
  <van-button
    v-else
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
</template>

<script>
import { addFollow, delFollow } from '@/api/user'
// 测试
// console.log(addFollow, delFollow)
export default {
  name: 'FollowUser',
  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: 'is_followed', // 默认是 value
    event: 'update_followed' // 默认是 value
  },
  props: {
    // 用来接收父组件传入的用户关注状态
    is_followed: {
      type: Boolean,
      required: true
    },
    // 用来接收父组件传入的用户 id
    aut_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false // 控制是否展示 loading 状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /*
    实现用户关注：
    思路：组件化 >>> 绑定事件 >>> 封装接口 >>> 调用接口(父传子参数) >>> 处理成功或失败的结果(子传父更新状态)
    优化 1: 自己不能关注自己
    优化 2: 给延迟操作增加 loading 交互
    优化 3: 使用 v-model 简化两次传值
    优化 4: 使用 v-model 配合 model 配置项修改绑定的属性名和事件名
    */

    // 处理关注和取消关注
    async onFollow() {
      // 请求前 >>> 打开 loading 状态
      this.loading = true
      try {
        if (this.is_followed) {
          // 已关注, 执行取消关注
          await delFollow(this.aut_id)
          this.$toast.success('取消关注!')
        } else {
          // 未关注, 执行关注
          await addFollow(this.aut_id)
          this.$toast.success('关注成功!')
        }
        // 通知父组件,修改用户的关注状态
        this.$emit('update_followed', !this.is_followed)
        // this.$emit('update_followed')
      } catch (err) {
        let message = '操作失败!'
        if (err && err.response.status === 400) {
          message = '不能关注自己!'
        }
        this.$toast.fail(message)
      }

      // 请求后 >>> 关闭 loading 状态
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
