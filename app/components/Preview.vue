<template>
  <div class="slides">
    <slide id='{{ $index }}' v-for="slide in slides" track-by="$index" :slide="slide">
    </slide>
  </div>
</template>

<script>
  import Slide from './Slide'

  export default {
    data () {
      return {
        slides: ['# Vortex'],
        revert: false,
        scrollTop: 0,
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
      updateSlides: function (slides) {
        this.slides = slides
      },
      scrollChanged: function (scrollInfo) {
        const slides = document.getElementsByClassName('slides')
        slides.scrollTop = scrollInfo.top
      }
    },
    methods: {
      keyup (e) {
        if (window.isEditorOnFocus) {
          return
        }
        if (this.isNext(e.code)) {
          this.next()
        } else if (this.isPrevious(e.code)) {
          this.previous()
        }
      },
      next () {
        if (this.index < this.slides.length - 1) {
          this.index++
        }
        window.location.hash = this.index
      },
      previous () {
        if (this.index > 0) {
          this.index--
        }
        window.location.hash = this.index
      },
      isPrevious (code) {
        const codes = ['ArrowLeft', 'ArrowUp']
        return codes.indexOf(code) !== -1
      },
      isNext (code) {
        const codes = ['Space', 'ArrowRight', 'ArrowDown']
        return codes.indexOf(code) !== -1
      },
      translate (t) {
        return ' translate3d(' + t.x + 'px,' + t.y + 'px,' + t.z + 'px) '
      },
      rotate (r) {
        const rX = ' rotateX(' + r.x + 'deg) '
        const rY = ' rotateY(' + r.y + 'deg) '
        const rZ = ' rotateZ(' + r.z + 'deg) '
        return this.revert ? rZ + rY + rX : rX + rY + rZ
      },
      scale (s) {
        return ' scale(' + s + ') '
      },
      perspective (p) {
        return ' perspective(' + p + 'px) '
      }
    }
  }
</script>

<style>
.slides {
  height: 100%;
  font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}
</style>
