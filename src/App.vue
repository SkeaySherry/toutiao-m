<template>
  <div id="app">
    <!-- 路由的出口 -->
    <router-view />
    <h1>头条</h1>
    <div>
      <i class="toutiao toutiao-dianzan2"></i>
      <van-button type="primary">主要按钮</van-button>
    </div>
    <div class="box"></div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
.box {
  width: 300px;
  height: 100px;
  background-color: pink;
}
</style>
