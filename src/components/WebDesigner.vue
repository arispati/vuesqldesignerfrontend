<template>
  <div>
  <div class="area" :class="{ 'area--adding': adding }" @click="clickArea"
    @mousedown="mousedownArea">
    <template v-for="table in tables">
      <db-table @dblclickrow="expandRow" @clickrow="selectRow" v-on:clicktable="clickTable" v-on:tablemove="move" :data="table" :selection="selection"  @updaterowdata="updateRowData"></db-table>
    </template>
    <rubberband :data="rubberband"></rubberband>
  </div>
  <div class="controls">
    <input class="btn btn-default" type="button" value="Default value" @click="preAdd" :value="dom.addtable.value">
    <input class="btn btn-default" type="button" value="Default value" @click="addRow" :value="dom.addrow.value">
    <input class="btn btn-default" type="button" value="Show Component Data" @click="showComponentData"></input>
  </div>
</div>
</template>

<script>
import axios from 'axios'

import TableModel from '@/models/table.js'

import Table from '@/components/Table'
import RubberBand from '@/components/RubberBand'
import Fn from '@/functions.js'

const API_BASE = 'http://websqldesignerserver'

export default {
  name: 'webdesigner',
  created () {
    console.log('webdesigner component created')
  //  axios.get(`${API_BASE}/backend/php-mysql/index.php`).then((response) => {
  //    console.log('HTTP response!!!')
  //    console.log(response)
  //  })
    axios({method: 'get', url: `${API_BASE}/corsbridge.php?db=mysql`}).then((xmlDoc) => {
      let xml = Fn.fromXMLText(xmlDoc.data)
      this.DATATYPES = xml.documentElement
      this.buildTypeSelect()
    })
  },
  data () {
    return {
      selectDataTypes: false,
      DATATYPES: false, // datatypes for DB
      tables: [], // array of all tables (each table is a vue-component)
      selection: [],
      selectedRow: false, // selected row
      adding: false, // add table mode
      dom: {
        addtable: {
          values: ['Add table', 'Place table'],
          value: 'Add table'
        },
        addrow: {
          value: 'Add field'
        }
      },
      // rubberband info
      rubberband: {
        x: 0,
        y: 0,
        x0: 0,
        y0: 0,
        width: 0,
        height: 0,
        dragged: false,
        visibility: 'hidden'
      },
      webdesigner: 'this is web designer component'
    }
  },
  methods: {
    showComponentData () {
      console.log('showComponentData')
      console.log(this.tables)
    },
    // build typeSelect method located here
    buildTypeSelect () {
      let selectDataTypes = []
      let gs = this.DATATYPES.getElementsByTagName('group')
      for (let i = 0; i < gs.length; i++) {
        let og = { options: [] }
        let g = gs[i]
        og.backgroundColor = g.getAttribute('color') || '#fff'
        og.label = g.getAttribute('label')
        let ts = g.getElementsByTagName('type')
        for (let j = 0; j < ts.length; j++) {
          let t = ts[j]
          let o = {}
          if (t.getAttribute('color')) { o.backgroundColor = t.getAttribute('color') }
          if (t.getAttribute('note')) { o.title = t.getAttribute('note') }
          o.innerHTML = t.getAttribute('label')
          og.options.push(o)
        }
        selectDataTypes.push(og)
      }
      this.selectDataTypes = selectDataTypes
      console.log(gs)
      console.log(selectDataTypes)
    },
    removeSelection () {
      let sel = (window.getSelection ? window.getSelection() : document.selection)
      if (!sel) { return }
      if (sel.empty) { sel.empty() }
      if (sel.removeAllRanges) { sel.removeAllRanges() }
    },
    // rubberband methods
    mousedownArea (e) {
      let x = e.clientX + window.pageXOffset
      let y = e.clientY + window.pageYOffset
      this.rubberband.x = this.rubberband.x0 = x
      this.rubberband.y = this.rubberband.y0 = y
      this.rubberband.width = 0
      this.rubberband.height = 0
      document.addEventListener('mousemove', this.mousemoveArea)
      document.addEventListener('mouseup', this.mouseupArea)
      console.log('WebDesigner component->mousedownArea')
    },
    mousemoveArea (e) {
      this.removeSelection()
      // if condition is true - mousedown event called
      // if (this.rubberband.visibility === 'visible') {
      if (this.rubberband.visibility === 'hidden') {
        this.rubberband.visibility = 'visible'
      }
      this.rubberband.dragged = true
      let x = e.clientX + window.pageXOffset
      let y = e.clientY + window.pageYOffset
      this.rubberband.width = Math.abs(x - this.rubberband.x0)
      this.rubberband.height = Math.abs(y - this.rubberband.y0)
      if (x < this.rubberband.x0) { this.rubberband.x = x } else { this.rubberband.x = this.rubberband.x0 }
      if (y < this.rubberband.y0) { this.rubberband.y = y } else { this.rubberband.y = this.rubberband.y0 }
      console.log('WebDesigner component->mousemoveArea')
      // console.log('mousemove area')
    },
    mouseupArea () {
      // preventEvent?
      this.rubberband.visibility = 'hidden'
      this.selectRect(this.rubberband.x, this.rubberband.y, this.rubberband.width, this.rubberband.height)
      // console.log('mouseup area')
      document.removeEventListener('mousemove', this.mousemoveArea)
      document.removeEventListener('mouseup', this.mouseupArea)
      console.log('WebDesigner component->mouseupArea')
    },
    selectRect (x, y, width, height) {
      this.selection = []
      let tables = this.tables
      let x1 = x + width
      let y1 = y + height
      for (let i = 0; i < tables.length; i++) {
        let t = tables[i]
        let tx = t.x
        let tx1 = t.x + t.width
        let ty = t.y
        let ty1 = t.y + t.height
        if (((tx >= x && tx < x1) || (tx1 >= x && tx1 < x1) || (tx < x && tx1 > x1)) &&
         ((ty >= y && ty < y1) || (ty1 >= y && ty1 < y1) || (ty < y && ty1 > y1))) {
          this.selection.push(t)
        }
      }
      this.processSelection()
    },
    move (param) {
      for (let i = 0; i < param.length; i++) {
        this.selection[i].x = param[i].x
        this.selection[i].y = param[i].y
      }
    },
    clickTable (table, multi, newSelect) {
      console.log('Webdesigner component->clickTable')
      if (newSelect) {
        this.selectRow(false)
      }
      // console.log('Table Click')
      // this.selectRow(false)
      this.select(table, multi)
    },
    // expand row
    expandRow (data) {
      console.log('Webdesigner component->expandRow')
      // let row = data.row
      // let table = row.owner
      data.row.expand()
    },
    updateRowData (rowdata) {
      console.log('=========rowdata updated!========')
      console.log(rowdata)
      console.log('======================')
      // find row
      let tIndex = this.tables.indexOf(rowdata.row.owner)
      let rIndex = this.tables[tIndex].rows.indexOf(rowdata.row)
      let row = this.tables[tIndex].rows[rIndex]
      this.setNewDataToRow(row, rowdata.newrowdata)
    },
    setNewDataToRow (row, newdata) {
      row.data.title = newdata.title
      row.data.type = newdata.type
    },
    // select row
    selectRow (data) {
      console.log('Webdesigner component->selectRow')
      // console.log('rowclick')
      let row = data
      if (data) {
        let tIndex = this.tables.indexOf(data.table)
        let rIndex = this.tables[tIndex].rows.indexOf(data.row)
        row = this.tables[tIndex].rows[rIndex]
      }
      if (this.selectedRow === row) { return }
      if (this.selectedRow) { this.selectedRow.deselect() }
      this.selectedRow = row
      if (this.selectedRow) { this.selectedRow.select() }
    },
    // select table
    select (table, multi) {
      console.log('Webdesigner component->select (selectTable)')
      if (table) {
        if (multi) {
          // let i = this.selection.indexOf(table)
          // if (i < 0) {
          //   this.selection.push(table)
          // } else {
          //   this.selection.splice(i, 1)
          // }
        } else {
          if (this.selection.length <= 1 && this.selection[0] === table) {
            console.log('this.selection[0] === table')
            return
          }
          this.selection = [table]
        }
      } else {
        this.selection = []
      }
      this.processSelection()
    },
    processSelection () {
      for (let i = 0; i < this.tables.length; i++) {
        this.tables[i].selected = false
        // this.$set(this.tables[i], 'selected', false)
      }
      for (let i = 0; i < this.selection.length; i++) {
        this.selection[i].selected = true
        // this.$set(this.selection[i], 'selected', true)
      }
    },
    addTable (name, x, y) {
      // let max = this.getMaxZ()
      // create new component
      let newtable = new TableModel({x: x, y: y, name: name, selected: false, owner: this})
      let r = newtable.addRow('id', {ai: true})
      // console.log('r')
      console.log(r)

      this.tables.push(newtable)
      return newtable
    },
    // Add table button clicked
    preAdd () {
      let addtable = this.dom.addtable
      if (this.adding) {
        this.adding = false
        addtable.value = addtable.values[0]
      } else {
        this.adding = true
        addtable.value = addtable.values[1]
      }
    },
    // Add row button clicked
    addRow () {
      // console.log('AddRow')
      this.selection[0].addRow('newrow')
    },
    clickArea (e) {
      console.log('WebDesigner component->clickArea')
      if (this.rubberband.dragged) {
        this.rubberband.dragged = false
        return
      }
      let addtable = this.dom.addtable
      let newtable = false
      if (this.adding) {
        this.adding = false
        addtable.value = addtable.values[0]
        let x = e.clientX + window.pageXOffset
        let y = e.clientY + window.pageYOffset
        newtable = this.addTable('newtable', x, y)

        // setTimeout(() => {
        //   // console.log(this.tables[0])
        //   // this.tables[0].name = 'muahaa'
        //   // console.log(this.tables[0].name)
        //   // this.tables[0] = {x: 10, y: 10, name: 'azazaz'}
        //   // let newtable = {x: 65, y: 5, name: 'azazaz'}
        //   // this.tables.$set(0, { childMsg: 'Changed!'})
        //   this.$set(this.tables[0], 'name', 'igogo')
        //   // this.tables.splice(0, 1, newtable)
        // }, 1500)
      }
      this.select(newtable)
      this.selectRow(false)
    }
  },
  components: {
    'db-table': Table,
    'rubberband': RubberBand
  }
}
</script>

<style lang="less">
  .area {
    position: relative;
    background: transparent url(../assets/back.png);
    width: 3000px;
    height: 3000px;
  }

  .area--adding {
    cursor: crosshair;
  }

  .controls {
    text-align: center;
    background-color: #ccc;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 150px;
    padding: 0px 5px 5px;
  }
</style>
