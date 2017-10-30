<template>
  <section class="slide" v-bind:class="[theme, align, show ? 'show' : 'hidden']">
    <div v-html="slide.content" class="markdown-body animated"
    v-bind:class="[animate, theme, fullScreenMode ? 'full-screen': 'not-full-screen']"
    v-bind:style="styleObject">
    <div>
  </section>
</template>

<script>
  import animate from '../lib/animate.js'

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
      },
      'width': {
        handler: function (val, oldVal) {
          if (val) {
            const width = parseInt(val.replace('%', ''))
            const paddind = (100 - width) / 2
            if (paddind >= 0) {
              this.styleObject.width = width + '%'
              this.styleObject.paddingLeft = paddind + '%'
              this.styleObject.paddingRight = paddind + '%'
            }
          }
        }
      },
      'bgImg': {
        handler: function (val, oldVal) {
          if (val) {
            this.styleObject.backgroundImage = 'url(' + val + ')'
          }
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
        align: 'left',
        width: '80%',
        styleObject: {
          width: '80%',
          paddingLeft: '10%',
          paddingRight: '10%',
          backgroundImage: '',
          fontSize: '32px'
        },
        bgImg: '',
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
        const metaRegex = /<!--[^]+-->/g
        const curIndex = this.slide.index
        if (metaRegex.test(value)) {
          const metadata = this.parseMetadata(curIndex, value.match(metaRegex)[0])
          this.animateInOut = this.getAnimateInOut(metadata.animateInOut)
          this.theme = metadata.theme
          this.align = metadata.align
          this.width = metadata.width
          this.bgImg = metadata.bgImg
          this.styleObject.fontSize = metadata.fontSize
        } else {
          this.animateInOut = {in: '', out: ''}
          this.theme = ''
          this.align = 'left'
          this.width = '80%'
          this.bgImg = ''
          this.styleObject.fontSize = '32px'
        }
      },
      parseMetadata (index, metadata) {
        let metaObj = {animateInOut: '', theme: ''}
        if (metadata) {
          const obj = this.metadataToJson(metadata)
          metaObj.animateInOut = obj.animate ? obj.animate : ''
          metaObj.theme = obj.theme ? obj.theme : ''
          metaObj.align = obj.align ? obj.align : 'left'
          metaObj.width = obj.width ? obj.width : '80%'
          metaObj.bgImg = obj.bgImg ? obj.bgImg : ''
          metaObj.fontSize = obj.fontSize ? obj.fontSize : '32px'
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
    font-size: 18px !important;
  }

  .mermaid {
    background-color: transparent;
  }
}

.left {
  text-align: left;
}

.center {
  text-align: center;

  ul, pre, blockquote {
    text-align: left;
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
