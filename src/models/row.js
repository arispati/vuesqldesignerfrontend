import Fn from '@/functions.js'

export default class Row {
  constructor (owner, title, data) {
    this.owner = owner
    this.selected = false
    this.expanded = false
    this.data = {}
    this.data.title = title
    this.data.type = 0
    this.data.size = ''
    this.data.def = null
    this.data.nll = true
    this.data.ai = false
    this.data.comment = ''
    this.keys = []
    this.relations = []
    this.dom = {
      container: ''
    }
    if (data) { this.update(data) }
    this.id = Math.random() // DONT FORGET TO FIX THIS!!!
  }
  getTitle () {
    return this.data.title
  }
  update (data) {
    if (data.nll && data.def && data.def.match(/^null$/i)) { data.def = null }
    for (var p in data) { this.data[p] = data[p] }
    if (!this.data.nll && this.data.def === null) { this.data.def = '' }
  }
  select () {
    if (this.selected) { return }
    this.selected = true
  }
  deselect () {
    if (!this.selected) { return }
    this.selected = false
    this.collapse()
  }
  expand () {
    if (this.expanded) { return }
    this.expanded = true
  }
  collapse () {
    if (!this.expanded) { return }
    this.expanded = false
  }
  addRelation (r) {
    this.relations.push(r)
  }
  removeRelation (r) {
    let idx = this.relations.indexOf(r)
    if (idx === -1) { return }
    this.relations.splice(idx, 1)
  }
  addKey (k) {
    this.keys.push(k)
  }
  removeKey (k) {
    let idx = this.keys.indexOf(k)
    if (idx === -1) { return }
    this.keys.splice(idx, 1)
  }
  destroy () {
    for (let i = 0; i < this.keys.length; i++) {
      this.keys[i].removeRow(this)
    }
  }
  isPrimary () {
    for (let i = 0; i < this.keys.length; i++) {
      let k = this.keys[i]
      if (k.getType() === 'PRIMARY') { return true }
    }
    return false
  }
  isUnique () {
    for (let i = 0; i < this.keys.length; i++) {
      let k = this.keys[i]
      let t = k.getType()
      if (t === 'PRIMARY' || t === 'UNIQUE') { return true }
    }
    return false
  }
  isKey () {
    return this.keys.length > 0
  }
  getDataType () {
    let type = this.data.type
    console.log('TYPE IS')
    console.log(type)
    let elm = this.owner.owner.DATATYPES.getElementsByTagName('type')[type]
    console.log('DATATYPES')
    console.log(this.owner.owner.DATATYPES)
    return elm
  }
  toXML () {
    let xml = ''
    let title = this.getTitle().replace(/"/g, '&quot;')
    let nn = (this.data.nll ? '1' : '0')
    let ai = (this.data.ai ? '1' : '0')
    xml += '<row name="' + title + '" null="' + nn + '" autoincrement="' + ai + '">\n'
    let elm = this.getDataType()
    console.log('=====ELM IS: =====')
    console.log(elm)
    console.log('=====ELM IS: =====')
    let t = elm.getAttribute('sql')
    if (this.data.size.length) { t += '(' + this.data.size + ')' }
    xml += '<datatype>' + t + '</datatype>\n'
    if (this.data.def || this.data.def === null) {
      var q = elm.getAttribute('quote')
      let d = this.data.def
      if (d === null) {
        d = 'NULL'
      } else if (d !== 'CURRENT_TIMESTAMP') {
        d = q + d + q
      }
      xml += '<default>' + Fn.escape(d) + '</default>'
    }
    for (let i = 0; i < this.relations.length; i++) {
      let r = this.relations[i]
      if (r.row2 !== this) { continue }
      xml += '<relation table="' + r.row1.owner.getTitle() + '" row="' + r.row1.getTitle() + '" />\n'
    }
    if (this.data.comment) {
      xml += '<comment>' + Fn.escape(this.data.comment) + '</comment>\n'
    }
    xml += '</row>\n'
    return xml
  }
}
