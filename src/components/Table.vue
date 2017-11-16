<template>
<div class="table" :style="{ left: data.x + 'px', top: data.y + 'px'}" :x="data.x" :y="data.y"  @click="tableClick">
  <table>
    <thead>
      <tr>
        <td class="table__title" colspan="2">{{data.name}}</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="table__title table__title--primary table__title--key">id</div>
        </td>
        <td>
          <td class="table__typehint"></td>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<script>

export default {
  name: 'db-table',
  props: ['data'],
  created () {
    console.log('table component created')
  },
  data () {
    return {
      addingTable: true
    }
  },
  methods: {
    tableClick () {
      //
      this.$emit('tableclick', this.data)
      console.log('end click table')
      // at this point parent method called
    }
  }
}
</script>

<style lang="less">
  .table {
    width: auto; // overwrite bootstrap rule
    position: absolute;
  	border: 1px solid #000;
  	background-color: #ddd;
  	cursor: pointer;
  	box-shadow: 4px 4px 8px #888; /* Opera 10.5, IE 9.0 */
  	border-radius: 3px;
  }

  .table table {
	  border-collapse: collapse;
  }
</style>
