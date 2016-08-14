<template>
  <div class="slides">
    <topbar :pageinfo="pageinfo" v-show="!exportMode"></topbar>
    <slide id='{{ $index }}' track-by="$index" v-for="slide in slides" :slide="slide">
    </slide>
  </div>
</template>

<script>
  import slide from './Slide'
  import marked from '../../node_modules/marked/lib/marked.js'
  import topbar from './SlidePreviewTopBar'

  const renderer = new marked.Renderer()
  renderer.link = (href, title, text) => {
    return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>'
  }
  marked.setOptions({renderer: renderer})
  marked.setOptions({
    highlight: (code, lang) => {
      return window.hljs.highlightAuto(code, [lang]).value
    }
  })

  export default {
    data () {
      return {
        slides: [{index: 0, content: '', current: true}],
        revert: false,
        pageinfo: {index: 0, total: 0},
        exportMode: false
      }
    },
    ready () {
      window.addEventListener('keyup', this.keyup)
    },
    components: {
      slide,
      topbar
    },
    events: {
      updateSlides: function (value, index) {
        const slideArray = (value === null) ? [] : value.split('\n---')
        let slides = []
        for (let i in slideArray) {
          slides.push({index: i, content: marked(slideArray[i]), current: false})
        }
        this.slides = slides
        if (typeof index !== 'undefined') {
          this.pageinfo.index = index
        }
        this.pageinfo.total = slideArray.length
        this.show(this.pageinfo.index)
      },
      startExportMode: function () {
        this.slides.forEach((slide) => {
          slide.current = true
        })
        this.$broadcast('startExportMode')
        this.exportMode = true
      },
      endExportMode: function () {
        this.hiddenAll()
        this.show(this.pageinfo.index)
        this.$broadcast('endExportMode')
        this.exportMode = false
      }
    },
    methods: {
      hiddenAll () {
        this.slides.forEach((slide) => {
          slide.current = false
        })
      },
      show (index) {
        this.hiddenAll()
        this.slides[index].current = true
      },
      keyup (e) {
        if (window.isEditorOnFocus) {
          return
        }
        if (this.isNext(e.code)) {
          this.next()
        } else if (this.isPrevious(e.code)) {
          this.previous()
        } else if (this.isExit(e.code)) {
          this.exit()
        }
      },
      next () {
        if (this.pageinfo.index < this.slides.length - 1) {
          this.pageinfo.index++
        }
        this.show(this.pageinfo.index)
      },
      previous () {
        if (this.pageinfo.index > 0) {
          this.pageinfo.index--
        }
        this.show(this.pageinfo.index)
      },
      isPrevious (code) {
        const codes = ['ArrowLeft', 'ArrowUp']
        return codes.indexOf(code) !== -1
      },
      isNext (code) {
        const codes = ['Space', 'ArrowRight', 'ArrowDown']
        return codes.indexOf(code) !== -1
      },
      isExit (code) {
        const codes = ['Escape']
        return codes.indexOf(code) !== -1
      },
      exit () {
        this.$dispatch('exitPreviewFullScreen')
      }
    }
  }
</script>

<style>
.slides {
  height: 100%;
  font-size: 32px;
}
</style>
