<template>
  <section class="slide" v-bind:class="[theme, show ? 'show' : 'hidden']">
    <div v-html="slide.content" class="markdown-body animated"
    v-bind:class="[animate, theme, fullScreenMode ? 'full-screen': 'not-full-screen']">
    <div>
  </section>
</template>

<script>
  import animate from '../vortex/animate.js'

  export default {
    props: ['slide'],
    watch: {
      'slide.content': {
        handler: function (val, oldVal) {
          this.updateMetadata(val)
          if (this.show) {
            this.$dispatch('transferTo', 'updateTopBarTheme', this.theme)
          }
        }
      },
      'slide.show': {
        handler: function (val, oldVal) {
          this.updateMetadata(this.slide.content)
          this.triggerAnimate(val)
          if (val) {
            this.$dispatch('transferTo', 'updateTopBarTheme', this.theme)
          }
        }
      },
      'exportMode': {
        handler: function (val, oldVal) {
          this.animate = val ? '' : this.animate
          // Show all the slides when under export mode.
          this.show = val ? true : this.show
        }
      }
    },
    data () {
      return {
        fullScreenMode: false,
        exportMode: false,
        animate: '',
        animateInOut: {in: '', out: ''},
        theme: '',
        show: false,
        reverse: false
      }
    },
    ready () {
      // avoid animation cause html or body overflow
      document.getElementsByTagName('html')[0].style.overflow = 'hidden'
      this.show = this.slide.show
      this.triggerAnimate(this.show)
    },
    events: {
      enterFullScreen: function () {
        this.fullScreenMode = true
      },
      exitFullScreen: function () {
        this.fullScreenMode = false
      },
      startExportMode: function () {
        this.exportMode = true
      },
      endExportMode: function () {
        this.exportMode = false
      },
      setReverse: function (index, val) {
        if (parseInt(this.slide.index) === index) {
          this.reverse = val
        }
      }
    },
    methods: {
      updateMetadata (value) {
        this.parseMetadataInContent(value)
      },
      parseMetadataInContent (value) {
        const metaRegex = /<!--.*?-->/g
        const curIndex = this.slide.index
        if (metaRegex.test(value)) {
          const metadata = this.parseMetadata(curIndex, value.match(metaRegex)[0])
          this.animateInOut = this.getAnimateInOut(metadata.animateInOut)
          this.theme = metadata.theme
        } else {
          this.animateInOut = {in: '', out: ''}
          this.theme = ''
        }
      },
      parseMetadata (index, metadata) {
        let metaObj = {animateInOut: '', theme: ''}
        if (metadata) {
          const obj = this.metadataToJson(metadata)
          metaObj.animateInOut = obj.animate ? obj.animate : ''
          metaObj.theme = obj.theme ? obj.theme : ''
        }
        return metaObj
      },
      metadataToJson (metadata) {
        const trimData = metadata.slice(4, -3).trim()
        const jsonStr = '{"' + trimData.split(/\s*:\s*/g).join('":"').split(/\s+/g).join('","') + '"}'
        try {
          return JSON.parse(jsonStr)
        } catch (e) {
          return {animate: '', theme: ''}
        }
      },
      getAnimateInOut (name) {
        if (animate[name]) {
          return animate[name]
        } else {
          return {in: '', out: ''}
        }
      },
      triggerAnimate (show) {
        let self = this
        self.animate = this.getCurrentAnimate(show)
        if (!self.animate) {
          self.show = show
        } else {
          window.setTimeout(() => {
            self.show = show
          }, 300)
        }
      },
      getCurrentAnimate (show) {
        let animate = null
        if (this.reverse) {
          animate = show ? this.animateInOut.rIn : this.animateInOut.rOut
          if (!animate) {
            animate = show ? this.animateInOut.in : this.animateInOut.out
          }
          this.reverse = false
        } else {
          animate = show ? this.animateInOut.in : this.animateInOut.out
        }
        return animate
      }
    }
  }
</script>

<style lang="scss">
.slide {
  height: 100%;
  width: 100%;
  display: table;

  .markdown-body {
    display: table-cell;
    vertical-align: middle;

    .katex {
      display: inline;

      .katex-mathml {
        display: none;
      }
    }
  }

  .not-full-screen {
    width: 80%;
    font-size: 18px;
    padding-left: 10%;
    padding-right: 10%;
  }

  .full-screen {
    width: 60%;
    font-size: 32px;
    padding-left: 20%;
    padding-right: 20%;

    .mermaid {
      font-size: 18px;
    }
  }

  .mermaid {
    background-color: white;
  }
}

.show {
  visibility: visible;
}

.hidden {
  position: fixed;
  visibility: hidden;
}
</style>
