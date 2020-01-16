<template>
    <div class="article-detaish-container">
         <van-nav-bar
            title="文章详情"
            left-arrow
            @click-left="leftBtn"
            class="nav-article"
            :fixed="true"
        >
            <van-icon slot="lest" name="arrow-left"></van-icon>
        </van-nav-bar>
        <!-- 加载中 -->
        <!-- 加载内容的时候显示 -->
         <van-loading
            class="loading"
            color="#1989fa"
            vertical
            v-if="pageState"
            >
            <slot>加载中...</slot>
        </van-loading>
      <!-- 头部使用导航栏组件 -->
        <!-- 内容部分 -->
        <!-- 内容部分当获取到数据就让内容显示 -->
        <div v-else-if="articleDetaish.title" class="article-item">
            <van-row>
                <div class="article-title">{{ articleDetaish.title }}</div>
                <van-row type="flex">
                    <van-row class="article-use" type="flex" align="center">
                        <van-image
                            width="36"
                            height="36"
                            :src="articleDetaish.aut_photo"
                            round
                        />
                        <div class="article-introd">
                            <span>{{ articleDetaish.aut_name }}</span>
                            <div>{{ articleDetaish.pubdate | relativeTime }}</div>
                        </div>
                    </van-row>
                    <div class="article-right">
                        <van-button
                            class="follow"
                            round
                            @click="followClick"
                            loading-type="spinner"
                            :loading="loadState"
                            :type="articleDetaish.is_followed ? 'default' : 'info'"
                            v-if="$store.state.user && !($store.state.user.userId == articleDetaish.aut_id)"
                        >
                            <van-icon name="plus"></van-icon>
                                &nbsp;&nbsp;
                            <span>
                                {{ articleDetaish.is_followed ? '已关注' : '关注' }}
                            </span>

                        </van-button>
                        <van-button
                            class="follow"
                            round
                            type="info"
                            v-if="!$store.state.user"
                            to="/login"
                        >
                            去登陆
                        </van-button>
                    </div>
                </van-row>
            </van-row>
            <div v-html="articleDetaish.content" class="article-bottom">
            </div>

            <van-divider>正文结束</van-divider>
        </div>
        <!-- 加载失败的提示 -->
        <!-- 否则就是加载失败的提示 -->
         <div class="error" v-else>
            <img src="./no-network.png" alt="no-network">
            <p class="text">亲，网络不给力哦~</p>
            <van-button
                class="btn"
                type="default"
                size="small"
            >点击重试</van-button>
        </div>
        <!-- 底部区域 -->
        <div class="footer">
            <van-button round @click="isCommentShow=true">写评论</van-button>
            <van-icon
                class="comment-icon"
                name="comment-o"
                :info="commentCount"
                @click="fast"
            />
            <van-icon
                color="orange"
                :name="articleDetaish.is_collected ? 'star' : 'star-o'"
                @click="collectArticle"
            />
            <van-icon
                color="#e5645f"
                :name="articleDetaish.attitude === 1 ? 'good-job' : 'good-job-o'"
                @click="articleHelp"
            />
            <van-icon class="share-icon" name="share" />
        </div>
        <!-- 评论区域 -->
        <div class="comment">
            <van-cell title="全部评论"></van-cell>
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                >
                <!-- 封装展示评论内容的组件 -->
                <comment-item
                  v-for="(item, index) in list"
                  :key="index"
                  :comment="item"
                  @helpClick="helpClick"
                  :isHelpShow="true"
                />
            </van-list>
        </div>

        <!-- 发表评论区域 -->
        <van-popup
          v-model="isCommentShow"
          position="bottom"
          :style="{ height: '30%' }"
        >
          <!-- 发表评论的组件 -->
          <publish-comment
            @publish-comment="publishComment"
            v-model="postMessage"
            @close="isCommentShow = false"
            :navbar="true"
          />
        </van-popup>
         <van-popup
          v-model="isReplyComment"
          position="bottom"
          :style="{ height: '80%' }"
          closeable
          close-icon-position="top-left"
        >
        <!-- 评论回复的组件 -->
        <!--
           因为弹出框是懒加载的，打开弹框的时候才渲染页面
           之后渲染一次，因为是懒加载的，所有再次打开关闭的话，
           只是让他显示或者隐藏，所有我们需要手动清除每一次打开
           或者关闭的回复组件
         -->
        <comment-reply
          :articleId="articleId"
          v-if="isReplyComment"
          :comment="comment"
        />
      </van-popup>

      <!-- 点击评论图标弹出评论管理 -->
      <van-popup
        v-model="isFastComment"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          >
            <fast-comment
              v-for="(item, index) in list"
              :key="index"
              :comment="item"
              @startHelp="startHelp"
            />
        </van-list>

      </van-popup>
     </div>
