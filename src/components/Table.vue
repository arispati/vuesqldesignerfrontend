<template>
<div class="table" :class="{ 'table--selected': data.selected }" :style="{ left: data.x + 'px', top: data.y + 'px', 'z-index': data.zIndex}" :x="data.x" :y="data.y"  @click.stop="clickTable">
  <table>
    <thead @mousedown.stop="mousedownTable" @dblclick="openTableModalDialog">
      <tr>
        <td class="table__title" colspan="2">{{data.data.title}}</td>
      </tr>
    </thead>
    <template v-for="row in data.rows">
      <db-row :locale="locale" @clickrow="clickRow" @dblclickrow="dblclickRow" :data="row" :expanded="row.expanded" @updaterowdata="updateRowData" @openModalDialog="openModalDialog"></db-row>
    </template>
    <!-- <tbody>
      <tr>
        <td>
          <div class="table__title table__title--primary table__title--key">id</div>
        </td>
        <td>
          <td class="table__typehint"></td>
        </td>
      </tr>
    </tbody> -->
  </table>
</div>
</template>
<script>
import Row from '@/components/Row'

export default {
  name: 'db-table',
  props: ['data', 'selection', 'locale'],
  created () {
    //  console.log('table component created')
  },
  mounted: function () {
    this.data.dom.container = this.$el
  },
  data () {
    return {
      rows: [], // array of all rows (each row is a vue-component)
      addingTable: true,
      delta: {},
      tableMoved: false
    }
  },
  methods: {
    removeSelection () {
      let sel = (window.getSelection ? window.getSelection() : document.selection)
      if (!sel) { return }
      if (sel.empty) { sel.empty() }
      if (sel.removeAllRanges) { sel.removeAllRanges() }
    },
    addRow () {
      // console.log('Methos from table add ROW!!!')
    },
    // Drag'n'Drop and click event callbacks
    mousedownTable (e) {
      // console.log(e.target)
      // this.$emit('tableclick', this.data)
      // console.log(' t startDrag')
      // console.log('this.selection before')
      // console.log(this.selection)
      // console.log('mousedown table')
      if (!this.data.selected) {
        console.log('Table component->mousedownTable {emit "clicktable"}')
        this.$emit('clicktable', this.data, false, true)
      } else {
        console.log('Table component->mousedownTable {...}')
      }
      // this.$emit('tableclick', this.data)
      // console.log('this.selection after')
      // console.log(this.selection)

      this.$nextTick(function () {
        // console.log('mousedown table nextTick')
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
        document.addEventListener('mousemove', this.mousemoveTable)
        document.addEventListener('mouseup', this.mouseupTable)
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
    mousemoveTable (e) {
      this.removeSelection()
      // first we detect if mousedown event called
      // console.log('mousemove table')
      if (this.delta.x && this.delta.y) {
        this.tableMoved = true
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
      console.log('Table component->mousemoveTable {emit "tablemove"}')
    },
    mouseupTable () {
      console.log('mouseUp-> element is: ')
      console.log(this.$el)
      // console.log('mouseup table')
      if (this.delta.x && this.delta.y) {
        delete this.delta.x
        delete this.delta.y
      }
      document.removeEventListener('mousemove', this.mousemoveTable)
      document.removeEventListener('mouseup', this.mouseupTable)
      console.log('Table component->mouseupTable {...}')
      // console.log(' t stopDrag')
    },
    clickTable () {
      console.log('Table component->clickTable {emit "clicktable"}')
      // console.log('table click')
      // this.$emit('rowclick', false)
      if (this.tableMoved) {
        this.tableMoved = false
        return
      }
      this.$emit('clicktable', this.data)
      // at this point parent method called
    },
    clickRow (row) {
      console.log('Table component->clickrow {emit "clickrow"}')
      this.$emit('clickrow', {row: row, table: this.data})
    },
    dblclickRow (row) {
      console.log('Table component->dblclickRow {emit "dblclickrow"}')
      this.$emit('dblclickrow', {row: row, table: this.data})
    },
    updateRowData (rowdata) {
      this.$emit('updaterowdata', rowdata)
    },
    openTableModalDialog () {
      let newtabledata = {title: this.data.data.title, comment: this.data.data.comment}
      console.log('table iss??????>>>>>>>>>>>.')
      console.log(this.data)
      this.$emit('openModalDialog', {newtabledata: newtabledata, table: this.data, mode: 'table'})
    },
    openModalDialog (data) {
      console.log('DATA ISSSSSSSS')
      console.log(data)
      console.log('=============')
      this.$emit('openModalDialog', data)
    }
  },
  components: {
    'db-row': Row
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
