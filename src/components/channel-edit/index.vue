<template>
  <div>
       <div>
        <div class="title">
          <span class="title-item">编辑频道</span>
        </div>
        <van-cell class="me-channel" :border="false" title="我的频道">
          <van-button @click="isCloseShow = ! isCloseShow" size="mini" type="danger" round>
              {{ isCloseShow ? '完成' : '编辑' }}
          </van-button>
          <span slot="label" class="left-item">点击进入频道</span>
        </van-cell>
        <van-grid :border="true" :column-num="4" :gutter="6">
          <van-grid-item
            class="channel-item"
            v-for="(item, index) in channelsList"
            :key="index"
            @click="channelToggle(index)"
          >
            <span slot="text" class="text"
                :class="{active: value === index}">
                {{ item.name }}
            </span>
            <!-- index !== 0表示推荐不能被删除，所以不能出来删除的图标 -->
            <van-icon
                v-show="isCloseShow && index !== 0"
                slot="icon" name="close"
            />
          </van-grid-item>
        </van-grid>
      </div>
      <div class="recommend">
        <van-cell class="me-channel" :border="false" title="推荐频道">
          <span slot="label" class="left-item">点击进入推荐频道</span>
        </van-cell>
        <van-grid :border="true" :column-num="4" :gutter="6">
            <van-grid-item
                class="channel-item"
                v-for="(item, index) in SurolusChannels"
                :key="index"
                :text="item.name"
                @click="addChannels(item)"
            >
          </van-grid-item>
        </van-grid>
      </div>

  </div>
</template>

<script>
import { getAllChannels } from '@/api/axios/channels.js'
import { setItem } from '../../utils/storage.js'
export default {
  props: {
    channelsList: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      // 获取所有的频道信息
      allChannels: [],
      isCloseShow: false
    }
  },
  methods: {
    async getAllChannelsList () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    addChannels (channel) {
      this.channelsList.push(channel)
    },
    channelToggle (index) {
      // 判断如果是编辑状点击频道就删除，否则就跳转到该频道列表
      if (this.isCloseShow && index !== 0) {
        // 执行删除从当前位置开始删，删除一个
        this.channelsList.splice(index, 1)
      } else {
        // 如果不是编辑状态，点击频道开始跳转
        this.$emit('input', index)
        // 并且告诉父元素关闭弹框
        this.$emit('close')
      }
    }
  },
  created () {
    this.getAllChannelsList()
  },
  watch: {
    // 监听channelsList频道数据的改变，只要数据发生变化就存储到本地
    channelsList () {
      setItem('user-channels', this.channelsList)
    }
  },
  computed: {
    SurolusChannels () {
      const { allChannels, channelsList } = this
      const channels = []
      // 筛选出我的频道不包含的频道，每次我的频道和全部频道的数据发生变化
      // 就会重新删选
      allChannels.forEach(item => {
        if (!channelsList.find(channelId => channelId.id === item.id)) {
          channels.push(item)
        }
      })
      return channels
    }
  }
}
</script>

<style lang="less" scoped>
    .title {
        width: 100%;
        display: block;
        font-size: 16px;
        padding-top: 15px;
        color: #666;
        .title-item {
            padding-left: 160px;
        }
    }
    .title::after {
        content: '';
        display: block;
        border-bottom: #ccc solid 1px;
        margin-top: 15px;
    }
  .me-channel {
    position: relative;
    .left-item {
      position: absolute;
      left: 86px;
      top: 14px;
      color: #ccc;
    }
  }
  .channel-item {
    font-size: 20px;
    color: #666;
  }
  .recommend {
    .me-channel {
        margin-top: 30px;
        margin-bottom: 30px;
    }
  }
  ::v-deep .van-grid-item__content {
      position: relative;
      .van-grid-item__icon-wrapper {
          position: absolute;
          top: -10px;
          right: -6px;
      }
  }
  .active {
      color: yellow;
  }
  .text {
      font-size: 14px;
  }
</style>