</template>

<script>
import commentItem from './components/comment-item'
import publishComment from './components/publish-comment'
import commentReply from './components/comment-reply'
import fastComment from './components/fast-comment'
import {
  getArticlesDatails,
  collectArticle,
  cancelCollect,
  articleHelp,
  articleCancel
} from '@/api/axios/articles.js'
import { followUser, cancelFollowUser } from '@/api/axios/user.js'
import { getCommentData, publishComments } from '@/api/axios/comment.js'
export default {
  name: 'article-details',
  props: {
    articleId: {
      type: [String, Object, Number, Boolean],
      required: true
    }
  },
  data () {
    return {
      // 接收文章详情的数据
      articleDetaish: {},
      // 按钮的加载状态
      loadState: false,
      pageState: false,
      list: [],
      loading: false,
      finished: false,
      offsetPage: null,
      commentCount: 0,
      // 发表评论的弹框状态
      isCommentShow: false,
      // 评论回复弹框状态
      isReplyComment: false,
      // 获取需要回复的评论对象
      comment: null,
      postMessage: '',
      // 快捷评论弹出模式状态
      isFastComment: false
    }
  },
  methods: {
    // 获取文章详情
    async getArticleDetaish () {
      const { data } = await getArticlesDatails(this.articleId)
      this.articleDetaish = data.data
    },
    // 点击导航左边按钮
    leftBtn () {
      this.$router.back()
    },
    // 设置收藏文章或者取消收藏文章
    async collectArticle () {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '请稍后...',
        forbidClick: true
      })
      // is_collected次状态为true表示是收藏的文章，为false是没有收藏的文章
      // 如果is_collected为true说明此时是收藏文章状态，那么就发送取消收藏的状态
      // 反之一样
      try {
        if (this.articleDetaish.is_collected) {
          await cancelCollect(this.articleId)
          this.articleDetaish.is_collected = false
          this.$toast.success('取消收藏')
        } else {
          await collectArticle(this.articleId)
          this.articleDetaish.is_collected = true
          this.$toast.success('收藏成功')
        }
      } catch (err) {
        this.$toast.fail('收藏失败')
      }
    },
    // 对文章点赞和取消对象文章点赞
    async articleHelp () {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '请稍后...',
        forbidClick: true
      })
      try {
        // attitude如果等于1说明是收藏的状态，需要发送取消收藏的状态
        // 反之一样
        if (this.articleDetaish.attitude === 1) {
          await articleCancel(this.articleId)
          this.articleDetaish.attitude = 0
          this.$toast.success('取消点赞')
        } else {
          await articleHelp(this.articleId)
          this.articleDetaish.attitude = 1
          this.$toast.success('点赞成功')
        }
      } catch (err) {
        this.$toast('点赞失败')
      }
    },
    // 设置关注用户和取消关注用户
    async followClick () {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '请稍后...',
        forbidClick: true
      })
      try {
        if (this.articleDetaish.is_followed) {
          await cancelFollowUser(this.articleDetaish.aut_id)
          this.articleDetaish.is_followed = false
          this.$toast.success('取消关注')
        } else {
          await followUser(this.articleDetaish.aut_id)
          this.articleDetaish.is_followed = true
          this.$toast.success('关注成功')
        }
        // 点击之后开始加重
        this.loadState = true
        // 数据获取完毕之后结束加载
        setTimeout(() => {
          this.loadState = false
        }, 300)
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    },
    // 列表请求加载数据
    async onLoad () {
      // 发送请求获取评论数据
      const { data } = await getCommentData({
        type: 'a',
        source: this.articleId,
        offset: this.offsetPage,
        limit: 10
      })
      // 判断如果本地的comment属性有值的话或者为0的话，就是要本地存储的数据
      // 否则就使用获取到的数据
      if (this.$store.state.comment || this.$store.state.comment === 0) {
        this.commentCount = this.$store.state.comment
      } else {
        this.commentCount = data.data.total_count
      }
      // 将获取到的数据添加到数组中
      this.list.push(...data.data.results)
      // 取消加载状态
      this.loading = false
      // 判断是否还有数据，如果有数据继续请求数据，否则取消请求
      if (data.data.results.length) {
        this.offsetPage = data.data.last_id
      } else {
        this.finished = true
      }
    },
    // 发表评论
    async publishComment () {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '发表中...',
        forbidClick: true
      })
      if (!this.postMessage) {
        this.$toast.fail('内容不能为空')
        return
      }
      try {
        const { data } = await publishComments({
          target: this.articleId,
          content: this.postMessage
        })
        this.list.unshift(data.data.new_obj)
        this.$toast.success('发表成功')
        this.isCommentShow = false
        // 发表成功之后将评论的总数量也加加
        this.commentCount++
        // 发表成功之后将内容情况
        this.postMessage = ''
      } catch (err) {
        this.$toast.$fail('发表失败')
        this.isCommentShow = false
        this.postMessage = ''
      }
    },
    helpClick (obj) {
      this.isReplyComment = true
      this.comment = obj
    },
    // 快捷回复
    startHelp (comment) {
      this.isReplyComment = true
      this.comment = comment
    },
    // 快捷菜单按钮
    fast () {
      // 将回复评论的弹框显示出来
      this.isFastComment = true
      // 每次点击评论信息图片查看评论之后应该将评论信息清空
      this.commentCount = 0
    }
  },
  created () {
    this.getArticleDetaish()
  },
  components: {
    commentItem,
    publishComment,
    commentReply,
    fastComment
  },
  watch: {
    commentCount () {
      // 将变化后的评论信息数量重新存入到浏览器本地中
      this.$store.commit('setCommentCount', this.commentCount)
    }
  }
}
</script>

