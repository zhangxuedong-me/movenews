<template>
  <div class="serach-item-container">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        >
        <van-cell
            v-for="(item, index) in list"
            :key="index"
            :title="item.title"
        />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/axios/associate.js'
export default {
  props: {
    q: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 10
    }
  },
  methods: {
    async onLoad () {
      // 1，发请求获取数据
      const { data } = await getSearchResult({
        page: this.page,
        per_page: this.per_page,
        q: this.q
      })
      // 2，将数据添加到数组中
      const result = data.data.results
      this.list.push(...result)
      // 3，加载状态结束
      this.loading = false
      // 4，判断如果数据全部加载完毕，就停止加载数据，否则就继续发送请求获取数据
      if (result.length) {
        // 如果还有数据的话就让页数++
        this.page++
      } else {
        this.finished = true
      }
    }
  },
  created () {

  }
}
</script>

<style>

</style>
