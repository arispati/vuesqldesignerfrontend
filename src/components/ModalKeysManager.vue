<template>
  <div class="modal-window" v-show="visible">
    <div class="modal-window__inner">
    </div>
    <div class="modal-window__wrapper">
      <div class="modal-window__title">
        <p>Keys</p>
      </div>
      <div class="modal-window__content">
        <fieldset>
          <legend>Keys in table ...</legend>
          <select :disabled="!keyExists">
            <option>1: PRIMARY</option>
          </select>
          <input type="button" value="Add key"></input>
          <input type="button" value="Remove key" :disabled="!keyExists"></input>
        </fieldset>
        <fieldset></fieldset>
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
  updated () {
    console.log('updated method run, now we can copy params to local data')
    console.log(this.table.rows)
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
  },
  data () {
    return {
      localKeys: [], // [{key: keys[i], localRows: [row,row,row], type: type, name: name}, {...}, ...]
      localRows: [] // [{row: rows[i], localKeys: [key,key,key]}, {...}, ...]
    }
  },
  computed: {
    keyExists: function () {
      if (this.localKeys.length === 1) {
        return true
      }
      return false
    }
  },
  methods: {
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
