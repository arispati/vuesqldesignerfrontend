import RowModel from '@/models/row.js'
import KeyModel from '@/models/key.js'
import Fn from '@/functions.js'

export default class Table {
  constructor (data) {
    this.owner = data.owner
    this.zIndex = 0
    this.x = data.x
    this.y = data.y
    this.data = {}
    this.data.title = data.name
    this.data.comment = ''
    // this.name = data.name
    this.selected = data.selected
    this.keys = []
    this.rows = []
    this.setZ(data.z)
    this.dom = {
      container: ''
    }
  }
  select () {
    if (this.selected) { return }
    this.selected = true
  }
  deselect () {
    if (!this.selected) { return }
    this.selected = false
  }
  moveTo (x, y) {
    this.x = x
    this.y = y
  }
  findNamedRow (n) {
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].getTitle() === n) { return this.rows[i] }
    }
    return false
  }
  // move to visual parent class!!
  getTitle () {
    return this.data.title
  }
  // move to visual parent class!!
  setTitle (text) {
    if (!text) { return }
    this.data.title = text
  }
  setZ (z) {
    this.zIndex = z
  }
  getZ () {
    return this.zIndex
  }
  getComment () {
    return this.data.comment
  }
  setComment (c) {
    this.data.comment = c
  }
  addRow (title, data) {
    let r = new RowModel(this, title, data)
    this.rows.push(r)
    return r
    // console.log('title')
    // console.log(title)
    // console.log('data')
    // console.log(data)
    // console.log('addRow table method!')
  }
  removeRow (r) {
    let idx = this.rows.indexOf(r)
    if (idx === -1) { return }
    r.destroy()
    this.rows.splice(idx, 1)
  }
  addKey (name) {
    let k = new KeyModel(this, name)
    this.keys.push(k)
    return k
  }
  removeKey (k) {
    let idx = this.keys.indexOf(k)
    if (idx === -1) { return }
    // k.destroy()
    this.keys.splice(idx, 1)
  }
  copy (table) {
    this.x = table.x
    this.y = table.y
    this.name = table.name
    this.rows = []
    this.keys = []
    for (let i = 0; i < table.rows.length; i++) {
      let row = table.rows[i]
      let copyrow = new RowModel(this, '', false)
      copyrow.copy(row)
      this.rows.push(copyrow)
    }
    for (let i = 0; i < table.keys.length; i++) {
      let key = table.keys[i]
      let copykey = new KeyModel(this, '', '')
      copykey.copy(key)
      this.keys.push(copykey)
    }
  }
  toXML () {
    let t = this.getTitle().replace(/"/g, '&quot;')
    let xml = ''
    xml += '<table x="' + this.x + '" y="' + this.y + '" name="' + t + '">\n'
    for (let i = 0; i < this.rows.length; i++) {
      xml += this.rows[i].toXML()
    }
    for (let i = 0; i < this.keys.length; i++) {
      xml += this.keys[i].toXML()
    }
    let c = this.getComment()
    if (c) {
      xml += '<comment>' + Fn.escape(c) + '</comment>\n'
    }
    xml += '</table>\n'
    return xml
  }
  fromXML (node) {
    let name = node.getAttribute('name')
    this.setTitle(name)
    let x = parseInt(node.getAttribute('x')) || 0
    let y = parseInt(node.getAttribute('y')) || 0
    this.moveTo(x, y)
    let rows = node.getElementsByTagName('row')
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      let r = this.addRow('')
      r.fromXML(row)
    }
    let keys = node.getElementsByTagName('key')
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i]
      let k = this.addKey()
      k.fromXML(key)
    }
    for (let i = 0; i < node.childNodes.length; i++) {
      let ch = node.childNodes[i]
      if (ch.tagName && ch.tagName.toLowerCase() === 'comment' && ch.firstChild) {
        this.setComment(ch.firstChild.nodeValue)
      }
    }
  }
}
