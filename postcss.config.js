module.exports = {
  plugins: {
    // 配置使用 autoprefixer 插件
    // 作用：生成浏览器 CSS 样式规则前缀
    // VueCLI 内部已经配置了 autoprefixer 插件
    // 所以又配置了一次，所以产生冲突了
    // 'autoprefixer': { // autoprefixer 插件的配置
    //   // 配置要兼容到的环境信息
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 配置使用 postcss-pxtorem 插件
    // 作用：把 px 转为 rem

    // postcss-pxtorem 插件的版本需要 >= 5.0.0
    'postcss-pxtorem': {
      rootValue({ file }) {
        // 如果是vant的就按照375 尺寸， 如果是其他的就是按照750
        return file.indexOf('vant') !== -1 ? 37.5 : 75 // rootValue 的值一般是 设计稿  1/10
      },
      propList: ['*']
    }
  }
}
