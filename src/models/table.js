export default class Table {
  constructor (data) {
    this.x = data.x
    this.y = data.y
    this.name = data.name
    this.selected = data.selected

    this.rows = []
  }
  addRow () {
    console.log('addRow table method!')
  }
}
