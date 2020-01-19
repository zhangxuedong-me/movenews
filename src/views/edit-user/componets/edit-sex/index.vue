<template>
    <div class='container'>
        <van-nav-bar
            title="编辑名称"
            left-text="取消"
            right-text="确定"
            @click-left="$emit('close')"
            @click-right="$emit('edit-name', index)"
        />
        <van-picker
          :defaultIndex="userSex"
          :columns="sexData"
          @change="onChange"
        />
    </div>
</template>

<script>
export default {
  name: 'edit-sex',
  props: {
    userSex: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      sexData: ['男', '女'],
      index: null
    }
  },
  methods: {
    onChange (picker, value, index) {
      this.index = index
    }
  },
  created () {

  },
  mounted () {

  },
  components: {

  },
  computed: {

  },
  watch: {

  },
  filters: {

  }
}
</script>

<style lang='less' scoped>
    .van-nav-bar {
        background: #ccc;
    }
</style>
