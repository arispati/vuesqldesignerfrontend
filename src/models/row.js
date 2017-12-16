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
    this.dom = {
      container: ''
    }
    if (data) { this.update(data) }
    this.id = Math.random()
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
}
