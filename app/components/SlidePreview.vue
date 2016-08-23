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
  import util from '../vortex/util.js'
  import katex from '../../node_modules/katex/katex.js'

  const renderer = new marked.Renderer()
  util.customizeLink(renderer)
  util.customizeCode(renderer)
  util.customizeKatex(katex, renderer)
  marked.setOptions({renderer: renderer})
  marked.setOptions({
    highlight: (code, lang) => {
      return window.hljs.highlightAuto(code, [lang]).value
    }
  })

  export default {
    data () {
      return {
        slides: [{index: 0, content: '', show: true}],
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
        if (!window.isEditorOnFocus) return
        const slideArray = this.parseSlideArray(value)
        let slides = []
        let lastMatedata = ''
        for (let i in slideArray) {
          const matedata = this.getMetadata(slideArray[i])
          if (!matedata) {
            slideArray[i] = lastMatedata + slideArray[i]
          } else {
            lastMatedata = matedata
          }
          slides.push({index: i, content: slideArray[i], show: false})
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
          slide.show = true
        })
        this.$broadcast('startExportMode')
        this.exportMode = true
      },
      endExportMode: function () {
        this.hiddenAll()
        this.$broadcast('endExportMode')
        this.exportMode = false
        this.show(this.pageinfo.index)
      }
    },
    methods: {
      hiddenAll () {
        this.slides.forEach((slide) => {
          slide.show = false
        })
      },
      show (index) {
        this.hiddenAll()
        if (this.slides[index]) {
          this.slides[index].show = true
        }
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
      exit () {
        this.$dispatch('exitPreviewFullScreen')
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
      parseSlideArray (value) {
        const html = marked(value)
        return (value === null) ? [] : html.split('<hr>')
      },
      getMetadata (value) {
        const metaRegex = /<!--.*?-->/g
        if (!metaRegex.test(value) || !value) return
        return value.match(metaRegex)[0]
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
