export default class Key {
  constructor (owner, type, name) {
    this.owner = owner
    this.rows = []
    this.type = type || 'INDEX'
    this.name = name || ''
  }
  setName (n) {
    this.name = n
  }
  getName () {
    return this.name
  }
  setType (t) {
    if (!t) { return }
    this.type = t
    // for (var i=0;i<this.rows.length;i++) { this.rows[i].redraw(); }
  }
  getType () {
    return this.type
  }
  addRow (r) {
    if (r.owner !== this.owner) { return }
    this.rows.push(r)
    r.addKey(this)
  }
  removeRow (r) {
    let idx = this.rows.indexOf(r)
    if (idx === -1) { return }
    r.removeKey(this)
    this.rows.splice(idx, 1)
  }
  destroy () {
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].removeKey(this)
    }
  }
  getLabel () {
    return this.name || this.type
  }
  toXML () {
    let xml = ''
    xml += '<key type="' + this.getType() + '" name="' + this.getName() + '">\n'
    for (let i = 0; i < this.rows.length; i++) {
      let r = this.rows[i]
      xml += '<part>' + r.getTitle() + '</part>\n'
    }
    xml += '</key>\n'
    return xml
    // console.log('toXML')
  }
  fromXML (node) {
    this.setType(node.getAttribute('type'))
    this.setName(node.getAttribute('name'))
    let parts = node.getElementsByTagName('part')
    for (let i = 0; i < parts.length; i++) {
      let name = parts[i].firstChild.nodeValue
      let row = this.owner.findNamedRow(name)
      this.addRow(row)
    }
    // console.log('fromXML')
  }
}
