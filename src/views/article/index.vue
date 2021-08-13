<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- 关注用户组件 -->
          <!-- <follow-user
            :is_followed="article.is_followed"
            :aut_id="article.aut_id"
            @update_followed="article.is_followed = $event"
          ></follow-user> -->
          <!--不传参: @update_followed="!article.is_followed" -->

          <!-- 如果父组件传给子组件的值, 子组件也同步需要修改,这时候可以使用v-model 指令-->
          <!-- v-model指令相当于 :value 指令 和 @input 指令的集合 -->
          <!-- <follow-user
            :value="article.is_followed"
            :aut_id="article.aut_id"
            @input="article.is_followed = $event"
          ></follow-user> -->
          <!-- 因为 value， input 命名没有语义，所以要自定义修改 v-model 的数据名称-->
          <follow-user
            :aut_id="article.aut_id"
            v-model="article.is_followed"
          ></follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 评论列表 -->
        <comment-list></comment-list>
        <!-- /评论列表 -->
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button class="comment-btn" type="default" round size="small">
            写评论
          </van-button>
          <van-icon name="comment-o" info="123" color="#777" />
          <!-- 收藏 -->
          <collect-article
            v-model="article.is_collected"
            :art_id="article.art_id"
          />
          <!-- 点赞 -->
          <like-article v-model="article.attitude" :art_id="article.art_id" />
          <!-- 转发 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
      </div>
      <!-- /加载完成-文章详情 -->
      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->
      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'

// ImagePreview({
//   // 预览的图片数组
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   // 起始位置 从 0 开始
//   startPosition: 1,
//   onClose() {
//     console.log('关闭')
//   }
// })

export default {
  name: 'ArticleIndex',
  components: { FollowUser, CollectArticle, LikeArticle, CommentList },
  props: {
    // 使用props解耦获得了的动态路由数据，这样我们就可以使用this.articleId 获取动态路由数据 而不需要使用 this.$route.params.articleId
    // 解耦的好处: 文章组件可以独立使用,不需要依路由进行访问使用
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章详情对象
      loading: true, // 控制文章的加载状态,默认是true
      errStatus: 0 // 错误的状态码
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    // 获取文章详情
    async loadArticle() {
      // 处理加载中状态
      // (1) 如果是加载中, 显示 loading
      // (2) 如果文章加载完成, 显示 文章详情
      // (3) 如果文章加载失败
      //    a. 找不到这个文章 404 状态 >>> 显示该资源不存在
      //    b. 其他原因 >>> 显示加载失败,请重试
      try {
        // 模拟获取数据失败的场景
        // if (Math.random() > 0.5) {
        //   JSON.parse('dfjhfjdsfhjsdf')
        // }

        const { data } = await getArticleById(this.articleId)
        console.log(data)
        this.article = data.data

        // 关闭加载中状态
        this.loading = false

        // 已经获取到了文章数据了 处理图片的预览效果

        // console.log(this.$refs['article-content']) // undefined
        // 如何去获取异步更新后的DOM内容? ==> (1) this.$nextTick() (2) setTimeout() 模拟

        this.$nextTick(() => {
          // console.log(this.$refs['article-content'])
          this.previewImage()
        })

        // setTimeout(()=>{
        //   console.log(this.$refs['article-content'])
        // })
      } catch (err) {
        console.log('获取失败', err)
        // 404 问题 :
        // JSON.parse() 在转换带有大数字的 json 字符串时, 会丢失一部分精度, 导致最后的 id 不准确
        // 解决: 使用第三方包 json-bigint 提供的 JSONBig.parse() 方法来处理, 大整数数字会被处理成对象
        console.log(err.response)

        // 更新状态码
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        // 关闭加载中状态
        this.loading = false
      }
    },
    // 实现图片预览 :
    previewImage() {
      // (1) 获取到所有的图片
      const imgs = this.$refs['article-content'].querySelectorAll('img')
      console.log(imgs)
      // (2) 把所有图片的地址存放到一个数组中
      const images = []
      imgs.forEach((item, index) => {
        images.push(item.src)
        // (3) 给图片绑定点击事件
        item.onclick = () => {
          // (4) 调用预览函数进行预览
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
@import './github-markdown.css';

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
