<template>
  <toolbar></toolbar>
  <textarea id='editor'></textarea>
</template>

<script>
  import CodeMirror from '../../static/codemirror/lib/codemirror.js'
  import '../../static/codemirror/mode/markdown/markdown.js'
  import toolbar from './ToolBar'
  import {ipcRenderer} from 'electron'

  export default {
    watch: {
      'editor': {
        handler: function (val, oldVal) {
          const value = this.editor.getValue()
          this.$dispatch('update', value)
        },
        deep: true
      }
    },
    components: {
      toolbar
    },
    data () {
      return {
        editor: null,
        isScolling: false
      }
    },
    ready () {
      const textarea = document.getElementById('editor')
      const editor = CodeMirror.fromTextArea(textarea, {
        lineWrapping: true,
        mode: 'markdown',
        theme: '3024-day',
        matchBrackets: true
      })
      this.editor = editor
      editor.on('focus', () => {
        window.isEditorOnFocus = true
      })
      editor.on('blur', () => {
        window.isEditorOnFocus = false
      })
      editor.on('change', () => {
        ipcRenderer.send('content-changed')
      })
      const self = this
      editor.on('scroll', function () {
        self.isScolling = true
        const scrollInfo = editor.getScrollInfo()
        self.$dispatch('transferTo', 'editorScrollChanged', scrollInfo)
      })
      ipcRenderer.on('open-file', (event, data) => {
        this.editor.setValue(data)
      })
      ipcRenderer.on('trigger-save-file', (event, fileName) => {
        const content = this.editor.getValue()
        ipcRenderer.send('save-file', fileName, content)
        ipcRenderer.send('content-saved', fileName)
      })
    },
    events: {
      previewScrollChanged: function (scrollInfo) {
        if (this.isScolling) {
          this.isScolling = false
          return
        }
        this.editor.scrollTo(null, scrollInfo.top)
      },
      focusEditor: function () {
        this.editor.focus()
      }
    }
  }
</script>

<style>
.CodeMirror {
  font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  height: calc(100% - 31.5px);
  line-height: 1.5em;
  font-size: 1em;
}
.cm-link {
  text-decoration: none;
}
</style>
