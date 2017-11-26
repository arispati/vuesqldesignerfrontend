import RowModel from '@/models/row.js'

export default class Table {
  constructor (data) {
    this.owner = data.owner
    this.x = data.x
    this.y = data.y
    this.name = data.name
    this.selected = data.selected

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
}
