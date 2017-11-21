<template>
  <tbody class="table__row">
      <tr>
        <td class="table__row-title">
          <div class="table__row-title--primary table__row-title--key">row text</div>
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
    console.log('row component created')
  },
  data () {
    return {
      title: ''
    }
  },
  methods: {}
}
</script>

<style lang="less">
  .table__row {
    font-weight: bold;
  }
  // .row--selected {
  // }
</style>
