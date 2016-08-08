<template>
  <div id='text-preview' class='text' @scroll='onscroll'>
    <div class="markdown-body" v-html="text"></div>
  </div>
</template>

<script>
  import marked from '../../node_modules/marked/lib/marked.js'

  const renderer = new marked.Renderer()
  renderer.link = (href, title, text) => {
    return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>'
  }
  marked.setOptions({renderer: renderer})

  export default {
    data () {
      return {
        text: '',
        isScolling: false
      }
    },
    methods: {
      onscroll () {
        const dom = document.getElementById('text-preview')
        const scrollTop = dom.scrollTop
        const height = dom.scrollHeight
        const scrollInfo = {top: scrollTop, height: height}
        this.$dispatch('transferTo', 'previewScrollChanged', scrollInfo)
        this.isScolling = true
      }
    },
    events: {
      updateMarkdown: function (value) {
        this.text = marked(value)
      },
      editorScrollChanged: function (scrollInfo) {
        if (this.isScolling) {
          this.isScolling = false
          return
        }
        const dom = document.getElementById('text-preview')
        const height = dom.scrollHeight
        dom.scrollTop = (scrollInfo.top / scrollInfo.height) * height * 1.3
      }
    }
  }
</script>

<style lang="scss">
.text {
  height: 100%;

  .markdown-body {
    font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    font-size: 15px;
    padding: 24px 32px;

    ::-webkit-scrollbar {
      display: block;
    }

    ::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }
    ::-webkit-scrollbar {
      width: 12px;
      background-color: #f5f5f5;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #616161;
    }

    hr {
      height: 1px;
      color: #616161;
      border-bottom-color: #616161;
    }
  }
}
</style>
