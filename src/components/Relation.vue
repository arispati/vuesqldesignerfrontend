<template>
    <path stroke="#000" stroke-width="2" fill="none" v-bind:d="curve2" v-bind:prop="curve2"></path>
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
      let relation = this.data
      let table1 = relation.row1.owner
      let table2 = relation.row2.owner
      // let t1_x = t1.x
      // let t1_y = t1.y
      // let t2_x = t2.x
      // let t2_y = t2.y
      // let t1_dom = t1.dom.container
      // let t2_dom = t2.dom.container
      // watch this
      table1.x
      table1.y
      table2.x
      table2.y
      let l1 = table1.x
      let l2 = table2.x
      let r1 = l1 + table1.dom.container.offsetWidth
      let r2 = l2 + table2.dom.container.offsetWidth
      let t1 = table1.dom.container.offsetTop + relation.row1.dom.container.offsetTop + Math.round(relation.row1.dom.container.offsetHeight / 2)
      let t2 = table2.dom.container.offsetTop + relation.row2.dom.container.offsetTop + Math.round(relation.row2.dom.container.offsetHeight / 2)
      let p1 = [0, 0]
      let p2 = [0, 0]
      if (r1 < l2 || r2 < l1) { /* between tables */
        if (Math.abs(r1 - l2) < Math.abs(r2 - l1)) {
          p1 = [r1, t1]
          p2 = [l2, t2]
        } else {
          p1 = [r2, t2]
          p2 = [l1, t1]
        }
        let half = Math.floor((p2[0] - p1[0]) / 2)
        return this.redrawNormal(p1, p2, half)
      } else { /* next to tables */
        let x = 0
        // let l = 0
        if (Math.abs(l1 - l2) < Math.abs(r1 - r2)) { /* left of tables */
          p1 = [l1, t1]
          p2 = [l2, t2]
          x = Math.min(l1, l2) - 15 // CONFIG.RELATION_SPACING
        } else { /* right of tables */
          p1 = [r1, t1]
          p2 = [r2, t2]
          x = Math.max(r1, r2) + 15 // CONFIG.RELATION_SPACING
        }
        return this.redrawSide(p1, p2, x)
      }
      // console.log('t1')
      // console.log(t1.dom.container)
      // console.log('t2')
      // console.log(t2.dom.container)
      // console.log('------------------------')
      // console.log(t1.x)
      // console.log(t1.y)
      // console.log(t2.x)
      // console.log(t2.y)
      // console.log('------------------------')
    }
  },
  methods: {
    redrawNormal (p1, p2, half) {
      let str = 'M ' + p1[0] + ' ' + p1[1] + ' C ' + (p1[0] + half) + ' ' + p1[1] + ' '
      str += (p2[0] - half) + ' ' + p2[1] + ' ' + p2[0] + ' ' + p2[1]
      return str
    },
    redrawSide (p1, p2, x) {
      let str = 'M ' + p1[0] + ' ' + p1[1] + ' C ' + x + ' ' + p1[1] + ' '
      str += x + ' ' + p2[1] + ' ' + p2[0] + ' ' + p2[1]
      return str
    }
  }
}
</script>

<style lang="less">

</style>
