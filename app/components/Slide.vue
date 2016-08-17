<template>
  <section class="slide" v-show="show" v-bind:class="[theme]">
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
          this.show = val
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
        show: false
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
      }
    },
    methods: {
      updateMetadata (value) {
        if (!window.vortex_metadata) {
          window.vortex_metadata = []
        }
        this.searchMetadataInContent(value)
        this.extendMetadataFromLast()
      },
      searchMetadataInContent (value) {
        const metaRegex = /<!--.*?-->/g
        const curIndex = this.slide.index
        if (metaRegex.test(value)) {
          const metadata = this.parseMetadata(curIndex, value.match(metaRegex)[0])
          this.animateInOut = this.getAnimateInOut(metadata.animateInOut)
          this.theme = metadata.theme
          window.vortex_metadata[curIndex] = metadata
        } else {
          this.animateInOut = {in: '', out: ''}
          this.theme = ''
          window.vortex_metadata[curIndex] = window.vortex_metadata[curIndex - 1]
        }
      },
      extendMetadataFromLast () {
        let pastIndex = this.slide.index - 1
        let lastAnimate = ''
        let lastTheme = ''
        while (pastIndex >= 0) {
          const lastMatedata = window.vortex_metadata[pastIndex]
          if (lastMatedata) {
            lastAnimate = (lastAnimate === '') ? lastMatedata.animateInOut : lastAnimate
            lastTheme = (lastTheme === '') ? lastMatedata.theme : lastTheme
          }
          if (lastAnimate !== '' && lastTheme !== '') {
            break
          }
          pastIndex--
        }
        if (this.animateInOut.in === '') {
          this.animateInOut = this.getAnimateInOut(lastAnimate)
        }
        if (this.theme === '') {
          this.theme = lastTheme
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
        if (show) {
          self.animate = this.animateInOut.in
          if (!self.animate) {
            self.show = true
          } else {
            window.setTimeout(() => {
              self.show = true
            }, 300)
          }
        } else {
          self.animate = this.animateInOut.out
          if (!self.animate) {
            self.show = false
          } else {
            window.setTimeout(() => {
              self.show = false
            }, 300)
          }
        }
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
    background-color: #EEEEEE;
  }
}
</style>
