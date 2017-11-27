<template>
  <div class="modal-window" v-show="visible">
    <div class="modal-window__inner">
    </div>
    <div class="modal-window__content">
      <form>
        Добро пожаловать!
        <table>
          <tr>
            <td>Логин</td>
            <td>
              <input>
            </td>
          </tr>
          <tr>
            <td>Пароль</td>
            <td>
              <input>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <input type="submit" value="Войти">
              <input type="submit" value="Отмена" @click="cancel">
            </td>
          </tr>
        </table>

      </form>
  </div>
  </div>
</template>
<script>

export default {
  name: 'db-row',
  props: ['visible'],
  created () {
  },
  data () {
    return {
    }
  },
  methods: {
    cancel () {
      console.log('cancel')
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
    &__content {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      /* центрирование */

      margin: auto;
      /* центрирование */

      height: 120px;
      width: 300px;
      border: 1px solid black;
      padding: 5px 5px 5px 55px;
      // background: url(https://js.cx/clipart/key.png) 3px 5px white no-repeat;
    }
  }
  // .row--selected {
  // }
</style>
