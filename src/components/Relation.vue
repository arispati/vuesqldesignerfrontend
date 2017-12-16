<template>
    <path stroke="#000" stroke-width="2" fill="none" v-bind:d="curve"></path>
</template>
<script>

export default {
  name: 'relation',
  props: ['data'],
  data () {
    return {
      args: this.data,
      curve: "M 562 104 C 586 104 586 232 610 232"
    }
  },
  methods: {

  }
}
</script>

<style lang="less">

</style>
