<template>
  <tbody class="table__row" @click="clickRow" @mousedown.stop="mousedownRow">
      <tr>
        <td :class="{ 'table__row-title--selected': data.selected }" class="table__row-title table__row-title--primary table__row-title--key">
          <div>row text</div>
        </td>
        <td>
          <td class="table__row-typehint"></td>
        </td>
      </tr>
  </tbody>
</template>
<script>

export default {
  name: 'db-row',
  props: ['data'],
  created () {
    // console.log('row component created')
  },
  data () {
    return {
      title: ''
    }
  },
  methods: {
    clickRow () {
      console.log('Row component template -> onclick -> Row component:method->clickRow {emit "clickrow"}')
      this.$emit('clickrow', this.data)
      // at this point parent method called
    },
    mousedownRow () {

    }
  }
}
</script>

<style lang="less">
  .table__row {
    font-weight: bold;
  }
  .table__row-title {
    div {
      position: relative;
    }
    div::before {
      position: absolute;
      content: '';
    }
    &--selected {
      div {
        padding-left: 20px;
      }
      div::before {
        left: 5px;
        // bottom: 0px;
        // content: "\00BB";
        content: "\2714";
      }
    }
  }

  // .row--selected {
  // }
</style>
