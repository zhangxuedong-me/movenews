<template>
  <div class="comment-reply-container">
      <van-nav-bar
        :title="count + '条回复'"
      >
      </van-nav-bar>
     <comment-item :isHelpShow="false" :comment="comment" />
     <van-cell title="全部回复" :border="false" />
     <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <comment-item
            :isHelpShow="false"
            v-for="(item, index) in list"
            :key="index"
            :comment="item"
        />
    </van-list>
    <van-button class="help" @click="isHelpShow = true">点击回复</van-button>
    <van-popup
      v-model="isHelpShow"
      position="bottom"
      :style="{ height: '30%' }"
    >
      <van-nav-bar
        title="标题"
        left-text="取消"
        right-text="确定"
        @click-left="isHelpShow = false"
        @click-right="helpComment"
      />
      <publish-comment
        v-model="postMessage"
        :navbar="false" />
    </van-popup>
  </div>
</template>

<script>
import commentItem from '../comment-item'
import { getCommentData, publishComments } from '@/api/axios/comment.js'
import publishComment from '../publish-comment'
export default {
  name: 'comment-reply',
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Object, String, Number],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offsetPage: null,
      isHelpShow: false,
      // 获取到回复的内容
      postMessage: '',
      count: 0
    }
  },
  methods: {
    // 获取评论回复的数据
    async onLoad () {
      // 获取评论回复的数据
      const { data } = await getCommentData({
        type: 'c',
        source: this.comment.com_id.toString(),
        offset: this.offsetPage,
        limit: 10
      })
      this.count = data.data.total_count
      // 将数据添加到数组中
      this.list.push(...data.data.results)
      // 取消加载状态
      this.loading = false
      // 判断是否还有数据，有的话继续加载否则停止加载
      if (data.data.results.length) {
        this.offsetPage = data.data.last_id
      } else {
        this.finished = true
      }
    },
    // 回复评论
    async helpComment () {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '回复中...',
        forbidClick: true
      })
      if (!this.postMessage) {
        this.$toast.fail('内容不能为空')
        return
      }
      try {
        const { data } = await publishComments({
          target: this.comment.com_id.toString(),
          content: this.postMessage,
          art_id: this.articleId
        })
        // 发表后的回复后端会返回来，添加到数组的最前面
        this.list.unshift(data.data.new_obj)
        // 将弹框隐藏
        this.isHelpShow = false
        this.$toast.success('回复成功')
        this.comment.reply_count++
        // 发布成功之后将文本框的内容情况
        this.postMessage = ''
      } catch (err) {
        this.$toast.fail('回复失败')
        this.postMessage = ''
      }
    }
  },
  created () {
  },
  components: {
    commentItem,
    publishComment
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
    .comment-reply-container {
      .help {
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
</style>
