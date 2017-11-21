export default class Row {
  constructor (owner, title, data) {
    this.owner = owner
    this.selected = false
    this.expanded = false
    this.data = {}
    this.data.title = title
    // this.keys = []
  }
}
