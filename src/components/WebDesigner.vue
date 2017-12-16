<template>
  <div>
  <div class="area" :class="{ 'area--adding': adding }" @click="clickArea"
    @mousedown="mousedownArea">
    <svg width="3000" height="3000">
      <path stroke="#000" stroke-width="2" fill="none" d="M 562 104 C 586 104 586 232 610 232"></path>
    </svg>
    <template v-for="table in tables">
      <db-table @dblclickrow="expandRow" @clickrow="selectRow" v-on:clicktable="clickTable" v-on:tablemove="move" :data="table" :selection="selection"  @updaterowdata="updateRowData" @openModalDialog="openModalDialog"></db-table>
    </template>
    <rubberband :data="rubberband"></rubberband>
    <modal-keys-manager @saveDataFromModalKeysManager=saveDataFromModalKeysManager @closeModalKeysManager=closeModalKeysManager :visible="modalKeysManager.visible" :table="oneTableSelected"></modal-keys-manager>
    <modal-dialog :visible="modalDialog.visible" :data="modalDialog.data" @closeModalDialog="closeModalDialog" @saveDataFromModalDialog=saveDataFromModalDialog></modal-dialog>
  </div>
  <div class="controls">
    <input class="btn btn-default" type="button" value="Default value" @click="preAdd" :value="dom.addtable.value">
    <input class="btn btn-default" type="button" value="remove table"  @click="removeTables" :disabled="!tablesSelected">
    <input class="btn btn-default" type="button" value="clear tables"  @click="clearTables">
    <input class="btn btn-default" type="button" value="Default value" @click="addRow" :value="dom.addrow.value">

    <input class="btn btn-default" type="button" value="Edit field" :disabled="!selectedRow" @click="expandSelectedRow"></input>

    <input class="btn btn-default" type="button" value="up" :disabled="upDisabled" @click="up"></input>
    <input class="btn btn-default" type="button" value="down" :disabled="downDisabled" @click="down"></input>

    <input class="btn btn-default" type="button" value="Delete field" :disabled="!selectedRow" @click="deleteSelectedRow"></input>

    <input class="btn btn-default" type="button" value="Show Component Data" @click="showComponentData"></input>
    <hr>
    <input class="btn btn-default" type="button" value="Keys" @click="keys" :disabled="!oneTableSelected"></input>
    <input class="btn btn-default" type="button" value="Edit table" @click="openTableModalDialogByButton" :disabled="!oneTableSelected"></input>




  </div>
</div>
</template>

<script>
import axios from 'axios'

import TableModel from '@/models/table.js'

import Table from '@/components/Table'
import RubberBand from '@/components/RubberBand'
import ModalKeysManager from '@/components/ModalKeysManager'
import ModalDialog from '@/components/ModalDialog'
import Fn from '@/functions.js'

const API_BASE = 'http://websqldesignerserver'

