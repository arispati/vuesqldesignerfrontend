export default class Relation {
  constructor (row1, row2) {
    this.row1 = row1
    this.row2 = row2
    // просто добавляем обеим строкам данную связь
    this.row1.addRelation(this)
    this.row2.addRelation(this)
  }
  destroy () {
    // просто удаляем у обеих строк данную связь
    this.row1.removeRelation(this)
    this.row2.removeRelation(this)
  }
}
