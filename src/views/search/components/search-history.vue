<template>
  <!-- 搜索历史 -->
  <div class="search-history">
    <van-cell title="搜索历史">
      <div v-if="isDel">
        <!-- searchHistories 是引用数据,不能直接重新赋值,子传父,在父组件里处理 -->
        <span @click="$emit('clear')">全部删除</span>&nbsp;&nbsp;
        <span @click="isDel = false">完成</span>
      </div>
      <van-icon name="delete-o" v-else @click="isDel = true" />
    </van-cell>
    <van-cell
      :title="item"
      v-for="(item, index) in searchHistories"
      :key="index"
      @click="searchItemClick(item, index)"
    >
      <van-icon name="close" v-show="isDel" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  components: {},
  props: {
    // 搜索历史
    searchHistories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isDel: false // 控制删除状态
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 点击历史记录项时处理方法
    searchItemClick(item, index) {
      if (this.isDel) {
        // 删除状态,执行删除逻辑
        // 如果 props 的值是一个引用数据类型, 那么只要不对它重新赋值, 实际上地址值没有改变, 不会影响
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态, 执行搜索逻辑
        this.$emit('search', item)
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
