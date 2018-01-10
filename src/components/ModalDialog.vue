<template>
  <div class="modal-window modal-window--simple" :class="{ 'modal-window--edittablecomment': data.mode === 'table', 'modal-window--editfieldcomment': data.mode !== 'table' }" v-show="visible" @click.stop="emptyHandler" @mousedown.stop="emptyHandler" @mouseup.stop="emptyHandler">
    <div class="modal-window__inner">
    </div>
    <div class="modal-window__wrapper">
      <div class="modal-window__title">
        <p v-show="data.mode === 'table'">{{locale['edittable']}}</p>
        <p v-show="data.mode !== 'table'">{{locale['commenttext']}}</p>
      </div>
      <div class="modal-window__content">
        <form class="form-inline">
          <div class="form-group">
            <label v-show="data.mode === 'table'">{{locale['tablenamelabel']}}</label>
            <input class="form-control" type="text" v-model="title" v-show="data.mode === 'table'"></input>
          </div>
          <div class="form-group">
            <label v-show="data.mode === 'table'">{{locale['tablecommentlabel']}}</label>
            <textarea class="form-control" v-model="comment"></textarea>
          </div>
          <div class="form-group">
            <input type="submit" class="btn btn-default btn-primary" value="ok" :value="locale['windowok']" @click="ok">
            <input type="submit" class="btn btn-default" value="Отмена" :value="locale['windowcancel']" @click="cancel">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'modal-dialog',
  props: ['data', 'visible', 'locale'], // row || table mode AND data == {newrowdata: actualData, row: this.data, mode: 'row'}
  created () {
  },
  data () {
    // console.log('===============')
    // console.log(this.data)
    // console.log(this.visible)
    // console.log('===============')
    return {
      // dialogdata: this.data,
      title: '',
      comment: ''// this.data.newrowdata.comment
    }
  },
  watch: {
    visible: function () {
      if (this.visible) {
        if (this.data.mode === 'row') {
          this.comment = this.data.newrowdata.comment
        } else {
          this.comment = this.data.newtabledata.comment
          this.title = this.data.newtabledata.title
        }
      }
    }
  },
  methods: {
    emptyHandler () {},
    ok () {
      // Какой-то метод сохранения либо строки, либо столбца this.$emit('saveDataFromModalKeysManager', {rows: this.localRows, keys: this.localKeys, table: this.table})
      if (this.data.mode === 'row') {
        this.data.newrowdata.comment = this.comment // ???????????????????????????? is it OK?
      } else {
        this.data.newtabledata.comment = this.comment
        this.data.newtabledata.title = this.title
      }
      // this.data.newrowdata.title = 'vzhuh'
      this.$emit('saveDataFromModalDialog', this.data)
      this.$emit('closeModalDialog')
    },
    cancel () {
      this.$emit('closeModalDialog')
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

  .modal-window.modal-window--edittablecomment {
    .modal-window__wrapper {
      height: 180px;
      background-color: #ffffff;
      border-radius: 10px;
      border: 2px solid black;
      box-shadow: 4px 4px 8px #888;
      label {
        width: 100px;
      }
      input, textarea {
        margin-bottom: 5px;
      }
    }
  }

  .modal-window.modal-window--editfieldcomment {
    .modal-window__wrapper {
      width: 250px;
      height: 140px;
      background-color: #ffffff;
      border-radius: 10px;
      border: 2px solid black;
      box-shadow: 4px 4px 8px #888;
      label {
        width: 100px;
      }
      input, textarea {
        margin-bottom: 5px;
      }
    }
  }
  // .row--selected {
  // }
</style>
