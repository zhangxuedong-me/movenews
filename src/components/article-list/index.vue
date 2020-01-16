<template>
  <div>
    <!-- 下拉刷新和频道列表的组件 -->
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <recommend :list="list"/>
          </van-list>
        </van-pull-refresh>
  </div>
</template>

<script>
import recommend from '@/components/recommend'
import { getArticlesList } from '@/api/axios/articles.js'
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [],
      // 加载状态
      loading: false,
      // 是否全部数据加载完成加载完成，加载完成不会触发load事件
      finished: false,
      // 加载刷新列表
      isLoading: false,
      // 下一页的时间搓
      timestamp: null
    }
  },
  methods: {
    // 加载刷新更多
    async onLoad () {
      // 请求文章列表数据
      const { data } = await getArticlesList({
        channel_id: this.channel.id,
        // 请求新的数据用当前时间戳，获取历史时间戳，用本次获取到的pre_timestamp
        // 得时间搓来获取下一页数据
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      // 将获取到的数据push到定义的数组中
      const result = data.data.results
      this.list.push(...result)
      // 加载完毕后将加载状态数组为false
      this.loading = false
      // 判断有没有数据有的话，将当前页的时间戳赋值过来，继续去求情页面
      // 否则就将finished设置为true结束请求
      if (result.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh () {
      // 发送请求获取最新的文章数据
      const { data } = await getArticlesList({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 拿到数据添加到数据数组中的最前面
      const articles = data.data.results
      this.list.unshift(...articles)
      // 停止转圈圈
      this.isLoading = false
      // 提示用户获取到多少条数据
      const message = articles.length
        ? `更新了${articles.length}条数据`
        : '没有更多数据了'
      this.$toast(message)
    }
  },
  created () {
  },
  components: {
    recommend
  }
}
</script>

<style>

</style>
