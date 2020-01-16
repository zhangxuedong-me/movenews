<template>
  <div class="login">
    <van-nav-bar title="登录"/>
    <!--
      ValidationObserver：把需要效验的整个表单包起来
      ValidationProvider：把需要效验的具体的表单元素包裹起来
      name：匹配验证字段的名称
      rules：验证的规则
      v-slot="{errors}"：获取错误信息，负责在模板中使用

      多个验证规则使用|管道分割开来

      :bails="false"：加上该属性可以 理解触发验证规则中的message信息
     -->
    <van-cell-group>
      <ValidationObserver ref="form">
        <ValidationProvider
          name="手机号"
          rules="required|mobile"
          v-slot="{errors}"
          :bails="false"
        >
          <van-field
            v-model="userData.mobile"
            required
            clearable
            placeholder="请输入手机号"
            left-icon="contact"
          />
        </ValidationProvider>
        <ValidationProvider
          name="验证码"
          rules="required|code"
          v-slot="{errors}"
        >
          <van-field
            v-model="userData.code"
            type="password"
            placeholder="请输入验证码"
            required left-icon="goods-collect-o"
          >
            <van-count-down
              @finish="isShow=false"
              format="ss"
              v-if="isShow"
              :time="10000 * 6"
              slot="button"
            />
            <van-button
              v-else slot="button"
              type="primary"
              size="small"
              @click="sendCode"
            >
              发送验证码
            </van-button>
          </van-field>
        </ValidationProvider>
      </ValidationObserver>
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
} from '../../api/axios/user.js'
// 表示专门用来验证某一个字段的，需要单独的引入
import { validate } from 'vee-validate'
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
      // 验证表单数据通过this.$refs.form.validate()方法进行手动验证
      const success = await this.$refs.form.validate()
      if (!success) {
        // 需要使用定时器来获取错误对象数据，因为在vue调试控制和控制台输出
        // 的数据不同步，所有延迟一下获取
        setTimeout(() => {
          const errors = this.$refs.form.errors
          // 如果item[0]是空数组的话说明是验证成功的，里面没有错误信息
          // 反之就是没有验证通过的返回返回，在提示出来
          const item = Object.values(errors).find(item => item[0])
          this.$toast(item[0])
        }, 100)
        return
      }
      this.$toast.loading({
        duration: 0, // 如果值为0的话会一直处于加载状态
        message: '登录中...',
        forbidClick: true
      })
      try {
        let result = await getUserInfo(this.userData)
        // 但是如果这里还有提示信息的话，就可以避免一直加载问题
        setTimeout(() => {
          this.$toast.success('登录成功')
        }, 500)
        // 跳转到主页
        setTimeout(() => {
          this.$router.push('/home/me')
        }, 1000)
        // 登录成功的话存储tooken
        this.$store.commit('setUserToken', result.data.data)
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
      // 验证手机号字段，第一个参数是要验证的字段，第二个参数是验证的规则
      // 第三个参数是一个可选的对象，属性有name要验证的字段
      // 验证单独的字段
      const validResult = await validate(mobile, 'required|mobile', {
        // 设置自己的name属性的值
        name: '手机号'
      })
      if (!validResult.valid) {
        this.$toast(validResult.errors[0])
        this.isShow = false
        return
      }
      try {
        // 请求获取短信验证码，将手机号传递过去
        await getCodeInfo(mobile)
      } catch (err) {
        this.isShow = false
        // 如果状态码等于429说明是频繁的发送了验证码，验证码需要一分钟发送一次
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
