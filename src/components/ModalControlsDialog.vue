<template>
  <div class="modal-window" v-show="visible" @click.stop="emptyHandler" @mousedown.stop="emptyHandler" @mouseup.stop="emptyHandler">
    <div class="modal-confirm" v-show="confirmClientMode || confirmServerMode">
      <div class="modal-confirm__inner"></div>
      <div class="modal-confirm__wrapper">
        <div class="modal-confirm__title">
          <p>yes/no</p>
        </div>
        <div class="modal-confirm__content">
          <input type="text" v-model="confirmText"></input>
          <input type="submit" value="ok" @click="confirmYes">
          <input type="submit" value="Отмена" @click="confirmNo">
        </div>
      </div>
    </div>
    <div class="modal-window__inner">
    </div>
    <div class="modal-window__wrapper">
      <div class="modal-window__title">
        <p>Controls</p>
      </div>
      <div class="modal-window__content">
        <div class="modal-controls">
          <input class="btn btn-default" type="button" value="Save XML" @click="saveXML">
          <input class="btn btn-default" type="button" value="Load XML" @click="loadXML">
          <input class="btn btn-default" type="button" value="Generate SQL" @click="clientsql">

          <input class="btn btn-default" type="button" value="Save in Browser" @click="openConfirmInLocalSaveMode">
          <input class="btn btn-default" type="button" value="Load from Browser" @click="openConfirmInLocalLoadMode">
          <input class="btn btn-default" type="button" value="List from Browser" @click="clientlocallist">

          <textarea v-model="io"></textarea>
          <input type="submit" value="ok" @click="ok">
          <input type="submit" value="Отмена" @click="cancel">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Fn from '@/functions.js'
const API_BASE = 'http://websqldesignerserver'

