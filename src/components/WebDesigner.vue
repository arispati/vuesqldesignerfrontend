<template>
  <div>
  <div class="area" :class="{ 'area--adding': adding }" @click="areaClick"
    @mousedown="mousedownArea">
    <template v-for="table in tables">
      <db-table v-on:tableclick="select" v-on:tablemove="move" :data="table" :selection="selection"></db-table>
    </template>
    <rubberband :data="rubberband"></rubberband>
  </div>
  <div class="controls">
    <input class="btn btn-default" type="button" value="Add table" @click="preAdd" :value="dom.addtable.value">
  </div>
</div>
</template>

<script>
// import axios from 'axios'

// const API_BASE = 'http://websqldesignerserver'

import Table from '@/components/Table'
import RubberBand from '@/components/RubberBand'

export default {
  name: 'webdesigner',
  created () {
    console.log('webdesigner component created')
  //  axios.get(`${API_BASE}/backend/php-mysql/index.php`).then((response) => {
  //    console.log('HTTP response!!!')
  //    console.log(response)
  //  })
  },
  data () {
    return {
      tables: [], // array of all tables (each table is a vue-component)
      selection: [],
      adding: false, // add table mode
      dom: {
        addtable: {
          values: ['Add table', 'Place table'],
          value: 'Add table'
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
        downed: false,
        visibility: 'hidden'
      },
      webdesigner: 'this is web designer component'
    }
  },
  methods: {
    // rubberband methods
    mousedownArea (e) {
      let x = e.clientX + window.pageXOffset
      let y = e.clientY + window.pageYOffset
      this.rubberband.x = this.rubberband.x0 = x
      this.rubberband.y = this.rubberband.y0 = y
      this.rubberband.width = 0
      this.rubberband.height = 0
      // this.rubberband.visibility = 'visible'
      this.rubberband.downed = true
      console.log('mousedown area')
      // console.log(this.$el)
      document.addEventListener('mousemove', this.mousemoveArea)
      document.addEventListener('mouseup', this.mouseupArea)
    },
    mousemoveArea (e) {
      // if condition is true - mousedown event called
      // if (this.rubberband.visibility === 'visible') {
      if (this.rubberband.downed) {
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
      }
      console.log('mousemove area')
    },
    mouseupArea () {
      // preventEvent?
      this.rubberband.downed = false
      this.rubberband.visibility = 'hidden'
      this.selectRect(this.rubberband.x, this.rubberband.y, this.rubberband.width, this.rubberband.height)
      console.log('mouseup area')
      document.removeEventListener('mousemove', this.mousemoveArea)
      document.removeEventListener('mouseup', this.mouseupArea)
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
      console.log('move table>>>>')
      console.log(param)
      for (let i = 0; i < param.length; i++) {
        this.selection[i].x = param[i].x
        this.selection[i].y = param[i].y
      }
    },
    select (table, multi) {
      console.log('selection')
      console.log(this.selection)
      // console.log('select table n parent Component!')
      // console.log('table')
      // console.log(table)
      // console.log('multi')
      // console.log(multi)
      // console.log('table')
      // console.log(table)
      // console.log('multi')
      // console.log(multi)
      // console.log(this.tables.indexOf(table))
      if (table) {
        if (multi) {
          // let i = this.selection.indexOf(table)
          // if (i < 0) {
          //   this.selection.push(table)
          // } else {
          //   this.selection.splice(i, 1)
          // }
        } else {
          if (this.selection[0] === table) {
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
        this.$set(this.tables[i], 'selected', false)
      }
      for (let i = 0; i < this.selection.length; i++) {
        this.$set(this.selection[i], 'selected', true)
      }
    },
    addTable (name, x, y) {
      // let max = this.getMaxZ()
      // create new component
      let newtable = {x: x, y: y, name: name, selected: false}
      this.tables.push(newtable) // превратить в объект Класса TableObject, например
      return newtable
    },
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
    areaClick (e) {
      console.log('area click')
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
