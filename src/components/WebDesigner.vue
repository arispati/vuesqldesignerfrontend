<template>
  <div>
  <div class="area" :class="{ 'area--adding': adding }" @click="clickArea"
    @mousedown="mousedownArea">
    <svg width="3000" height="3000">
      <template v-for="relation in relations">
        <relation :data="relation"></relation>
      </template>
      <!-- <path stroke="#000" stroke-width="2" fill="none" d="M 562 104 C 586 104 586 232 610 232"></path> -->
    </svg>
    <template v-for="table in tables">
      <db-table :locale="locale" @dblclickrow="expandRow" @clickrow="selectRow" v-on:clicktable="clickTable" v-on:tablemove="move" :data="table" :selection="selection"  @updaterowdata="updateRowData" @openModalDialog="openModalDialog"></db-table>
    </template>
    <rubberband :data="rubberband"></rubberband>
    <modal-keys-manager :locale="locale" @saveDataFromModalKeysManager=saveDataFromModalKeysManager @closeModalKeysManager=closeModalKeysManager :visible="modalKeysManager.visible" :table="oneTableSelected"></modal-keys-manager>
    <modal-dialog :locale="locale" :visible="modalDialog.visible" :data="modalDialog.data" @closeModalDialog="closeModalDialog" @saveDataFromModalDialog=saveDataFromModalDialog></modal-dialog>
    <modal-controls-dialog :localeOptions="localeOptions" :currentLocale="currentLocale" :locale="locale" :visible="modalControlsDialog.visible" :mode="modalControlsDialog.mode" :data="modalControlsDialog.data" @loadXML="loadXML" @setNewLocale="setNewLocale" @closeModalControlsDialog="closeModalControlsDialog"></modal-controls-dialog>
  </div>
  <div class="controls">
    <input class="btn btn-default" type="button" :value="locale['saveload']" @click="openModalControlsDialog"></input>
    <input class="btn btn-default" type="button" value="Default value" @click="preAdd" :value="dom.addtable.value">
        <input class="btn btn-default" type="button" :value="locale['edittable']" @click="openTableModalDialogByButton" :disabled="!oneTableSelected"></input>
    <input class="btn btn-default" type="button" :value="locale['removetable']"  @click="removeTables" :disabled="!tablesSelected">
    <input class="btn btn-default" type="button" :value="locale['cleartables']"  @click="clearTables">
    <input class="btn btn-default" type="button" value="Default value" @click="addRow" :value="dom.addrow.value">

    <input class="btn btn-default" type="button" :value="locale['editrow']" :disabled="!selectedRow" @click="expandSelectedRow"></input>

    <input class="btn btn-default small" type="button" :value="locale['uprow']" :disabled="upDisabled" @click="up"></input><input class="btn btn-default small" type="button" :value="locale['downrow']" :disabled="downDisabled" @click="down"></input>

    <input class="btn btn-default" type="button" :value="locale['removerow']" :disabled="!selectedRow" @click="deleteSelectedRow"></input>

    <input class="btn btn-default" type="button" value="Show Component Data" @click="showComponentData"></input>
    <hr>
    <input class="btn btn-default" type="button" value="Keys" @click="keys" :value="locale['tablekeys']" :disabled="!oneTableSelected"></input>

    <input class="btn btn-default" type="button" :value="dom.foreignconnect.value"  @click="foreignconnect" :disabled="!isUniqueRowSelected"></input>
    <input class="btn btn-default" type="button" :value="dom.foreigndisconnect.value"  @click="foreigndisconnect" :disabled="!allowDisconnect"></input>
    <input class="btn btn-default" type="button" :value="locale['options']" value="Options" @click="openModalOptionsDialog">
  </div>
</div>
</template>

<script>
import axios from 'axios'

import TableModel from '@/models/table.js'
import RelationModel from '@/models/relation.js'

import Table from '@/components/Table'
import RubberBand from '@/components/RubberBand'
import ModalKeysManager from '@/components/ModalKeysManager'
import ModalDialog from '@/components/ModalDialog'
import ModalControlsDialog from '@/components/ModalControlsDialog'
import Relation from '@/components/Relation'
import Fn from '@/functions.js'

