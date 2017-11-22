export default class Row {
  constructor (owner, title, data) {
    this.owner = owner
    this.selected = false
    this.expanded = false
    this.data = {}
    this.data.title = title
    // this.keys = []
  }
  select () {
    if (this.selected) { return }
    this.selected = true
  }
  deselect () {
    if (!this.selected) { return }
    this.selected = false
    // this.collapse()
  }
}
