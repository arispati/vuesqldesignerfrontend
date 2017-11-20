<template>
<div class="table" :class="{ 'table--selected': data.selected }" :style="{ left: data.x + 'px', top: data.y + 'px'}" :x="data.x" :y="data.y"  @click.stop="tableClick"
 @mousedown.stop="startDrag">
  <table>
    <thead>
      <tr>
        <td class="table__title" colspan="2">{{data.name}}</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="table__title table__title--primary table__title--key">id</div>
        </td>
        <td>
          <td class="table__typehint"></td>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<script>

export default {
  name: 'db-table',
  props: ['data', 'selection'],
  created () {
    console.log('table component created')
  },
  data () {
    return {
      addingTable: true,
      delta: {}
    }
  },
  methods: {
    // Drag'n'Drop
    startDrag (e) {
      // this.$emit('tableclick', this.data)
      // console.log(' t startDrag')
      console.log('this.selection before')
      console.log(this.selection)
      if (!this.data.selected) {
        this.$emit('tableclick', this.data)
      }
      // this.$emit('tableclick', this.data)
      console.log('this.selection after')
      console.log(this.selection)

      this.$nextTick(function () {
        let n = this.selection.length
        this.delta.x = new Array(n)
        this.delta.y = new Array(n)
        for (let i = 0; i < n; i++) {
          // let selection = this.selection[i]
          // this.selection[i].name = 'lollollollol2'
          // console.log(selection.name)
          this.delta.x[i] = this.selection[i].x - e.clientX
          this.delta.y[i] = this.selection[i].y - e.clientY
        }
        // attach event listeners
        document.addEventListener('mousemove', this.onDrag)
        document.addEventListener('mouseup', this.stopDrag)
      })

      // let n = this.selection.length
      // this.delta.x = new Array(n)
      // this.delta.y = new Array(n)
      // for (let i = 0; i < n; i++) {
      //   // let selection = this.selection[i]
      //   // this.selection[i].name = 'lollollollol2'
      //   // console.log(selection.name)
      //   this.delta.x[i] = this.selection[i].x - e.clientX
      //   this.delta.y[i] = this.selection[i].y - e.clientY
      // }
      // // attach event listeners
      // document.addEventListener('mousemove', this.onDrag)
      // document.addEventListener('mouseup', this.stopDrag)
    },
    onDrag (e) {
      // first we detect if mousedown event called
      if (this.delta.x && this.delta.y) {
        // console.log(' t onDrag')
        let deltaXandY = []
        for (let i = 0; i < this.delta.x.length; i++) {
          let x = this.delta.x[i] + e.clientX
          let y = this.delta.y[i] + e.clientY
          x = Math.max(x, 0)
          y = Math.max(y, 0)
          deltaXandY.push({ x: x, y: y })
        }
        this.$emit('tablemove', deltaXandY)
      }
    },
    stopDrag () {
      if (this.delta.x && this.delta.y) {
        delete this.delta.x
        delete this.delta.y
      }
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      // console.log(' t stopDrag')
    },
    tableClick () {
      //
      this.$emit('tableclick', this.data)
      // console.log('TABLE CLICK')
      // at this point parent method called
    }
  }
}
</script>

<style lang="less">
  .table {
    width: auto; // overwrite bootstrap rule
    position: absolute;
  	border: 1px solid #000;
  	background-color: #ddd;
  	cursor: pointer;
  	box-shadow: 4px 4px 8px #888; /* Opera 10.5, IE 9.0 */
  	border-radius: 3px;
  }

  .table table {
	  border-collapse: collapse;
  }

  .table--selected {
    border: 2px solid #000;
  }
</style>
