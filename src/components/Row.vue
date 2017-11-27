<template>
  <tbody class="table__row" :class="{ 'table__row--expanded': data.expanded }" @click="clickRow" @mousedown.stop="mousedownRow">

      <tr v-show="data.expanded">
        <td>
          Name:
        </td>
        <td>
          <input v-model="title" type="text"></input>
        </td>
      </tr>
      <tr v-show="data.expanded">
        <td>
          Type:
        </td>
        <td>
          <select v-model="type">
            <optgroup v-for="optgroup in data.owner.owner.selectDataTypes" :label=optgroup.label :style="{'background-color' : optgroup.backgroundColor}">
              <option v-for="option in optgroup.options">{{option.innerHTML}}</option>
            </optgroup>
          </select>
        </td>
      </tr>

      <tr v-show="!data.expanded" @dblclick.stop="dblclickRow">
        <td :class="{ 'table__row-title--selected': data.selected }" class="table__row-title table__row-title--primary table__row-title--key">
          <div>{{data.data.title}}</div>
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
    console.log('localData')
    console.log(this.localData)
  },
  data () {
    return {
      // https://stackoverflow.com/questions/40408096/whats-the-correct-way-to-pass-props-as-initial-data-in-vue-js-2
      // https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
      // localData: this.data // Object.assign({}, this.data)
      type: this.data.data.type,
      title: this.data.data.title
    }
  },
  // computed: {
  //   test: {
  //     cache: false,
  //     get () {
  //       console.log('watcherLocData!!')
  //       return this.localData.data.title + ' ' + this.localData.data.type
  //     }
  //   }
  // },
  watch: {
    type: function (val) {
      this.updateData()
    },
    title: function (val) {
      this.updateData()
    }
  },
  methods: {
    extractActualData () {
      let actualData = {}
      actualData.title = this.title
      actualData.type = this.type
      return actualData
    },
    updateData () {
      // console.log('updateData')
      // console.log('row data: ')
      // console.log(this.data)
      let actualData = this.extractActualData()
      this.$emit('updaterowdata', {newrowdata: actualData, row: this.data})
    },
    clickRow () {
      console.log('Row component->clickRow {emit "clickrow"}')
      this.$emit('clickrow', this.data)
      // at this point parent method called
    },
    dblclickRow () {
      console.log('Row component->dblclickRow {emit "dblclickrow"}')
      this.$emit('dblclickrow', this.data)
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
