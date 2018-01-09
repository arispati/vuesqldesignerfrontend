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
        <p v-show="mode=='controls'">{{locale['saveload']}}</p>
        <p v-show="mode=='options'">{{locale['options']}}</p>
        <div class="sk-fading-circle" v-show="throbber">
          <div class="sk-circle1 sk-circle"></div>
          <div class="sk-circle2 sk-circle"></div>
          <div class="sk-circle3 sk-circle"></div>
          <div class="sk-circle4 sk-circle"></div>
          <div class="sk-circle5 sk-circle"></div>
          <div class="sk-circle6 sk-circle"></div>
          <div class="sk-circle7 sk-circle"></div>
          <div class="sk-circle8 sk-circle"></div>
          <div class="sk-circle9 sk-circle"></div>
          <div class="sk-circle10 sk-circle"></div>
          <div class="sk-circle11 sk-circle"></div>
          <div class="sk-circle12 sk-circle"></div>
        </div>
      </div>
      <div class="modal-window__content">
        <div class="modal-controls">
          <div v-show="mode=='controls'">
            <input class="btn btn-default" type="button" :value="locale['clientsave']" @click="saveXML">
            <input class="btn btn-default" type="button" :value="locale['clientload']" @click="loadXML">
            <input class="btn btn-default" type="button" :value="locale['clientsql']"  @click="clientsql">
            <!-- local storage -->
            <input class="btn btn-default" type="button" value="Save in Browser" :value="locale['clientlocalsave']" @click="openConfirmInLocalSaveMode">
            <input class="btn btn-default" type="button" value="Load from Browser" :value="locale['clientlocalload']" @click="openConfirmInLocalLoadMode">
            <input class="btn btn-default" type="button" value="List from Browser" :value="locale['clientlocallist']" @click="clientlocallist">
            <!-- server -->
            <label>{{locale['backendlabel']}}</label>
            <select v-model="backendSelectVal" class="form-control">
              <option v-for="option in backendSelect" :value="option">{{option}}</option>
            </select>
            <input class="btn btn-default" type="button" value="List items" :value="locale['serverlist']" @click="serverlist">
            <input class="btn btn-default" type="button" value="Load" :value="locale['serverload']" @click="openConfirmInServerLoadMode">
            <input class="btn btn-default" type="button" value="Save" :value="locale['serversave']" @click="openConfirmInServerSaveMode">
            <label>{{locale['output']}}</label>
            <textarea v-model="io"></textarea>
          </div>
          <div v-show="mode=='options'">
            <label>Locale</label>
            <select v-model="localeVal" class="form-control">
              <option v-for="option in localeOptions" :value="option">{{option}}</option>
            </select>
          </div>
          <input type="submit" value="ok" :value="locale['windowok']" @click="ok">
          <input type="submit" value="Отмена" :value="locale['windowcancel']" @click="cancel">

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Fn from '@/functions.js'
import config from '@/config.js'
const API_BASE = 'http://websqldesignerserver'

