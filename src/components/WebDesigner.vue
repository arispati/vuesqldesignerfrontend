<template>
  <div>
  <div class='area' :class="{ 'area--adding': adding }">

  </div>
  <div class='controls'>
    <input class="btn btn-default" type="button" value="Add table" @click="preAdd" :value="dom.addtable.value">
  </div>
</div>
</template>

<script>
// import axios from 'axios'

// const API_BASE = 'http://websqldesignerserver'

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
    preAdd () {
      if (this.adding) {
        this.adding = false
        this.dom.addtable.value = this.dom.addtable.values[0]
      } else {
        this.adding = true
        this.dom.addtable.value = this.dom.addtable.values[1]
      }
    }
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