export default {
  name: 'webdesigner',
  created () {
    console.log('webdesigner component created')
  //  axios.get(`${API_BASE}/backend/php-mysql/index.php`).then((response) => {
  //    console.log('HTTP response!!!')
  //    console.log(response)
  //  })
    axios({method: 'get', url: `${API_BASE}/corsbridge.php?db=mysql`}).then((xmlDoc) => {
      let xml = Fn.fromXMLText(xmlDoc.data)
      this.DATATYPES = xml.documentElement
      this.buildTypeSelect()
    })
  },
  data () {
    return {
      modalDialog: {
        visible: false,
        data: {newrowdata: false}
      },
      modalKeysManager: {
        visible: false,
        table: new TableModel({x: 0, y: 0, name: '', selected: false, owner: this})
      },
      selectDataTypes: false,
      DATATYPES: false, // datatypes for DB
      tables: [], // array of all tables (each table is a vue-component)
      selection: [],
      selectedRow: false, // selected row
      adding: false, // add table mode
      dom: {
        addtable: {
          values: ['Add table', 'Place table'],
          value: 'Add table'
        },
        addrow: {
          value: 'Add field'
        }
      },
      // rubberband info
      rubberband: {
        x: 0,
        y: 0,
        x0: 0,
        y0: 0,
        width: 0,
        height: 0,
        dragged: false,
        visibility: 'hidden'
      },
      webdesigner: 'this is web designer component'
    }
  },
  computed: {
    tablesSelected: function () {
      if (this.selection.length >= 1) {
        return true
      }
      return false
    },
    oneTableSelected: function () {
      if (this.selection.length === 1) {
        return this.selection[0]
      }
      return false
    },
    upDisabled: function () {
      if (!this.selectedRow) {
        return true
      }
      let table = this.selectedRow.owner
      let index = table.rows.indexOf(this.selectedRow)
      return index === 0
    },
    downDisabled: function () {
      if (!this.selectedRow) {
        return true
      }
      let table = this.selectedRow.owner
      let index = table.rows.indexOf(this.selectedRow)
      return index === (table.rows.length - 1)
    }
  },
  methods: {
    closeModalKeysManager () {
      this.modalKeysManager.visible = false
    },
    saveDataFromModalKeysManager (data) {
      // сначала просто грохаем все записи, касающиеся ключей для текущей таблицы
      console.log('=====================')
      console.log(data)
      console.log('=====================')
      let selectedTable = data.table
      // erase all previous keys from table
      // удаляем все ключи из таблицы , это действие необязательно приведет к полному удалению объекта ключа,
      // вполне возможно, что ссылка на ключ сохранится в массивах компонента ModalKeysManager (имеются ввиду массивы localKeys и localRows)
      // кстати ссылка на эти массивы так же передается параметром, поэтому часть ключей, ссылки на которые удалены из таблицы, НО при этом
      // ссылки на эти ключи опять приходят из параметра data - будут добавлены снова.
      // те ключи, сслыки на объекты которых будут удалены и из таблицы и из массивов компонента ModalKeysManager - будут удалены навсегда
      console.log(selectedTable)
      // просто грохаем ВСЕ ссылки на ключи таблицы
      selectedTable.keys = []
      // затем чистим ключи из всех строк таблиц
      for (let i = 0; i < selectedTable.rows.length; i++) {
        let row = selectedTable.rows[i]
        row.keys = []
      }
      // а теперь копируем информацию о ключах из пришедшего параметра
      // сначала идем по ключам
      for (let i = 0; i < data.keys.length; i++) {
        let currentKey = data.keys[i]
        let key = data.keys[i].key
        key.rows = currentKey.rows
        key.type = currentKey.type
        key.name = currentKey.name
        // ссылка на row ВСЕГДА указывают на реальные строки, поэтому можно просто сделать вот так
        for (let j = 0; j < currentKey.rows.length; j++) {
          currentKey.rows[j].keys.push(key)
        }
        selectedTable.keys.push(key)
      }
    },
    openModalDialog (data) {
      this.modalDialog.data = data
      this.modalDialog.visible = true
      // rowdata == {newrowdata: actualData, row: this.data, mode: 'row'}
      console.log('openModalDialog')
    },
    openTableModalDialogByButton () {
      console.log('openTableModalDialogByButton')
      let newtabledata = {title: this.selection[0].data.title, comment: this.selection[0].data.comment}
      this.openModalDialog({newtabledata: newtabledata, table: this.selection[0], mode: 'table'})
    },
    closeModalDialog () {
      this.modalDialog.visible = false
    },
    keys () {
      console.log('keys')
      // open modal dialog for keys modalKeysManager
      this.modalKeysManager.visible = true
    },
    showComponentData () {
      console.log('showComponentData')
      console.log(this.tables)
    },
    // build typeSelect method located here
    buildTypeSelect () {
      let selectDataTypes = []
      let gs = this.DATATYPES.getElementsByTagName('group')
      for (let i = 0; i < gs.length; i++) {
        let og = { options: [] }
        let g = gs[i]
        og.backgroundColor = g.getAttribute('color') || '#fff'
        og.label = g.getAttribute('label')
        let ts = g.getElementsByTagName('type')
        for (let j = 0; j < ts.length; j++) {
          let t = ts[j]
          let o = {}
          if (t.getAttribute('color')) { o.backgroundColor = t.getAttribute('color') }
          if (t.getAttribute('note')) { o.title = t.getAttribute('note') }
          o.innerHTML = t.getAttribute('label')
          og.options.push(o)
        }
        selectDataTypes.push(og)
      }
      this.selectDataTypes = selectDataTypes
      console.log(gs)
      console.log(selectDataTypes)
    },
    removeSelection () {
      let sel = (window.getSelection ? window.getSelection() : document.selection)
      if (!sel) { return }
      if (sel.empty) { sel.empty() }
      if (sel.removeAllRanges) { sel.removeAllRanges() }
    },
    // rubberband methods
    mousedownArea (e) {
      let x = e.clientX + window.pageXOffset
      let y = e.clientY + window.pageYOffset
      this.rubberband.x = this.rubberband.x0 = x
      this.rubberband.y = this.rubberband.y0 = y
      this.rubberband.width = 0
      this.rubberband.height = 0
      document.addEventListener('mousemove', this.mousemoveArea)
      document.addEventListener('mouseup', this.mouseupArea)
      console.log('WebDesigner component->mousedownArea')
    },
    mousemoveArea (e) {
      this.removeSelection()
      // if condition is true - mousedown event called
      // if (this.rubberband.visibility === 'visible') {
      if (this.rubberband.visibility === 'hidden') {
        this.rubberband.visibility = 'visible'
      }
      this.rubberband.dragged = true
      let x = e.clientX + window.pageXOffset
      let y = e.clientY + window.pageYOffset
      this.rubberband.width = Math.abs(x - this.rubberband.x0)
      this.rubberband.height = Math.abs(y - this.rubberband.y0)
      if (x < this.rubberband.x0) { this.rubberband.x = x } else { this.rubberband.x = this.rubberband.x0 }
      if (y < this.rubberband.y0) { this.rubberband.y = y } else { this.rubberband.y = this.rubberband.y0 }
      console.log('WebDesigner component->mousemoveArea')
      // console.log('mousemove area')
    },
    mouseupArea () {
      // preventEvent?
      this.rubberband.visibility = 'hidden'
      this.selectRect(this.rubberband.x, this.rubberband.y, this.rubberband.width, this.rubberband.height)
      // console.log('mouseup area')
      document.removeEventListener('mousemove', this.mousemoveArea)
      document.removeEventListener('mouseup', this.mouseupArea)
      console.log('WebDesigner component->mouseupArea')
    },
    selectRect (x, y, width, height) {
      this.selection = []
      let tables = this.tables
      let x1 = x + width
      let y1 = y + height
      for (let i = 0; i < tables.length; i++) {
        let t = tables[i]
        let tx = t.x
        let tx1 = t.x + t.width
        let ty = t.y
        let ty1 = t.y + t.height
        if (((tx >= x && tx < x1) || (tx1 >= x && tx1 < x1) || (tx < x && tx1 > x1)) &&
         ((ty >= y && ty < y1) || (ty1 >= y && ty1 < y1) || (ty < y && ty1 > y1))) {
          this.selection.push(t)
        }
      }
      this.processSelection()
    },
    move (param) {
      for (let i = 0; i < param.length; i++) {
        this.selection[i].x = param[i].x
        this.selection[i].y = param[i].y
      }
    },
    clickTable (table, multi, newSelect) {
      console.log('Webdesigner component->clickTable')
      if (newSelect) {
        this.selectRow(false)
      }
      // console.log('Table Click')
      // this.selectRow(false)
      this.select(table, multi)
    },
    removeTables () {
      for (let i = 0; i < this.selection.length; i++) {
        let index = this.tables.indexOf(this.selection[i])
        this.tables.splice(index, 1)
      }
      this.selection = []
    },
    clearTables () {
      this.selection = []
      this.tables = []
    },
    up () {
      let table = this.selectedRow.owner
      let index = table.rows.indexOf(this.selectedRow)
      table.rows.splice(index, 1)
      table.rows.splice(index - 1, 0, this.selectedRow)
    },
    down () {
      let table = this.selectedRow.owner
      let index = table.rows.indexOf(this.selectedRow)
      table.rows.splice(index, 1)
      table.rows.splice(index + 1, 0, this.selectedRow)
    },
    // expand row
    expandRow (data) {
      console.log('Webdesigner component->expandRow')
      // let row = data.row
      // let table = row.owner
      data.row.expand()
    },
    expandSelectedRow () {
      this.selectedRow.expand()
    },
    deleteSelectedRow () {
      let table = this.selectedRow.owner
      table.removeRow(this.selectedRow)
      // let index = table.rows.indexOf(this.selectedRow)
      // table.rows.splice(index, 1)
      this.selectedRow = false
      // console.log(table.rows.indexOf(this.selectedRow))
    },
    saveDataFromModalDialog (data) {
      if (data.mode && data.mode === 'row') {
        this.updateRowData(data)
      } else {
        data.table.data.title = data.newtabledata.title
        data.table.data.comment = data.newtabledata.comment
      }
    },
    updateRowData (rowdata) {
      console.log('=========rowdata updated!========')
      console.log(rowdata)
      console.log('======================')
      // find row
      let tIndex = this.tables.indexOf(rowdata.row.owner)
      let rIndex = this.tables[tIndex].rows.indexOf(rowdata.row)
      let row = this.tables[tIndex].rows[rIndex]
      this.setNewDataToRow(row, rowdata.newrowdata)
    },
    setNewDataToRow (row, newdata) {
      row.data.title = newdata.title
      row.data.type = newdata.type
      row.data.size = newdata.size
      row.data.def = newdata.def
      row.data.nll = newdata.nll
      row.data.ai = newdata.ai
      row.data.comment = newdata.comment
      // console.log('NEW COMMENT IS: ')
      // console.log(row.data.comment)
    },
    // select row
    selectRow (data) {
      console.log('Webdesigner component->selectRow')
      // console.log('rowclick')
      let row = data
      if (data) {
        let tIndex = this.tables.indexOf(data.table)
        let rIndex = this.tables[tIndex].rows.indexOf(data.row)
        row = this.tables[tIndex].rows[rIndex]
      }
      if (this.selectedRow === row) { return }
      if (this.selectedRow) { this.selectedRow.deselect() }
      this.selectedRow = row
      if (this.selectedRow) { this.selectedRow.select() }
    },
    // select table
    select (table, multi) {
      console.log('Webdesigner component->select (selectTable)')
      if (table) {
        if (multi) {
          // let i = this.selection.indexOf(table)
          // if (i < 0) {
          //   this.selection.push(table)
          // } else {
          //   this.selection.splice(i, 1)
          // }
        } else {
          if (this.selection.length <= 1 && this.selection[0] === table) {
            console.log('this.selection[0] === table')
            return
          }
          this.selection = [table]
        }
      } else {
        this.selection = []
      }
      this.processSelection()
    },
    processSelection () {
      for (let i = 0; i < this.tables.length; i++) {
        this.tables[i].selected = false
        // this.$set(this.tables[i], 'selected', false)
      }
      for (let i = 0; i < this.selection.length; i++) {
        this.selection[i].selected = true
        // this.$set(this.selection[i], 'selected', true)
      }
    },
    addTable (name, x, y) {
      // let max = this.getMaxZ()
      // create new component
      let newtable = new TableModel({x: x, y: y, name: name, selected: false, owner: this})
      let r = newtable.addRow('id', {ai: true})
      // console.log('r')
      console.log(r)

      this.tables.push(newtable)
      return newtable
    },
    // Add table button clicked
    preAdd () {
      let addtable = this.dom.addtable
      if (this.adding) {
        this.adding = false
        addtable.value = addtable.values[0]
      } else {
        this.adding = true
        addtable.value = addtable.values[1]
      }
    },
    // Add row button clicked
    addRow () {
      // console.log('AddRow')
      this.selection[0].addRow('newrow')
    },
    clickArea (e) {
      console.log('WebDesigner component->clickArea')
      if (this.rubberband.dragged) {
        this.rubberband.dragged = false
        return
      }
      let addtable = this.dom.addtable
      let newtable = false
      if (this.adding) {
        this.adding = false
        addtable.value = addtable.values[0]
        let x = e.clientX + window.pageXOffset
        let y = e.clientY + window.pageYOffset
        newtable = this.addTable('newtable', x, y)

        // setTimeout(() => {
        //   // console.log(this.tables[0])
        //   // this.tables[0].name = 'muahaa'
        //   // console.log(this.tables[0].name)
        //   // this.tables[0] = {x: 10, y: 10, name: 'azazaz'}
        //   // let newtable = {x: 65, y: 5, name: 'azazaz'}
        //   // this.tables.$set(0, { childMsg: 'Changed!'})
        //   this.$set(this.tables[0], 'name', 'igogo')
        //   // this.tables.splice(0, 1, newtable)
        // }, 1500)
      }
      this.select(newtable)
      this.selectRow(false)
    }
  },
  components: {
    'db-table': Table,
    'rubberband': RubberBand,
    'modal-keys-manager': ModalKeysManager,
    'modal-dialog': ModalDialog
  }
}
</script>

<style lang="less">
  .area {
    position: relative;
    background: transparent url(../assets/back.png);
    width: 3000px;
    height: 3000px;
  }

  .area--adding {
    cursor: crosshair;
  }

  .controls {
    text-align: center;
    background-color: #ccc;
    position: fixed;
    top: 0px;
    right: 0px;
    width: 150px;
    padding: 0px 5px 5px;
  }
</style>
