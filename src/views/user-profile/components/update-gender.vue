<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      title="选择性别"
      :default-index="value"
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    // 接受从父组件传来的 gender 值 (0, 1)
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 可选的列表项
      columns: ['男', '女'],
      localGender: null // 当前性别
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 确定事件
    async onConfirm(value, index) {
      // 增加loading交互
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0
      })

      try {
        // 1. 调用接口
        await updateUserProfile({
          gender: index
        })
        // 2. 关闭弹层
        this.$emit('close')
        // 3. 修改父组件中的gender值
        this.$emit('input', index)
        // 4. 提示信息
        this.$toast.success('更新成功!')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
