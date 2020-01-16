<template>
    <!-- 频道列表数据 -->
  <div class="recommend-container">
    <van-panel desc="描述信息" status="状态">
        <div
            slot="header"
            v-for="(item, index) in list"
            :key="index"
            @click="$router.push(`/articles/${item.art_id}`)"
        >
            <!-- 一张图片的显示效果 -->
           <div  class="recom-list" v-if="item.cover.images.length !== 3">
               <div class="recom">
                    <p class="recom-title">{{ item.title }}</p>
                    <div class="recom-item">
                        <span>{{ item.aut_name }}</span>
                        <span>{{ item.comm_count }}评论</span>
                        <span>{{ item.pubdate }}</span>
                    </div>
                </div>
                <van-image
                    lazy-load
                    class="recom-image"
                    width="120"
                    :src="item.cover.images[0]"
                    v-if="item.cover.images.length"
                />
           </div>
            <!-- 三张图片的显示效果 -->
           <div class="recom-list-three"
                v-else-if="item.cover.images.length === 3"
           >
                <van-cell
                    :title="item.title"
                >
                <div slot="label">
                    <van-grid :border="false" :column-num="3">
                    <van-grid-item
                        v-for="(imglist, index) in item.cover.images"
                        :key="index"
                    >
                        <van-image
                            v-if="item.cover.images.length"
                            height="80"
                            :src="imglist"
                            lazy-load
                        />
                    </van-grid-item>
                    </van-grid>

                    <div class="article-info">
                        <span>{{ item.aut_name }}</span>
                        <span>{{ item.comm_count }}评论</span>
                        <span>{{ item.pubdate }}</span>
                    </div>
                </div>
            </van-cell>
           </div>
        </div>
    </van-panel>
  </div>
</template>

<script>
export default {
  props: ['list'],
  data () {
    return {

    }
  },
  methods: {

  },
  created () {
  }
}
</script>

<style lang="less">
    .recom-list {
        display: flex;
        // align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        .recom {
            width: 200px;
            .recom-title {
                font-size: 15px;
            }
            .recom-item {
                font-size: 14px;
                padding: 10px 0;
                color: #999;
                span:nth-child(2) {
                    padding: 0 16px;
                }
            }
        }
        .recom-image {
            margin-top: 12px;
        }
    }
</style>
