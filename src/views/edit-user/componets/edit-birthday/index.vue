<template>
    <div class='container'>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          @cancel="$emit('close')"
          @confirm="$emit('define', $event)"
        />
    </div>
</template>

<script>
export default {
  name: 'edit-birthday',
  props: {

  },
  data () {
    return {
      minDate: new Date(1940, 1, 1),
      maxDate: new Date(),
      currentDate: new Date()
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

</style>
