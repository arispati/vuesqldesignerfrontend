<template>
  <div class="modal-window" v-show="visible" @click.stop="emptyHandler" @mousedown.stop="emptyHandler" @mouseup.stop="emptyHandler">
    <div class="modal-window__inner">
    </div>
    <div class="modal-window__wrapper">
      <div class="modal-window__title">
        <p>Controls</p>
      </div>
      <div class="modal-window__content">
        <div class="modal-controls">
          <textarea v-model="io"></textarea>
          <input type="submit" value="ok" @click="ok">
          <input type="submit" value="Отмена" @click="cancel">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modal-controls-dialog',
  props: ['data', 'visible'], // row || table mode AND data == {newrowdata: actualData, row: this.data, mode: 'row'}
  created () {
  },
  data () {
    return {
      // dialogdata: this.data,
      io: ''
    }
  },
  watch: {
    visible: function () {
      if (this.visible) {
        console.log('modal controls dialog is visible')
      }
    }
  },
  methods: {
    emptyHandler () {},
    ok () {
      this.$emit('closeModalControlsDialog')
    },
    cancel () {
      this.$emit('closeModalControlsDialog')
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

  .modal-controls textarea {
    width: 650px;
    height: 200px;
  }
  // .row--selected {
  // }
</style>
