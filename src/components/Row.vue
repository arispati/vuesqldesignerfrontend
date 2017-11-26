<template>
  <tbody class="table__row" :class="{ 'table__row--expanded': data.expanded }" @click="clickRow" @mousedown.stop="mousedownRow">
      <tr v-show="data.expanded">
        <td>ZZZ ZZZ ZZZ
        </td>
      </tr>
      <tr v-show="!data.expanded">
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
      console.log('Row component->clickRow {emit "clickrow"}')
      this.$emit('clickrow', this.data)
      // at this point parent method called
    },
    mousedownRow () {
      console.log('Row component->mousedownRow')
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
