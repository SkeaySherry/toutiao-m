<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
// console.log(updateUserProfile)
export default {
  name: 'UpdateName',
  components: {},
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 不能直接把 props 中的数据直接帮到v-model指令上, 回修改props数据
      message: this.value
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 更新用户昵称
    async onConfirm() {
      // (1) 判断非空
      if (this.message.length === 0) {
        return this.$toast('内容不能为空!')
      }
      // 增加loading交互
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // (2) 调用接口
        await updateUserProfile({
          name: this.message
        })
        // (3) 关闭弹层
        this.$emit('close')
        // (4) 更新用户昵称
        this.$emit('input', this.message)
        // (5) 提示用户信息
        this.$toast.success('更新成功!')
      } catch (err) {
        this.$toast.fail('更新失败!')
      }
    }
  }
}
</script>

<style scoped lang="less">
.field-wrap {
  padding: 20px;
}
</style>