import config from '@/config.js'

const API_BASE = 'http://websqldesignerserver'

export default {
  name: 'webdesigner',
  created () {
    console.log('webdesigner component created')
  //  axios.get(`${API_BASE}/backend/php-mysql/index.php`).then((response) => {
  //    console.log('HTTP response!!!')
  //    console.log(response)
  //  })
    //  get locale
    this.requestLanguage()

    axios({method: 'get', url: `${API_BASE}/corsbridge.php?db=mysql`}).then((xmlDoc) => {
      let xml = Fn.fromXMLText(xmlDoc.data)
      this.DATATYPES = xml.documentElement
      this.buildTypeSelect()
    })
  },
  data () {
    return {
      currentLocale: config.DEFAULT_LOCALE, // 'en'
      localeOptions: config.AVAILABLE_LOCALES,
      locale: {},
      creating: false,
      connecting: false,
      modalControlsDialog: {
        visible: false,
        data: this,
        mode: '' // 'options' || 'controls'
      },
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
      relations: [],
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
        },
        foreignconnect: {
          values: ['Connect foreign key', 'Click target row'],
          value: 'Connect foreign key'
        },
        foreigndisconnect: {
          value: 'Remove foreign key'
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
    allowDisconnect: function () {
      if (this.selectedRow) {
        let rels = this.selectedRow.relations
        for (let i = 0; i < rels.length; i++) {
          let r = rels[i]
          if (r.row2 === this.selectedRow) {
            return true
          }
        }
      }
      return false
    },
    isUniqueRowSelected: function () {
      if (this.selectedRow && this.selectedRow.isUnique()) {
        return true
      }
      return false
    },
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
    setNewLocale (val) {
      this.currentLocale = val
      this.requestLanguage()
    },
    requestLanguage () {
      axios({method: 'get', url: `${API_BASE}/corsbridge.php?locale=${this.currentLocale}`}).then((xmlDoc) => {
        if (xmlDoc) {
          let xml = Fn.fromXMLText(xmlDoc.data)
          let strings = xml.getElementsByTagName('string')
          for (let i = 0; i < strings.length; i++) {
            let n = strings[i].getAttribute('name')
            let v = strings[i].firstChild.nodeValue
            this.locale[n] = v
          }
        }
        this.dom.addtable = {
          values: [this.locale['addtable'], this.locale['addpending']],
          value: this.locale['addtable']
        }
        this.dom.addrow = {
          value: this.locale['addrow']
        }
        this.dom.foreignconnect = {
          values: [this.locale['foreignconnect'], this.locale['foreignconnectpending']],
          value: this.locale['foreignconnect']
        }
        this.dom.foreigndisconnect = {
          value: this.locale['foreigndisconnect']
        }
        // let xml = Fn.fromXMLText(xmlDoc.data)
        // this.DATATYPES = xml.documentElement
        // this.buildTypeSelect()
      })
    },
    getOption (name) {
      // let c = this.getCookie()
      // if (name in c) { return c[name] }
      /* defaults */
      switch (name) {
        case 'locale': return config.DEFAULT_LOCALE
        default: return null
      }
    },
    getTypeIndex (label) {
      if (!this.typeIndex) {
        this.typeIndex = {}
        let types = this.DATATYPES.getElementsByTagName('type')
        for (let i = 0; i < types.length; i++) {
          let l = types[i].getAttribute('label')
          if (l) { this.typeIndex[l] = i }
        }
      }
      return this.typeIndex[label]
    },
    getFKTypeFor (typeIndex) {
      if (!this.fkTypeFor) {
        this.fkTypeFor = {}
        let types = this.DATATYPES.getElementsByTagName('type')
        for (let i = 0; i < types.length; i++) {
          this.fkTypeFor[i] = i
          let fk = types[i].getAttribute('fk')
          if (fk) { this.fkTypeFor[i] = this.getTypeIndex(fk) }
        }
      }
      return this.fkTypeFor[typeIndex]
    },
    findNamedTable (name) {
      for (let i = 0; i < this.tables.length; i++) {
        if (this.tables[i].getTitle() === name) { return this.tables[i] }
      }
    },
    loadXML (xml) {
      console.log('---loadXML---')
      if (!xml) {
        alert('data is empty')
        return
      }
      this.fromXMLText(xml)
    },
    fromXMLText (xml) {
      console.log('---fromXMLText---')
      console.log(xml)
      let xmlDoc = Fn.fromXMLText(xml)
      if (xmlDoc === -1) {
        return
      }
      if (!xmlDoc || !xmlDoc.documentElement) {
        alert('Null document')
        return
      }
      console.log('---fromXMLText res---')
      console.log(xmlDoc)
      this.fromXML(xmlDoc.documentElement)
    },
    fromXML (node) {
      console.log('native fromXML started!!!')
      console.log(node)
      this.clearTables()
      let types = node.getElementsByTagName('datatypes')
      if (types.length) { this.DATATYPES = types[0] }
      let tables = node.getElementsByTagName('table')
      for (let i = 0; i < tables.length; i++) {
        let t = this.addTable('', 0, 0)
        t.fromXML(tables[i])
      }
      for (let i = 0; i < this.tables.length; i++) { /* ff one-pixel shift hack */
        this.tables[i].select()
        this.tables[i].deselect()
      }
      /* relations */
      let rs = node.getElementsByTagName('relation')
      for (let i = 0; i < rs.length; i++) {
        let rel = rs[i]
        var tname = rel.getAttribute('table')
        var rname = rel.getAttribute('row')
        let t1 = this.findNamedTable(tname)
        if (!t1) { continue }
        let r1 = t1.findNamedRow(rname)
        if (!r1) { continue }
        tname = rel.parentNode.parentNode.getAttribute('name')
        rname = rel.parentNode.getAttribute('name')
        let t2 = this.findNamedTable(tname)
        if (!t2) { continue }
        let r2 = t2.findNamedRow(rname)
        if (!r2) { continue }
        this.addRelation(r1, r2)
      }
    },
    toXML () {
      let xml = '<?xml version="1.0" encoding="utf-8" ?>\n'
      xml += '<!-- SQL XML created by WWW SQL Designer, https://github.com/ondras/wwwsqldesigner/ -->\n'
      xml += '<!-- Active URL: ' + location.href + ' -->\n'
      xml += '<sql>\n'
      /* serialize datatypes */
      if (window.XMLSerializer) {
        let s = new XMLSerializer()
        xml += s.serializeToString(this.DATATYPES)
      } else if (this.DATATYPES.xml) {
        xml += this.DATATYPES.xml
      }
      for (let i = 0; i < this.tables.length; i++) {
        xml += this.tables[i].toXML()
      }
      xml += '</sql>\n'
      return xml
    },
    raise (table) {
      let old = table.getZ()
      let max = this.getMaxZ()
      table.setZ(max)
      for (let i = 0; i < this.tables.length; i++) {
        let t = this.tables[i]
        if (t === table) { continue }
        if (t.getZ() > old) { t.setZ(t.getZ() - 1) }
      }
    },
    getMaxZ () {
      let max = 0
      for (let i = 0; i < this.tables.length; i++) {
        let z = this.tables[i].getZ()
        if (z > max) { max = z }
      }
      return max
    },
    foreigndisconnect () {
      console.log('foreigndisconnect')
      let rels = this.selectedRow.relations
      for (let i = rels.length - 1; i >= 0; i--) {
        let r = rels[i]
        if (r.row2 === this.selectedRow) { this.removeRelation(r) }
      }
      // for (let i = 0; i < rels.length; i++) {
      //   let r = rels[i]
      //   if (r.row2 === this.selectedRow) {
      //     return true
      //   }
      // }
    },
    foreignconnect () {
      console.log('foreignconnect')
      if (this.connecting) {
        this.endConnect()
        console.log('this.connecting = false')
        // console.log('this.connecting is?')
        // console.log(this.connecting)
      } else {
        console.log('this.connecting = true')
        // console.log('this.connecting is?')
        // console.log(this.connecting)
        this.connecting = true
        this.dom.foreignconnect.value = this.dom.foreignconnect.values[1]
      }
    },
    endConnect () {
      this.connecting = false
      this.dom.foreignconnect.value = this.dom.foreignconnect.values[0]
    },
    addRelation (row1, row2) {
      let r = new RelationModel(row1, row2)
      this.relations.push(r)
      return r
    },
    removeRelation (r) {
      let idx = this.relations.indexOf(r)
      if (idx === -1) { return }
      r.destroy()
      this.relations.splice(idx, 1)
    },
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
    closeModalControlsDialog () {
      this.modalControlsDialog.visible = false
    },
    openModalControlsDialog () {
      this.modalControlsDialog.visible = true
      this.modalControlsDialog.mode = 'controls'
    },
    openModalOptionsDialog () {
      this.modalControlsDialog.visible = true
      this.modalControlsDialog.mode = 'options'
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
      let sel = this.selection.slice(0)
      for (let i = 0; i < sel.length; i++) {
        // let index = this.tables.indexOf(this.selection[i])
        // this.tables.splice(index, 1)
        this.removeTable(sel[i])
      }
      this.selection = []
    },
    clearTables () {
      // this.selection = []
      // this.tables = []
      // this.relations = []
      while (this.tables.length) {
        this.removeTable(this.tables[0])
      }
    },
    removeTable (t) {
      this.selection = []
      this.selectedRow = false
      let idx = this.tables.indexOf(t)
      if (idx === -1) { return }
      t.destroy()
      this.tables.splice(idx, 1)
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
      // old variant
      // row.data.title = newdata.title
      // row.data.type = newdata.type
      // row.data.size = newdata.size
      // row.data.def = newdata.def
      // row.data.nll = newdata.nll
      // row.data.ai = newdata.ai
      // row.data.comment = newdata.comment
      row.update(newdata)
    },
    // select row
    // data - {row: row, table: this.data}
    selectRow (data) {
      console.log('Webdesigner component->selectRow')
      // relation connecting
      // if (this.connecting) {
      //   let r1 = this.selectedRow
      // }
      // console.log('rowclick')
      // find target row
      let row = data
      if (data) {
        let tIndex = this.tables.indexOf(data.table)
        let rIndex = this.tables[tIndex].rows.indexOf(data.row)
        row = this.tables[tIndex].rows[rIndex]
      }
      // relation connecting
      if (this.connecting) {
        let r1 = this.selectedRow
        let r2 = row
        if (r1 !== r2) {
          this.addRelation(r1, r2)
          this.endConnect()
        }
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
        this.raise(this.selection[i])
        // this.$set(this.selection[i], 'selected', true)
      }
    },
    addTable (name, x, y) {
      // let max = this.getMaxZ()
      // create new component
      let max = this.getMaxZ()
      let newtable = new TableModel({x: x, y: y, name: name, selected: false, owner: this, z: max + 1})
      // let r = newtable.addRow('id', {ai: true})
      // console.log('r')
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
        let r = newtable.addRow('id', {ai: true})
        let k = newtable.addKey('PRIMARY', '')
        k.addRow(r)
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
    'modal-dialog': ModalDialog,
    'modal-controls-dialog': ModalControlsDialog,
    'relation': Relation
  }
}
</script>

<style lang="less">
  /*
  * https://colorscheme.ru/#3v11Tw0w0w0w0
  */

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
    width: 160px;
    padding: 0px 5px 5px;
    padding-top: 5px;
    border: 1px solid #000;
    box-shadow: -4px 4px 8px #888;
    input {
      width: 90%;
      margin: auto;
      // background-color: #0A67A3;
      // color: #ffffff;
      margin-bottom: 3px;
    }
    .small {
      width: 44%;
      &:nth-of-type(odd) {
        margin-left: 1%;
      }
      &:nth-of-type(even) {
        margin-right: 1%;
      }
    }
  }

  // .controls__button {
  //
  // }
</style>