export default {
  name: 'modal-controls-dialog',
  props: ['data', 'visible', 'mode', 'locale', 'currentLocale', 'localeOptions'], // row || table mode AND data == {newrowdata: actualData, row: this.data, mode: 'row'}
  created () {
  },
  data () {
    return {
      // dialogdata: this.data,
      io: '',
      confirmServerMode: false,
      confirmClientMode: false,
      confirmMode: '',
      confirmText: '',
      backendSelect: config.AVAILABLE_BACKENDS,
      backendSelectVal: config.DEFAULT_BACKEND,
      throbber: false,
      localeVal: this.currentLocale
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
      if (this.mode === 'options') {
        this.$emit('setNewLocale', this.localeVal)
      }
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
    serverlist () {
      this.throbber = true
      axios({method: 'get', url: `${API_BASE}/corsbridge.php?backend=${this.backendSelectVal}&action=list`}).then(this.listresponse).catch(error => {
        this.throbber = false
        this.io = 'http: ' + error.response.status + ' ' + error.response.statusText
      })
    },
    listresponse (response) {
      this.throbber = false
      this.io = response.data
    },
    serverload () {
      let key = this.confirmText
      if (!key) { return }
      this.throbber = true
      axios({method: 'get', url: `${API_BASE}/corsbridge.php?backend=${this.backendSelectVal}&action=load&keyword=${encodeURIComponent(key)}`}).then(this.loadresponse).catch(error => {
        this.throbber = false
        this.io = 'http: ' + error.response.status + ' ' + error.response.statusText
      })
    },
    loadresponse (response) {
      this.throbber = false
      this.io = response.data
      this.loadXML()
      // this.fromXML(data)
    },
    serversave () {
      let webdesigner = this.data
      let xml = webdesigner.toXML()
      if (xml.length >= (5 * 1024 * 1024) / 2) { /* this is a very big db structure... */
        alert('Warning: your database structure is above 5 megabytes in size, this is above the localStorage single key limit allowed by some browsers, example Mozilla Firefox 10')
        return
      }
      let key = this.confirmText
      if (!key) { return }
      this.throbber = true
      axios({method: 'post', data: xml, url: `${API_BASE}/corsbridge.php?backend=${this.backendSelectVal}&action=save&keyword=${encodeURIComponent(key)}`}).then(this.loadresponse).catch(error => {
        this.throbber = false
        this.io = 'http: ' + error.response.status + ' ' + error.response.statusText
      })
    },
    saveresponse () {
      this.throbber = false
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
    openConfirmInServerLoadMode () {
      this.confirmText = ''
      this.confirmServerMode = true
      this.confirmMode = 'load'
    },
    openConfirmInServerSaveMode () {
      this.confirmText = ''
      this.confirmServerMode = true
      this.confirmMode = 'save'
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
      if (this.confirmServerMode && (this.confirmMode === 'save')) {
        this.serversave()
      }
      if (this.confirmServerMode && (this.confirmMode === 'load')) {
        this.serverload()
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
      // padding: 5px 5px 5px 55px;
      padding: 5px 5px 5px 5px;
      // background: url(https://js.cx/clipart/key.png) 3px 5px white no-repeat;
    }
  }

  .modal-controls textarea {
    width: 650px;
    height: 200px;
  }

  /*
  !!! временно !!!
  */
  .modal-controls textarea {
    height: 50px;
  }

  .sk-fading-circle {
    // margin: 100px auto;
    width: 40px;
    height: 40px;
    position: relative;
  }

  .sk-fading-circle .sk-circle {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  .sk-fading-circle .sk-circle:before {
    content: '';
    display: block;
    margin: 0 auto;
    width: 15%;
    height: 15%;
    background-color: #333;
    border-radius: 100%;
    -webkit-animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
            animation: sk-circleFadeDelay 1.2s infinite ease-in-out both;
  }
  .sk-fading-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
            transform: rotate(30deg);
  }
  .sk-fading-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
            transform: rotate(60deg);
  }
  .sk-fading-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
            transform: rotate(90deg);
  }
  .sk-fading-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
            transform: rotate(120deg);
  }
  .sk-fading-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
            transform: rotate(150deg);
  }
  .sk-fading-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
            transform: rotate(180deg);
  }
  .sk-fading-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
            transform: rotate(210deg);
  }
  .sk-fading-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
            transform: rotate(240deg);
  }
  .sk-fading-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
            transform: rotate(270deg);
  }
  .sk-fading-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
            transform: rotate(300deg);
  }
  .sk-fading-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
            transform: rotate(330deg);
  }
  .sk-fading-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s;
  }
  .sk-fading-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
            animation-delay: -1s;
  }
  .sk-fading-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s;
  }
  .sk-fading-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s;
  }
  .sk-fading-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
            animation-delay: -0.7s;
  }
  .sk-fading-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
            animation-delay: -0.6s;
  }
  .sk-fading-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
            animation-delay: -0.5s;
  }
  .sk-fading-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
            animation-delay: -0.4s;
  }
  .sk-fading-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
            animation-delay: -0.3s;
  }
  .sk-fading-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
            animation-delay: -0.2s;
  }
  .sk-fading-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
            animation-delay: -0.1s;
  }

  @-webkit-keyframes sk-circleFadeDelay {
    0%, 39%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }

  @keyframes sk-circleFadeDelay {
    0%, 39%, 100% { opacity: 0; }
    40% { opacity: 1; }
  }

  // .row--selected {
  // }
</style>
