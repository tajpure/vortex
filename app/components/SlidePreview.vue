<template>
  <div class="slides">
    <slide id='{{ $index }}' v-for="slide in slides" track-by="$index" :slide="slide">
    </slide>
  </div>
</template>

<script>
  import Slide from './Slide'
  import marked from '../../node_modules/marked/lib/marked.js'

  const renderer = new marked.Renderer()
  renderer.link = (href, title, text) => {
    return '<a target="_blank" href="' + href + '" title="' + title + '">' + text + '</a>'
  }
  marked.setOptions({renderer: renderer})

  export default {
    data () {
      return {
        slides: ['# Vortex'],
        revert: false,
        index: 0
      }
    },
    ready () {
      window.addEventListener('keyup', this.keyup)
    },
    components: {
      Slide
    },
    events: {
      updateSlides: function (value) {
        const slideArray = (value === null) ? [] : value.split('\n---')
        let slides = []
        for (let i in slideArray) {
          slides.push({content: marked(slideArray[i]), isShowed: false})
        }
        this.slides = slides
        this.show(this.index)
      }
    },
    methods: {
      hiddenAll () {
        this.slides.forEach((slide) => {
          slide.isShowed = false
        })
      },
      show (index) {
        this.hiddenAll()
        this.slides[index].isShowed = true
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
        } else {
          console.log(e)
        }
      },
      next () {
        if (this.index < this.slides.length - 1) {
          this.index++
        }
        this.show(this.index)
      },
      previous () {
        if (this.index > 0) {
          this.index--
        }
        this.show(this.index)
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
        this.$dispatch('exitSlide')
      }
    }
  }
</script>

<style>
.slides {
  height: 100%;
  font-size: 32px;
  font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}
</style>
