<template>
  <!-- 频道编辑弹层组件 -->
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <template #title>
        <div class="title-text">我的频道</div>
      </template>
      <template>
        <van-button
          class="edit-btn"
          type="danger"
          plain
          round
          size="mini"
          @click="isEdit = !isEdit"
          >{{ isEdit ? '完成' : '编辑' }}</van-button
        >
      </template>
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onChannelClick(channel, index)"
      >
        <template #text>
          <span class="text" :class="{ active: index == active }">{{
            channel.name
          }}</span>
        </template>
        <!-- 关闭图标 -->
        <!-- 当前频道项 id 不在 fixedChannels 数组中才显示关闭图标 -->
        <template #icon>
          <van-icon
            name="clear"
            v-show="isEdit && !fixedChannels.includes(channel.id)"
          />
        </template>
      </van-grid-item>
    </van-grid>
    <!-- /我的频道 -->
    <!-- 频道推荐 -->
    <van-cell :border="false">
      <template #title>
        <div class="title-text">频道推荐</div>
      </template>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="addChannel(channel)"
      />
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, delUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

// 测试是否引入成功
// console.log(getAllChannels)
// console.log(addUserChannels)
// console.log(delUserChannels)

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    // 我的频道 列表数据
    myChannels: {
      type: Array,
      required: true
    },
    // 接收父组件传过来的激活项索引
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道数据
      isEdit: false, // 是否在编辑状态
      fixedChannels: [0] // 固定频道 id , 不能删除
    }
  },
  computed: {
    // 计算属性: 根据已有的数据变量计算出想要的结果
    recommendChannels() {
      // 推荐频道 = 所有频道 - 我的频道
      // 思路: 遍历所有频道项,得到的没有过频道,先判断是否在我的频道数组中
      // 如果不在我的频道中,那么这个频道必然是属于推荐频道
      // const channels = []
      // // 当前频道是否出现在我的频道列表中
      // this.allChannels.forEach(item => {
      //   const flag = this.myChannels.some(val => val.id === item.id)
      //   // flag 为 false 表示没有出现在我的频道中, 就放到推荐频道中
      //   if (!flag) {
      //     channels.push(item)
      //   }
      // })
      // // !!!返回计算好的属性
      // return channels
      return this.allChannels.filter(
        item => this.myChannels.every(val => val.id !== item.id)
        // !this.myChannels.some(val => val.id === item.id)
      )
    },
    // 把 state 数据映射到组件的计算属性
    ...mapState(['user'])
  },
  watch: {},
  created() {
    // 调用请求方法 ,获取取数据
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    // 调用接口请求,获取所有频道数据
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取频道数据失败!')
      }
    },
    // 添加channel
    async addChannel(channel) {
      // 1. 把channel对象添加到 我的频道 数组当中
      this.myChannels.push(channel)

      // 2. 数据持久化存储
      // a. 判断登录状态
      console.log(this.user)

      if (this.user) {
        // 已登录 >>> 保存在线上服务器
        try {
          await addUserChannels({
            id: channel.id,
            seq: this.myChannels.length // 频道的序号,直接传数组的长度即可
          })
        } catch (err) {
          this.$toast('添加频道失败,请稍后再试')
        }
      } else {
        // 未登录 >>> 保存在本地存储中
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    // 点击 我的频道 项
    onChannelClick(channel, index) {
      // 测试事件传值
      console.log(channel, '----', index)

      // 判断当前是否在编辑状态
      if (this.isEdit) {
        // 处在编辑状态 >>> 删除频道
        // 1.如果是固定项的频道,那就不去执行下面操作
        if (this.fixedChannels.includes(channel.id)) {
          return
        }
        // 2.根据索引项删除频道
        this.myChannels.splice(index, 1)

        // 3. 判断一下当前删除项的频道是否在 高亮的频道前
        if (index <= this.active) {
          // 把 active 值减 1
          this.$emit('update-active', this.active - 1, true)
        }

        // 4. 把删除频道进行持久化
        this.deleteChannel(channel)
      } else {
        // 处在非编辑状态 >>> 切换频道 >>> 子传父技术传索引
        this.$emit('update-active', index, false)
      }
    },
    // 处理删除频道持久化的方法
    async deleteChannel(channel) {
      // 先判断用户的登录状态
      if (this.user) {
        // 已登录 >>> 把数据存到线上服务器
        try {
          await delUserChannels(channel.id)
        } catch (err) {
          this.$toast('删除频道失败,请稍后重试')
        }
      } else {
        // 未登录 >>> 把数据存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
