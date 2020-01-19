<template>
    <div class='container'>
        <van-nav-bar
            title="编辑名称"
            left-text="取消"
            right-text="确定"
            @click-left="$emit('close')"
            @click-right="$emit('edit-name', nameVal)"
        />
        <van-field
            rows="2"
            autosize
            type="textarea"
            maxlength="6"
            placeholder="请输入留言"
            show-word-limit
            :value="name"
            @input="nameVal = $event"
        />
    </div>
</template>

<script>
export default {
  name: 'edit-name',
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      nameVal: ''
    }
  },
  methods: {

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
    .van-cell {
        padding: 0;
        margin: 0;
        width: 300px;
        height: 90px;
        background: #ccc;
        margin: 30px 40px;
        padding: 10px;
    }
</style>
