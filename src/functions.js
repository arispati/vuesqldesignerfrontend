export default {
  // convert string to XML
  fromXMLText (xml) {
    let xmlDoc = null
    try {
      if (window.DOMParser) {
        let parser = new DOMParser()
        xmlDoc = parser.parseFromString(xml, 'text/xml')
      } else if (window.ActiveXObject || 'ActiveXObject' in window) {
        // https://stackoverflow.com/questions/15055528/jslint-how-to-fix-activexobject-was-used-before-it-was-defined-error
        xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
        xmlDoc.loadXML(xml)
      } else {
        throw new Error('No XML parser available.')
      }
    } catch (e) {
      alert('XML PARSE ERROR: ' + e.message)
      return
    }
    return xmlDoc
  },
  escape (str) {
    return str.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;')
  }
}
