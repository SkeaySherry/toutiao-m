<template>
  <!-- 文章列表项 -->
  <!--
    Cell 单元格的 to 属性和 VueRouter 中的 RouterLink 导航组件的 to 属性用法是一样的
    用法参考链接：https://router.vuejs.org/zh/api/#to
    :to="'/article/' + article.art_id"
    :to="`/article/${article.art_id}`"
    :to="{ name:'路径名称', params:{ 标识符:数据 } }"
-->
  <van-cell
    class="article-item"
    :to="{ name: 'article', params: { articleId: article.art_id } }"
  >
    <!-- 标题 -->
    <template #title>
      <div class="title van-multi-ellipsis--l2">{{ article.title }}</div>
    </template>
    <!-- 标题下的内容 -->
    <template #label>
      <!-- 判断显示三张封面图 -->
      <div v-if="article.cover.type == 3" class="cover-wrap">
        <div
          v-for="(img, index) in article.cover.images"
          :key="index"
          class="cover-item"
        >
          <van-image class="cover-item-img" fit="cover" :src="img" />
        </div>
      </div>
      <!-- 文章标注信息 -->
      <div class="label-info-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <!-- 使用过滤器处理时间 -->
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </template>
    <!-- 右边图片 -->
    <template #default v-if="article.cover.type == 1">
      <van-image
        class="right-cover"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </template>
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  components: {},
  props: {
    // 接受父组件传过来的当前文章对象
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="less" scoped>
.article-item {
  // 文章项的标题
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__title {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  // 右边图片样式
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  // 最右边图片大小
  .right-cover {
    width: 100%;
    height: 146px;
  }
  // 文章标注样式
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  // 三张封面图样式
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-img {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
