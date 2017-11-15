<template>
  <div>
  <div class="area" :class="{ 'area--adding': adding }" @click="areaClick">
    <template v-for="table in tables">
      <db-table :data="table"></db-table>
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
    addTable (name, x, y) {
      // let max = this.getMaxZ()
      // create new component
      console.log('calling addTable')
      console.log(x)
      console.log(y)
      this.tables.push({x: x, y: y, name: name})
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
      if (this.adding) {
        this.adding = false
        addtable.value = addtable.values[0]
        let x = e.clientX + window.pageXOffset
        let y = e.clientY + window.pageYOffset
        this.addTable('newtable', x, y)
      }
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
