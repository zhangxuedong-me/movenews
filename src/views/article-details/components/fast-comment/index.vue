<template>
  <div class="fast-comment-container">
      <van-nav-bar
        title="评论管理"
        :fixed="true"
     />
    <comment-item
        @helpClick="helpClick"
        :comment="comment"
        :isHelpShow="true"
    />
  </div>
</template>

<script>
import commentItem from '../comment-item'
export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    helpClick () {
      this.$emit('startHelp', this.comment)
    }
  },
  created () {

  },
  components: {
    commentItem
  }
}
</script>

<style lang="less" scoped>
    .fast-comment-container {
        .van-nav-bar--fixed {
            top: 50%;
        }
    }
</style>
