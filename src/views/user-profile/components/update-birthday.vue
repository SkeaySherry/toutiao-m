<template>
  <div class="update-birthday">
    <!--
      currentDate 双向绑定了日期选择器
        设置日期选择器的默认值
        同步日期选择器选择的日期
      min-date: 可选的最小日期
      max-date: 可选的最大日期
     -->
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateGender',
  components: {},
  props: {
    // 接受父组件传入的日期
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1900, 0, 1), // 最小支持选择的日期
      maxDate: new Date(), // 最大支持选择的日期(当前日期)
      currentDate: new Date(this.value) // 初始日期
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 确定事件
    async onConfirm(val) {
      try {
        // 1. 调用接口
        await updateUserProfile({
          birthday: dayjs(val).format('YYYY-MM-DD')
        })
        // 2. 关闭弹层
        this.$emit('close')
        // 3. 通知父组件修改 生日日期
        this.$emit('input', dayjs(val).format('YYYY-MM-DD'))
        // 4. 提示信息
        this.$toast.success('更新成功！')
      } catch (err) {
        this.$toast.fail('更新失败！')
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
