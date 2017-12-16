<template>
    <path stroke="#000" stroke-width="2" fill="none" v-bind:d="curve" v-bind:prop="curve2"></path>
</template>
<script>

export default {
  name: 'relation',
  props: ['data'],
  data () {
    return {
      args: this.data,
      curve: 'M 562 104 C 586 104 586 232 610 232'
    }
  },
  computed: {
    curve2: function () {
      console.log('data is???')
      console.log(this.data)
      let relation = this.data
      let t1 = relation.row1.owner
      let t2 = relation.row2.owner
      console.log('compute curve!!!')
      console.log('t1')
      console.log(t1.x)
      console.log('t2')
      console.log(t2.x)
      return 'zzaza'
    }
  },
  methods: {

  }
}
</script>

<style lang="less">

</style>
