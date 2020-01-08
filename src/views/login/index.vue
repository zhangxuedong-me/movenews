<template>
  <div class="login">
    <van-nav-bar title="登录"/>
    <van-cell-group>
      <van-field
        v-model="userData.mobile"
        required
        clearable
        placeholder="请输入手机号"
        left-icon="contact"
      />
      <van-field v-model="userData.code"  type="password" placeholder="请输入验证码" required left-icon="goods-collect-o">
        <van-count-down @finish="isShow=false" format="ss" v-if="isShow" :time="10000 * 6" slot="button" />
        <van-button v-else slot="button" plain type="info" size="small" @click="sendCode">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="submit_btn">
      <van-button @click="submit" type="info">登录</van-button>
    </div>
  </div>
</template>

<script>
import {
  getUserInfo,
  getCodeInfo
} from '../../api/axios'
export default {
  name: 'login',
  data () {
    return {
      userData: {
        mobile: '',
        code: ''
      },
      isShow: false
    }
  },
  methods: {
    async submit () {
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '登录中...',
        forbidClick: true
      })
      try {
        let result = await getUserInfo(this.userData)
        console.log(result)
        // 但是如果这里还有提示信息的话，就可以避免一直加载问题
        setTimeout(() => {
          this.$toast.success('登录成功')
        }, 500)
      } catch (err) {
        setTimeout(() => {
          this.$toast.fail('登录失败')
        }, 500)
      }
    },

    // 发送验证码
    async sendCode () {
      let { mobile } = this.userData
      // 打开开始计时
      this.isShow = true
      try {
        // 请求获取短信验证码，将手机号传递过去
        let result = await getCodeInfo(mobile)
        console.log(result)
      } catch (err) {
        this.isShow = false
        if (err.response.status === 429) {
          this.$toast('请勿频繁发送')
          return
        }
        this.$toast('发送失败')
      }
    }
  },
  created () {
  }
}
</script>

<style scoped lang="less">
  @import url('../../styles/variables.less');
  .login {
    .van-nav-bar {
      background-color: @back-color;
    }
    .van-nav-bar__title {
      color: #fff;
    }
    .submit_btn {
      width: 348px;
      height: 38px;
      .van-button {
        width: 100%;
        margin: 26px 12px 0px 12px;
        background-color: #6db4fb;
        border: none;
        border-radius: 6px;
      }
    }
    .van-field__body {
      .van-button {
        border-radius: 20px;
      }
    }
  }
</style>
