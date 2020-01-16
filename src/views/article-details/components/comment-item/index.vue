<template>
  <div class="comment-item-container">
      <van-cell style="border-bottom: #f7f5f5 1px solid;">
          <van-image
                round
                width="40"
                height="40"
                :src="comment.aut_photo"
                slot="icon"
          />
          <span class="comment-title" slot="title">
              {{ comment.aut_name }}
          </span>
          <template slot="label">
              <div class="comment-item-top">{{ comment.content }}</div>
              <div class="comment-item-bottom">
                  <span>{{ comment.pubdate | relativeTime }}</span>
                  <van-button
                    class="reply"
                    type="default"
                    @click="$emit('helpClick', comment)"
                    v-if="isHelpShow"
                  >
                    回复{{ comment.reply_count }}
                  </van-button>
              </div>
          </template>
          <template slot="right-icon">
              <van-icon
                @click="clickHelp(comment)"
                class="help"
                :name="comment.is_liking ? 'good-job' : 'good-job-o'"
                :color="comment.is_liking ? 'red' : '#000'"
              >
              </van-icon>
              <span
                class="count"
              >
              {{ comment.like_count === 0 ? '赞' : comment.like_count}}
              </span>
          </template>
      </van-cell>
  </div>
</template>

<script>
import { commentClickHelp, cacelCommentHelp } from '@/api/axios/comment.js'
export default {
  name: 'comment-item',
  props: {
    comment: {
      type: Object,
      required: true
    },
    isHelpShow: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 取消对评论点赞或者对评论点赞
    async clickHelp (obj) {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '请稍后...',
        forbidClick: true
      })
      try {
        if (this.comment.is_liking) {
          await cacelCommentHelp(obj.com_id.toString())
          this.comment.is_liking = false
          obj.like_count--
          this.$toast.success('取消点赞')
        } else {
          await commentClickHelp(obj.com_id.toString())
          this.comment.is_liking = true
          obj.like_count++
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  },
  created () {
  }
}
</script>

<style lang="less" scoped>
    .comment-item-container {
        .comment-title {
            margin-left: 10px;
            color: blue;
        }
        .comment-item-top {
            margin-left: 10px;
            margin: 10px 10px;
            color: #000;
        }
        .comment-item-bottom {
            margin-left: 10px;
            .reply {
                width: 60px;
                height: 20px;
                line-height: 20px;
                font-size: 14px;
                padding: 0;
                margin: 0;
                margin-left: 6px;
            }
        }
        .help {
            margin-top: 10px;
        }
        .count {
            margin-top: 4px;
            margin-left: 10px;
        }
        ::v-deep .van-popup__close-icon {
            font-size: 22px;
            color: blue;
        }
    }
</style>
