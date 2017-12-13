import RowModel from '@/models/row.js'
import KeyModel from '@/models/key.js'

export default class Table {
  constructor (data) {
    this.owner = data.owner
    this.x = data.x
    this.y = data.y
    this.data = {}
    this.data.title = data.name
    this.data.comment = ''
    // this.name = data.name
    this.selected = data.selected
    this.keys = []
    this.rows = []
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
}
