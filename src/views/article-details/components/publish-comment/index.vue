<template>
  <div class="publish-comment-container">
      <van-nav-bar
        title="发表评论"
        v-if="navbar"
      >
        <van-icon @click="$emit('close')" slot="left" name="close"></van-icon>
      </van-nav-bar>
     <div class="publish-item">
          <span v-if="!navbar" class="add-margin"></span>
          <van-field
            rows="2"
            autosize
            type="textarea"
            maxlength="50"
            placeholder="请输入评论的内容"
            show-word-limit
            :border="false"
            style="background: #ccc;"
            :value="value"
            @input="$emit('input', $event)"
         />
        <van-button
            type="default"
            plain
            @click="$emit('publish-comment')"
            v-if="navbar"
        >
            发表
        </van-button>
     </div>
  </div>
</template>

<script>
export default {
  props: {
    navbar: {
      type: Boolean,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
  },
  craeted () {

  }
}
</script>

<style lang="less" scoped>
    .publish-comment-container {
        .van-icon {
            font-size: 23px;
        }

        .publish-item {
            padding-top: 20px;
            display: flex;
             .van-cell {
                padding: 0;
                margin: 0;
                width: 260px;
                margin: 10px 20px 10px 20px;
                padding: 5px 10px;
              }
              .add-margin {
                margin-left: 36px;
              }
            .van-button {
                margin-top: 44px;
            }
        }
        .van-nav-bar {
            padding-top: 10px;
        }
    }

</style>