export default {
  name: 'modal-controls-dialog',
  props: ['data', 'visible'], // row || table mode AND data == {newrowdata: actualData, row: this.data, mode: 'row'}
  created () {
  },
  data () {
    return {
      // dialogdata: this.data,
      io: '',
      confirmServerMode: false,
      confirmClientMode: false,
      confirmMode: '',
      confirmText: ''
    }
  },
  watch: {
    visible: function () {
      if (this.visible) {
        this.io = ''
        console.log('modal controls dialog is visible')
      }
    }
  },
  methods: {
    emptyHandler () {},
    ok () {
      console.log(this.data)
      this.$emit('closeModalControlsDialog')
    },
    cancel () {
      this.$emit('closeModalControlsDialog')
    },
    loadXML () {
      this.$emit('loadXML', this.io)
      this.$emit('closeModalControlsDialog')
    },
    saveXML () {
      let webdesigner = this.data
      let xml = webdesigner.toXML()
      this.io = xml
    },
    clientlocallist () {
      if (!window.localStorage) {
        alert('Sorry, your browser does not seem to support localStorage.')
        return
      }
      /* --- Define some useful vars --- */
      let baseKeysName = 'wwwsqldesigner_databases_'
      let localLen = window.localStorage.length
      let data = ''
      let schemasFound = false
      let code = 200
      /* --- work --- */
      try {
        for (let i = 0; i < localLen; ++i) {
          let key = window.localStorage.key(i)
          if ((new RegExp(baseKeysName)).test(key)) {
            let result = key.substring(baseKeysName.length)
            schemasFound = true
            data += result + '\n'
          }
        }
        if (!schemasFound) {
          throw new Error('No data available')
        }
      } catch (e) {
        alert('Error loading database names from localStorage! (' + e.message + ')')
        return
      }
      console.log('data: ' + data)
      console.log('code: ' + code)
      // this.confirmText = data
      this.io = data
    },
    clientlocalload () {
      if (!window.localStorage) {
        alert('Sorry, your browser does not seem to support localStorage.')
        return
      }
      let key = this.confirmText
      if (!key) { return }
      key = 'wwwsqldesigner_databases_' + (key || 'default')
      try {
        let xml = localStorage.getItem(key)
        if (!xml) { throw new Error('No data available') }
        this.io = xml
        this.loadXML()
      } catch (e) {
        alert('Error loading database structure from localStorage! (' + e.message + ')')
      }
      // this.fromXMLText(xml)
    },
    clientlocalsave () {
      if (!window.localStorage) {
        alert('Sorry, your browser does not seem to support localStorage.')
        return
      }
      let webdesigner = this.data
      let xml = webdesigner.toXML()
      if (xml.length >= (5 * 1024 * 1024) / 2) { /* this is a very big db structure... */
        alert('Warning: your database structure is above 5 megabytes in size, this is above the localStorage single key limit allowed by some browsers, example Mozilla Firefox 10')
        return
      }
      let key = this.confirmText
      if (!key) { return }
      key = 'wwwsqldesigner_databases_' + (key || 'default')
      try {
        localStorage.setItem(key, xml)
        if (localStorage.getItem(key) !== xml) { throw new Error('Content verification failed') }
      } catch (e) {
        alert('Error saving database structure to localStorage! (' + e.message + ')')
      }
    },
    openConfirmInLocalSaveMode () {
      this.confirmText = ''
      this.confirmClientMode = true
      this.confirmMode = 'save'
    },
    openConfirmInLocalLoadMode () {
      this.confirmText = ''
      this.confirmClientMode = true
      this.confirmMode = 'load'
    },
    confirmYes () {
      if (this.confirmClientMode && (this.confirmMode === 'save')) {
        this.clientlocalsave()
      }
      if (this.confirmClientMode && (this.confirmMode === 'load')) {
        this.clientlocalload()
      }
      this.confirmClientMode = false
      this.confirmServerMode = false
      // clientlocalsave
    },
    confirmNo () {
      this.confirmClientMode = false
      this.confirmServerMode = false
    },
    clientsql () {
      console.log('clientsql')
      axios({method: 'get', url: `${API_BASE}/corsbridge.php?db=mysql&sql=true`}).then((xsl) => {
        let xslDoc = Fn.fromXMLText(xsl.data)
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||')
        console.log('xslDoc')
        console.log(xslDoc)
        console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||')
        let xml = this.data.toXML()
        let sql = ''
        try {
          if (window.XSLTProcessor && window.DOMParser) {
            let parser = new DOMParser()
            let xmlDoc = parser.parseFromString(xml, 'text/xml')
            let xsl = new XSLTProcessor()
            xsl.importStylesheet(xslDoc)
            let result = xsl.transformToDocument(xmlDoc)
            sql = result.documentElement.textContent
          } else if (window.ActiveXObject || 'ActiveXObject' in window) {
            let xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM')
            xmlDoc.loadXML(xml)
            sql = xmlDoc.transformNode(xslDoc)
          } else {
            throw new Error('No XSLT processor available')
          }
        } catch (e) {
          alert('xmlerror: ' + e.message)
          return
        }
        this.io = sql.trim()
      })
    }
  }
}
</script>

<style lang="less">
  .modal-confirm {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    &__wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      /* центрирование */
      margin: auto;
      /* центрирование */
      height: 120px;
      width: 360px;
      border: 1px solid black;
      padding: 5px 5px 5px 55px;
      background-color: #ffffff;
    }
  }

  .modal-window {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    &__inner {
      position: absolute;
      left: 20px;
      right: 20px;
      top: 20px;
      bottom: 20px;
      background: blue;
      opacity: 0.3;
      filter: alpha(opacity=30);
    }
    &__wrapper {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      /* центрирование */

      margin: auto;
      /* центрирование */

      height: 120px;
      width: 360px;
      border: 1px solid black;
      padding: 5px 5px 5px 55px;
      // background: url(https://js.cx/clipart/key.png) 3px 5px white no-repeat;
    }
  }

  .modal-controls textarea {
    width: 650px;
    height: 200px;
  }
  // .row--selected {
  // }
</style>
