<template>
  <textarea id='editor'>
  </textarea>
</template>

<script>
  import CodeMirror from '../../static/codemirror/lib/codemirror.js'
  import '../../static/codemirror/mode/markdown/markdown.js'
  import marked from '../../node_modules/marked/lib/marked.js'
  const renderer = new marked.Renderer()
  renderer.link = (href, title, text) => {
    return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>'
  }
  marked.setOptions({renderer: renderer})

  export default {
    watch: {
      'editor': {
        handler: function (val, oldVal) {
          const value = this.editor.getValue()
          const slideArray = (value === null) ? [] : value.split('\n---')
          let slides = []
          for (let i in slideArray) {
            slides.push(marked(slideArray[i]))
          }
          this.$dispatch('transferTo', 'updateSlides', slides)
        },
        deep: true
      }
    },
    data () {
      return {
        editor: null
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
      editor.on('focus', function () {
        window.isEditorOnFocus = true
      })
      editor.on('blur', function () {
        window.isEditorOnFocus = false
      })
      const self = this
      editor.on('scroll', function () {
        const scrollInfo = editor.getScrollInfo()
        self.$dispatch('transferTo', 'scrollChanged', scrollInfo)
      })
    }
  }
</script>

<style>
.CodeMirror {
  height: 100%;
  line-height: 24px;
  font-size: 15px;
}
.cm-link {
  text-decoration: none;
}
</style>
