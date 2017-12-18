<template>
  <tbody class="table__row" :class="{ 'table__row--expanded': data.expanded }" @click="clickRow" @mousedown.stop="mousedownRow" >

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
              <option v-for="(option, index) in optgroup.options" :value="index">{{option.innerHTML}}</option>
            </optgroup>
          </select>
        </td>
      </tr>
      <tr v-show="data.expanded">
        <td>
          Size:
        </td>
        <td>
          <input v-model="size" type="text"></input>
        </td>
      </tr>
      <tr v-show="data.expanded">
        <td>
          Default:
        </td>
        <td>
          <input v-model="def" type="text"></input>
        </td>
      </tr>
      <tr v-show="data.expanded">
        <td>
          Autoincrement:
        </td>
        <td>
          <input type="checkbox" v-model="ai">
        </td>
      </tr>
      <tr v-show="data.expanded">
        <td>
          NULL:
        </td>
        <td>
          <input type="checkbox" v-model="nll">
        </td>
      </tr>
      <tr v-show="data.expanded">
        <td>
          {{data.data.comment}}
        </td>
        <td>
          <button @click.stop="editComment">Edit comment</button>
        </td>
      </tr>
      <tr v-show="!data.expanded" @dblclick.stop="dblclickRow">
        <td :class="{ 'table__row-title--selected': data.selected, 'table__row-title--key' : isKey, 'table__row-title--primary' : isPrimary }" class="table__row-title">
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
  props: ['data', 'expanded'],
  created () {
    // console.log('row component created')
    console.log('localData')
    console.log(this.localData)
  },
  mounted: function () {
    this.data.dom.container = this.$el
  },
  data () {
    return {
      // https://stackoverflow.com/questions/40408096/whats-the-correct-way-to-pass-props-as-initial-data-in-vue-js-2
      // https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
      // localData: this.data // Object.assign({}, this.data)
      type: this.data.data.type,
      title: this.data.data.title,
      size: this.data.data.size,
      def: this.data.data.def,
      nll: this.data.data.nll,
      ai: this.data.data.ai,
      comment: this.data.data.comment
    }
  },
  computed: {
    isKey () {
      if (this.data.isKey() && !this.data.isPrimary()) {
        return true
      }
      return false
    },
    isPrimary () {
      if (this.data.isPrimary()) {
        return true
      }
      return false
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
    expanded: function () {
      if (this.expanded) {
        this.title = this.data.data.title
        this.size = this.data.data.size
        this.type = this.data.data.type
        this.def = this.data.data.def
        this.nll = this.data.data.nll
        this.ai = this.data.data.ai
        this.comment = this.data.data.comment
      }
    },
    type: function (val) {
      this.updateData()
    },
    title: function (val) {
      this.updateData()
    },
    size: function (val) {
      this.updateData()
    },
    def: function (val) {
      this.updateData()
    },
    nll: function (val) {
      this.updateData()
    },
    ai: function (val) {
      this.updateData()
    }
  },
  methods: {
    extractActualData () {
      let actualData = {}
      actualData.title = this.title
      actualData.type = this.type
      actualData.size = this.size
      actualData.def = this.def
      actualData.nll = this.nll
      actualData.ai = this.ai
      actualData.comment = this.comment
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
    },
    editComment () {
      let actualData = this.extractActualData()
      this.$emit('openModalDialog', {newrowdata: actualData, row: this.data, mode: 'row'})
    }
  }
}
</script>

<style lang="less">
  .table__row {
    // font-weight: bold;
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
    &--primary {
      font-weight: 700
    }
    &--key {
      font-style: italic
    }
  }

  // .row--selected {
  // }
</style>
