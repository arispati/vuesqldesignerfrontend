<template>
  <div class="modal-window" v-show="visible" @click.stop="emptyHandler">
    <div class="modal-window__inner">
    </div>
    <div class="modal-window__wrapper">
      <div class="modal-window__title">
        <p>Keys</p>
      </div>
      <div class="modal-window__content">
        <fieldset>
          <legend>Keys in table ...</legend>
          <select :disabled="!keyExists" v-model="selectedKey">
            <!-- <option>1: PRIMARY</option> -->
            <option v-for="localKey in localKeys" v-bind:value="localKey">
              {{returnKeyName(localKey)}}
            </option>
          </select>
          <span>Выбрано: {{ selectedKey }}</span>
          <input type="button" value="Add key" @click="add"></input>
          <input type="button" value="Remove key" :disabled="!keyExists"></input>
        </fieldset>
        <fieldset>
          <select v-model="selectedKey.type">
            <!-- <option>1: PRIMARY</option> -->
            <option v-for="type in types" v-bind:value="type">
              {{type}}
            </option>
          </select>
          <input type="text" v-model="selectedKey.name"></input>
        </fieldset>
        <input type="submit" value="Войти">
        <input type="submit" value="Отмена" @click="cancel">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'db-row',
  props: ['visible', 'table'],
  created () {
  },
  // updated () {
  //   // console.log('updated method run, now we can copy params to local data')
  //   // console.log(this.table.rows)
  //   // console.log('localKeys: ')
  //   // console.log(this.localKeys)
  //   console.log('before erase')
  //   // console.log(this.localKeys)
  //   // this.erase()
  //   console.log('after erase')
  //   // console.log(this.localKeys)
  //   for (let i = 0; i < this.table.keys; i++) {
  //     let key = this.table.keys[i]
  //     let localKey = {}
  //     localKey.key = key // reference value
  //     localKey.type = key.getType() // scalar value
  //     localKey.name = key.getName() // scalar value
  //     // rows
  //     localKey.localRows = []
  //     for (let i = 0; i < key.rows.length; i++) {
  //       let row = key.rows[i] // reference value
  //       localKey.localRows.push(row)
  //     }
  //     this.localKeys.push(localKey)
  //   }
  // },
  data () {
    return {
      types: ['PRIMARY', 'INDEX', 'UNIQUE', 'FULLTEXT'],
      selectedKey: false,
      localKeys: [], // [{key: keys[i], localRows: [row,row,row], type: type, name: name}, {...}, ...]
      localRows: [] // [{row: rows[i], localKeys: [key,key,key]}, {...}, ...]
    }
  },
  watch: {
    selectedKey: function (val) {
      console.log('selectedKey')
      console.log(val)
    },
    visible: function () {
      if (this.visible) {
        // console.log('this.localKeys')
        // console.log(this.localKeys)
        this.erase()
        for (let i = 0; i < this.table.keys; i++) {
          let key = this.table.keys[i]
          let localKey = {}
          localKey.key = key // reference value
          localKey.type = key.getType() // scalar value
          localKey.name = key.getName() // scalar value
          // rows
          localKey.localRows = []
          for (let i = 0; i < key.rows.length; i++) {
            let row = key.rows[i] // reference value
            localKey.localRows.push(row)
          }
          this.localKeys.push(localKey)
        }
      }
    }
  },
  computed: {
    keyExists: function () {
      console.log('run computed')
      if (this.localKeys.length) {
        return true
      }
      return false
    }
  },
  methods: {
    emptyHandler () {},
    returnKeyName (key) {
      return key.name || key.type
    },
    erase () {
      this.localKeys = []
      this.localRows = []
    },
    add () {
      let type = (this.localKeys.length ? 'INDEX' : 'PRIMARY')
      let localKey = {}
      localKey.name = ''
      localKey.type = type
      localKey.localRows = []
      this.localKeys.push(localKey)
    },
    cancel () {
      this.$emit('closeModalKeysManager')
    }
  }
}
</script>

<style lang="less">
  .modal-window {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    &__inner {
      position: absolute;
      left: 20px;
      right: 20px;
      top: 20px;
      bottom: 20px;
      background: blue;
      opacity: 0.3;
      filter: alpha(opacity=30);
    }
    &__wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      /* центрирование */

      margin: auto;
      /* центрирование */

      height: 120px;
      width: 360px;
      border: 1px solid black;
      padding: 5px 5px 5px 55px;
      // background: url(https://js.cx/clipart/key.png) 3px 5px white no-repeat;
    }
  }
  // .row--selected {
  // }
</style>
