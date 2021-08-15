<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />

    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
// console.log(updataUserPhoto)
export default {
  name: 'UpdatePhoto',
  components: {},
  props: {
    // 预览图片地址信息
    img: {
      type: [String, Object],
      required: true
    }
  },
  data() {
    return {
      cropper: null // 裁剪器对象
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 裁剪框不能超过画布的范围
      dragMode: 'move', // 不能拖拽裁剪区,只能移动画布
      aspectRatio: 1, // 裁剪区的长宽比
      autoCropArea: 1, // 让图片撑满整个画布
      cropBoxMovable: false, // 阻止移动裁剪区
      cropBoxResizable: false, // 阻止裁剪区的缩放
      background: false // 禁用背景
    })
  },
  methods: {
    // 确定事件
    onConfirm() {
      // 基于服务端的裁切使用 getData 方法获取裁切参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(blob => {
        console.log(blob) // 裁剪后的结果信息 Blob 对象
        this.onUpdatePhoto(blob)
      })
    },
    // 提交裁剪后的图片到服务器上
    async onUpdatePhoto(blob) {
      // 增加loading交互
      this.$toast.loading({
        message: '上传中...',
        forbidClick: true,
        duration: 0
      })
      try {
        // 如果接口要求的参数格式是: multipart/form-data, 那么我们必须把参数项装到一个 FormData 容器中
        const formData = new FormData()
        // 1. 装数据 append (数据项名字, 值)
        formData.append('photo', blob)
        // 2. 调用接口
        const { data } = await updateUserPhoto(formData)
        console.log(data)
        // 3. 关闭弹层
        this.$emit('close')
        // 4. 通知父组件更新头像数据
        this.$emit('update-photo', data.data.photo)
        // 5. 提示信息
        this.$toast.success('更新成功!')
      } catch (err) {
        console.log(err)
        this.$toast.fail('更新失败!')
      }
    }
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
.img {
  display: block;
  max-width: 100%;
}
</style>
