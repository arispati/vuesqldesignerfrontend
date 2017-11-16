<template>
  <div>
  <div class="area" :class="{ 'area--adding': adding }" @click="areaClick">
    <template v-for="table in tables">
      <db-table v-on:tableclick="select" :data="table"></db-table>
    </template>
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
      webdesigner: 'this is web designer component'
    }
  },
  methods: {
    select (table, multi) {
      // console.log('table')
      // console.log(table)
      // console.log('multi')
      // console.log(multi)
      // console.log(this.tables.indexOf(table))
      if (table) {
        if (multi) {

        } else {
          // let tIndex = this.tables.indexOf(table)
          // if (this.selection[0] === tIndex) {
          //   return
          // }
          // this.selection = [tIndex]
          if (this.selection[0] === table) {
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
      console.log('process selection')
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
    'db-table': Table
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
