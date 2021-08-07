<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <template #left>
        <!-- 后退上一页：$router.back() / $router.go(-1) -->
        <van-icon name="cross" @click="$router.back()" />
      </template>
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        v-model="user.mobile"
        type="number"
        name="mobile"
        placeholder="请输入手机号"
        clearable
        maxlength="11"
        :rules="userFormRules.mobile"
      >
        <!-- 增加图标 -->
        <template #left-icon>
          <i class="toutiao toutiao-shouji"></i>
        </template>
      </van-field>

      <van-field
        v-model="user.code"
        type="number"
        name="code"
        maxlength="6"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
      >
        <!-- 增加图标 -->
        <template #left-icon>
          <i class="toutiao toutiao-yanzhengma"></i>
        </template>
        <!-- 增加发送验证码按钮 -->
        <template #button>
          <!-- time: 倒计时时间
          format: 自定义格式
          finish事件：倒计时结束时触发-->
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />

          <van-button
            round
            class="send-sms-btn"
            size="small"
            type="default"
            native-type="button"
            @click="onSendSms"
            v-else
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <!-- 其实van-button按钮如果包裹在van-form里面默认类型就是native-type, 这里不加也行 -->
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data() {
    return {
      user: {
        mobile: '',
        code: ''
      },
      // 验证规则对象
      userFormRules: {
        mobile: [
          {
            required: true,
            message: '手机号不能为空'
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: '手机号格式错误'
          }
        ],
        code: [
          {
            required: true,
            message: '验证码不能为空'
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式错误'
          }
        ]
      },
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      // 1. 获取表单数据
      const user = this.user
      // 2. 表单验证

      // 请求前，开始转圈圈 增加等待框
      // 在组件中必须通过 this.$toast 来调用 Toast 组件
      this.$toast.loading({
        message: '登录中...', // 提示消息
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间, 默认是 2000 , 如果为 0 则持续展示
      })
      // 3. 提交表单请求登录 先去 api 中封装接口文档
      try {
        const res = await login(user)
        // console.log('登录成功', res)
        // 提示 success 或者 fail 的时候，会把其他的 toast 先清除
        this.$toast.success('登录成功') // 成功框

        // 存储 token 到 store 对象中
        this.$store.commit('setUser', res.data.data)

        // 登录成功跳转上一页  后面优化会讲
        this.$router.back()
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // console.log('手机号或验证码错误')
          this.$toast.fail('手机号或验证码错误') // 失败框
        } else {
          // console.log('登录失败,请稍后再试', err)
          this.$toast.fail('登录失败,请稍后再试') // 失败框
        }
      }
      // 4. 根据请求响应结果处理后续操作
    },

    async onSendSms() {
      // 1. 校验手机号 (不验证其他的) => 给按钮添加 native-type = 'button' 属性
      try {
        await this.$refs.loginForm.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true

      // 3. 请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #ededed;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
