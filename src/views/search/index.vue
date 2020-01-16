<template>
  <div class="search-container">
        <!-- 搜索框 -->
        <form action="/" class="my-form">
            <van-search
                v-model="searchVal"
                placeholder="请输入搜索关键词"
                show-action
                clearable
                @input="inputVal"
                @search="onSearch(searchVal)"
                @focus="isItemShow=false"
            >
                <span slot="action" @click="$router.back()">取消</span>
            </van-search>
        </form>
        <div class="item">
            <!-- 内容列表 -->
            <search-item :q="searchVal" v-if="isItemShow" />
            <!-- 联想建议 -->
            <van-cell-group v-else-if="searchVal">
                <van-cell
                    v-for="(item, index) in searchSuggestion"
                    icon="search"
                    :key="index"
                    @click="onSearch(item)"
                >
                    <div slot="title" v-html="highlight(item)"></div>
                </van-cell>
            </van-cell-group>
            <!-- 历史记录 -->
            <van-cell-group v-else>
                <van-cell title="历史记录">
                    <!-- isDeleteShow开始的时候为false隐藏删除和完成 -->
                    <template v-if="isDeleteShow" slot="default">
                        <!-- 全部删除赋值一个空数组即可 -->
                        <span @click="historyRecord = []">
                            全部删除&nbsp;&nbsp;
                        </span>
                        <!-- 点击完成的时候，将 isDeleteShow 设置为false-->
                        <span @click="isDeleteShow = false">完成</span>
                    </template>
                    <!--
                        当点击删除图标的时候，将他的值设置为true，
                        显示全部删除和完成，并且将删除图片自己隐藏
                     -->
                    <van-icon
                        v-else
                        @click="isDeleteShow = true"
                        name="delete"
                    />
                </van-cell>
                <van-cell
                    v-for="(item, index) in historyRecord"
                    :key="index"
                    :title="item"
                >
                    <!-- 点击删除图标，删除当前的坐标的数据 -->
                    <van-icon
                        v-show="isDeleteShow"
                        name="close"
                        @click="historyRecord.splice(index, 1)"
                    />
                </van-cell>
            </van-cell-group>
        </div>
  </div>
</template>

<script>
import searchItem from '@/components/search-item'
import { getAssociate } from '@/api/axios/associate.js'
import { getItem, setItem } from '@/utils/storage.js'
import { debounce } from 'lodash'
export default {
  data () {
    return {
    // 删除状态
      isDeleteShow: false,
      searchVal: '',
      // 内容列表的状态
      isItemShow: false,
      // 搜索的联想建议
      searchSuggestion: [],
      // 存储历史记录
      historyRecord: getItem('user-history') || []
    }
  },
  watch: {
    historyRecord (newVal) {
      setItem('user-history', newVal)
    }
  },
  methods: {
    // 确定搜索时触发
    onSearch (q) {
      // 判断一下如果有相同的历史记录只保留一个，并且新的历史记录添加到数组的
      // 最前面
      this.searchVal = q
      let index = this.historyRecord.indexOf(this.searchVal)
      if (index !== -1) {
        this.historyRecord.splice(index, 1)
        return
      }
      // 存储历史记录
      this.historyRecord.unshift(this.searchVal)
      this.isItemShow = true
    },
    // 输入值的时候触发，函数防抖处理
    inputVal: debounce(async function () {
      if (this.searchVal) {
        // 获取联想建议
        const { data } = await getAssociate(this.searchVal)
        this.searchSuggestion = data.data.options
      }
    }, 400),
    // 把输入获取到的联想建议部分高亮显示
    highlight (str) {
      // 无论是按大写还是小写的匹配，全部转成小写按小写来匹配
      return str.toLowerCase().replace(this.searchVal.toLowerCase(),
        `<span style="color: yellow;">${this.searchVal}</span>`)
    }
  },
  created () {
  },
  components: {
    searchItem
  }
}
</script>

<style lang="less" scoped>
    .search-container {
        .my-form {
            position: fixed;
            top: 0px;
            left: 0;
            right: 0;
            z-index: 10;
        }
        .item {
            padding-top: 54px;
        }
    }
</style>
