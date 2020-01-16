<template>
  <div class="leader-container">
    <!-- 先放置一个tab -->
    <!-- 然后放置一个list列表用下拉刷新组件包起来 -->
    <!--
      @load事件：页面已一初始化会首先加载第一屏的数据，之后每次下拉触底的时候
      都会触发@load事件
     -->

     <!-- 弹框组件，弹出编辑菜单部分 -->
     <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '90%' }"
      :duration="0.5"
      round
       jkcloseable
      close-icon-position="top-left"
      closeable
    >
    <!--
      在组件上绑定v-model：
        默认传递一个value的数据给子组件:value="active"
        默认的监听名字叫 input的自定义事件 @input="active=事件参数"
        v-model就是前俩步的简写形式，他既可以把active参数传递到子组件
        又能接收子组件订阅的事件input
    -->
      <channel-edit
        v-model="active"
        :channelsList="channelsList"
        @close="show = false"
      >
      </channel-edit>
    </van-popup>

    <!-- 频道列表 -->
    <van-nav-bar :fixed="true">
      <span slot="left" class="news-title">黑马头条</span>
      <van-button
        icon="search"
        slot="right"
        round
        type="default"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>
    <van-tabs v-model="active">
      <van-tab v-for="item in channelsList" :key="item.id" :title="item.name">
        <article-list :channel="item" />
      </van-tab>
      <div slot="nav-right" class="wap-nav" @click="show = true">
          <van-icon name="wap-nav" size="24" />
      </div>
    </van-tabs>
  </div>
</template>
<script>
import { getChannelsList } from '@/api/axios/channels.js'
import articleList from '@/components/article-list'
import channelEdit from '@/components/channel-edit'
import { getItem } from '@/utils/storage.js'
export default {
  data () {
    return {
      active: 0,
      // 获取频道数据
      channelsList: [],
      show: false
    }
  },
  methods: {
    // 获取频道列表数据
    async getChannelsListData () {
      let result = getItem('user-channels')
      let channels = []
      if (result) {
        // 如果从本地获取到数据了就用本地的数据
        channels = result
      } else {
        // 否则就用请求到的数据
        const { data } = await getChannelsList()
        channels = data.data.channels
      }
      this.channelsList = channels
    }
  },
  created () {
    this.getChannelsListData()
  },
  components: {
    articleList,
    channelEdit
  }
}
</script>

<style lang="less" scoped>
  @import url('../../../styles/variables.less');
  .leader-container {
    padding-top: 88px;
    padding-bottom: 50px;
  }
  .van-nav-bar {
    background: @back-color;
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .wap-nav {
    position: sticky;
    right: 0;
    display: flex;
    align-items: center;
    background-color: #fff;
    opacity: 0.8;
  }

  // 因为样式只能到子组件的根组件，无法渗透到子组件中，
  // 需要加上签注::v-deep或者>>>或者/deep/即可
  ::v-deep .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    z-index: 10;
  }
  ::v-deep .van-popup__close-icon {
    color: #4db8f0;
    font-size: 22px;
  }
  .news-title {
    color: #fff;
    font-size: 16px;
    margin-left: 10px;
  }
  .van-button {
    width: 180px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    background: #71b8f4;
    border: none;
  }
</style>
