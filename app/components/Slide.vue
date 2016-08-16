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
          this.updateMetadata(val)
        }
      },
      'slide.current': {
        handler: function (val, oldVal) {
          this.updateMetadata(this.slide.content)
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
          const metadata = this.parseMetadata(value.match(metaRegex)[0])
          this.animate = metadata.animate
          this.theme = metadata.theme
          window.vortex_metadata[curIndex] = metadata
        } else {
          this.animate = ''
          this.theme = ''
          window.vortex_metadata[curIndex] = window.vortex_metadata[curIndex - 1]
        }
      },
      extendMetadataFromLast () {
        let pastIndex = this.slide.index - 1
        while (pastIndex >= 0) {
          if (window.vortex_metadata[pastIndex]) {
            break
          }
          pastIndex--
        }
        if (window.vortex_metadata[pastIndex]) {
          const metadata = window.vortex_metadata[pastIndex]
          if (this.animate === '') {
            this.animate = metadata.animate
          }
          if (this.theme === '') {
            this.theme = metadata.theme
          }
        }
      },
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
