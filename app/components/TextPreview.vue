<template>
  <div id='text-preview' class='text'>
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
        text: ''
      }
    },
    events: {
      updateHtml: function (value) {
        this.text = marked(value)
      },
      scrollChanged: function (scrollInfo) {
        const dom = document.getElementById('text-preview')
        const height = dom.scrollHeight
        dom.scrollTop = (scrollInfo.top / scrollInfo.height) * height * 1.3
      }
    }
  }
</script>

<style lang="scss">
.text {
  background-color: white;
  height: 100%;
  overflow-y: scroll;
  overflow: hidden;

  .markdown-body {
    font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    font-size: 15px;
    padding: 24px 32px;

    hr {
      height: 1px;
    }
  }
}
</style>
