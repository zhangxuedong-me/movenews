<template>
  <div>
    <router-view />
    <van-tabbar router v-model="active">
        <van-tabbar-item to="/home/page" icon="wap-home-o">
            首页
        </van-tabbar-item>
        <van-tabbar-item to="/home/quess" icon="comment-o">
            问答
        </van-tabbar-item>
        <van-tabbar-item to="/home/video" icon="video-o">
            视频
        </van-tabbar-item>
        <van-tabbar-item to="/home/me" icon="user-o">
            {{ $store.state.user ? '我的' : '未登录' }}
        </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: null
    }
  },
  methods: {

  },
  created () {

  }
}
</script>

<style>

</style>
