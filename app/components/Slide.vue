<template>
  <section class="slide" v-show="slide.current">
    <div v-html="slide.content" class="markdown-body animated"
    v-bind:class="[animate, fullScreenMode ? 'full-screen': 'not-full-screen']">
    <div>
  </section>
</template>

<script>
  export default {
    props: ['slide'],
    watch: {
      'slide.content': {
        handler: function (val, oldVal) {
          const metaRegex = /<!--.*?-->/g
          if (metaRegex.test(val)) {
            const metadata = this.parseMetadata(val.match(metaRegex)[0])
            this.animate = metadata.animate
            this.theme = metadata.theme
          } else {
            this.animate = ''
            this.theme = ''
          }
        }
      },
      'slide.current': {
        handler: function (val, oldVal) {
          if (window.vortex_metadata) {
            const metadata = window.vortex_metadata
            if (this.animate === '') {
              this.animate = metadata.animate
            }
            if (this.theme === '') {
              this.theme = metadata.theme
            }
          }
        }
      },
      'exportMode': {
        handler: function (val, oldVal) {
          this.animate = val ? '' : this.animate
        }
      }
    },
    data () {
      return {
        fullScreenMode: false,
        exportMode: false,
        animate: '',
        theme: ''
      }
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
      parseMetadata (metadata) {
        if (metadata) {
          let metaObj = {animate: '', theme: ''}
          const obj = this.metadataToJson(metadata)
          if (obj.animate) {
            metaObj.animate = obj.animate
          }
          if (obj.theme) {
            metaObj.theme = obj.theme
          }
          window.vortex_metadata = metaObj
          return metaObj
        } else {
          return {animate: '', theme: ''}
        }
      },
      metadataToJson (metadata) {
        const trimData = metadata.slice(4, -3).trim()
        const jsonStr = '{"' + trimData.split(':').join('":"').split(' ').join('","') + '"}'
        return JSON.parse(jsonStr)
      }
    }
  }
</script>

<style lang="scss">
.slide {
  height: 100%;
  width: 100%;
  display: table;
  background-color: #EEEEEE;

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
}
</style>
