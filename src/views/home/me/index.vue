<template>
    <div class="me-container">
      <!-- 登录界面 -->
      <div class="login-item" v-if="$store.state.user">
        <div class="already-login">
          <div class="already-login-top">
            <van-image
              width="66"
              height="66"
              :src="meInfo.photo"
              round
            />
            <div class="already-login-top-item">{{ meInfo.name }}</div>
            <span class="edit-data" @click="$router.push('/edit')">编辑资料</span>
          </div>
          <van-grid class="data-info" :border="false">
            <van-grid-item>
              <span class="info-number">{{ meInfo.art_count }}</span>
              <span class="info-item">头条</span>
            </van-grid-item>
            <van-grid-item>
              <span class="info-number">{{ meInfo.follow_count }}</span>
              <span class="info-item">关注</span>
            </van-grid-item>
            <van-grid-item>
              <span class="info-number">{{ meInfo.fans_count }}</span>
              <span class="info-item">粉丝</span>
            </van-grid-item>
            <van-grid-item>
              <span class="info-number">{{ meInfo.like_count }}</span>
              <span class="info-item">获赞</span>
            </van-grid-item>
          </van-grid>
        </div>
      </div>
      <!-- 未登录页面 -->
      <div class="not-login" v-else @click="$router.push('/login')">
        <div class="mobile"></div>
        <div class="text">点击登录</div>
      </div>
      <!-- 其他 -->
      <van-grid clickable :column-num="3">
        <van-grid-item to="/home/me/cellect" text="我的收藏">
          <van-icon slot="icon" name="star-o" color="#eb5253" />
        </van-grid-item>
        <van-grid-item text="浏览历史">
          <van-icon slot="icon" name="browsing-history-o" color="#ffa023" />
        </van-grid-item>
        <van-grid-item text="作品">
          <van-icon slot="icon" name="edit" color="#678eff" />
        </van-grid-item>
      </van-grid>
      <van-cell-group class="table-info">
        <van-cell title="消息通知" is-link />
        <van-cell title="小智同学" is-link />
      </van-cell-group>
      <van-button
        v-if="$store.state.user"
        block type="default"
        @click="quitLogin"
      >
        退出登录
      </van-button>
    </div>
</template>

<script>
import { getMeInfo } from '@/api/axios/user.js'
export default {
  data () {
    return {
      meInfo: {}
    }
  },
  methods: {
    // 获取用户的自己的信息
    async getMeInfo () {
      try {
        const result = await getMeInfo()
        this.meInfo = result.data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    // 退出登录
    async quitLogin () {
      try {
        await this.$dialog.confirm({
          title: '退出登录',
          message: '您确定要退出登录吗'
        })
        this.$toast('退出成功')
        // 退出的话，直接给共享的函数的参数传为null，本地存储的就是null了
        // 跟直接清空一样
        this.$store.commit('setUserToken', null)
      } catch (err) {
        this.$toast('已取消')
      }
    }
  },
  created () {
    // 判断一下如果用户登录了再去获取数据
    if (this.$store.state.user) {
      this.getMeInfo()
    }
  }
}
</script>

<style lang="less" scoped>
  .me-container {
    // 已经登录页面样式
    .already-login {
      width: 100%;
      height: 190px;
      background: url('banner.png') no-repeat;
      .already-login-top {
        display: flex;
        align-items: center;
        padding: 36px 0 0 20px;
        .already-login-top-item {
          font-size: 16px;
          color: #fff;
          padding-left: 20px;
        }
        .edit-data {
          font-size: 14px;
          background: #fff;
          border-radius: 10px;
          margin-left: 110px;
          padding: 0 5px;
        }
      }
      .data-info {
        padding: 0 10px;
        ::v-deep .van-grid-item__content {
          background: none;
        }
        .info-number {
          color: #fff;
          font-size: 14px;
        }
        .info-item {
          color: #fff;
          font-size: 14px;
        }
      }
    }
    .table-info {
      margin: 10px 0;
    }
    // 未登录页面的样式
    .not-login {
      width: 100%;
      height: 190px;
      background: url('banner.png') no-repeat;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .mobile {
        background: url("./mobile.png") no-repeat;
        background-size: cover;
        width: 66px;
        height: 66px;
        margin-bottom: 10px;
      }
      .text {
        font-size: 14px;
        color: #fff;
      }
    }
    > .van-cell-group {
      margin-top: 10px;
    }
  }
</style>