<style lang="less" scoped>
    @import url('../../styles/variables.less');
    .article-detaish-container {
        background: #fff;
        overflow: hidden;
        .van-nav-bar {
            background-color: @back-color;
            .van-icon {
                color: #fff;
            }
            .van-nav-bar__title {
                color: #fff;
            }
        }
        .article-item {
            .article-title {
                font-size: 16px;
                font-weight: 700;
                padding-bottom: 26px;
                padding-top: 50px;
            }
            padding: 20px;

            .article-use {
                .article-introd {
                    padding-top: 6px;
                    padding-left: 10px;
                    font-size: 12px;
                    div:nth-child(2) {
                        padding-top: 2px;
                        color: #999;
                    }
                }

            }
            .article-right {
                margin-left: 100px;
                .follow {
                    width: 100px;
                    height: 30px;
                    line-height: 30px;
                }
                .follow-color {
                    background-color: #57c1f3;
                    color: #fff;
                }
            }
            .article-bottom {
                font-size: 18px;
                margin-top: 10px;
            }
            .article-text {
                p:nth-child(1) {
                    font-size: 18px;
                    font-weight: 700;
                }
                p:nth-child(2) {
                    font-size: 15px;
                    height: 226px;
                    line-height: 26px;
                }
            }
            .van-divider {
                margin-top: 60px;
            }
        }
        .van-icon {
            color: #fff;
        }
        .footer {
            width: 100%;
            height: 40px;
            position: fixed;
            bottom: 0;
            right: 0;
            left: 0;
            border-top: #ccc solid 1px;
            display: flex;
            align-items: center;
            z-index: 1000;
            background: #fff;
            button {
                width: 150px;
                height: 30px;
                line-height: 30px;
                border: none;
                margin-left: 10px;
            }
            i {
                margin-left: 26px;
                color: #666;
            }
        }
        .error {
            padding-top: 100px;
            text-align: center;
            .text {
            font-size: 15px;
            }
            .btn {
            width: 30%;
            }
        }
        .loading {
            padding-top: 100px;
            text-align: center;
        }
        .van-list {
            padding-top: 50px;
        }
    }
</style>
