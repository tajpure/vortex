<template>
  <div class="wrapper">
    <div class="editor" v-show="!previewFullScreenMode"
      v-bind:class="{ 'full-screen': editorFullScreenMode }">
      <editor></editor>
    </div>
    <div class="preview" v-show="!editorFullScreenMode"
      v-bind:class="{ 'full-screen': previewFullScreenMode }">
      <textpreview v-show='!slideMode'
      v-bind:class="{ 'overflow-y': !previewFullScreenMode }"></textpreview>
      <slidepreview v-show='slideMode'></slidepreview>
    </div>
  </div>
</template>

<script>
  import editor from './components/Editor'
  import slidepreview from './components/SlidePreview'
  import textpreview from './components/TextPreview'
  import { ipcRenderer } from 'electron'

  export default {
    data () {
      return {
        slideMode: true,
        previewFullScreenMode: false,
        editorFullScreenMode: false
      }
    },
    components: {
      editor,
      slidepreview,
      textpreview,
      winId: null
    },
    ready () {
      const self = this
      ipcRenderer.on('start-export-mode', (event, data) => {
        self.startExportMode()
      })
      ipcRenderer.on('end-export-mode', (event, data) => {
        self.endExportMode()
      })
      ipcRenderer.once('set-slide-mode', (event, slideMode) => {
        self.slideMode = slideMode
      })
      ipcRenderer.once('set-visibility', (event, visibility) => {
        self.editorFullScreenMode = !visibility
      })
      ipcRenderer.on('set-window-id', (event, id) => {
        this.winId = id
      })
    },
    methods: {
      startExportMode () {
        this.previewFullScreenMode = true
        if (this.slideMode) {
          this.$broadcast('enterFullScreen')
          this.$broadcast('startExportMode')
          ipcRenderer.send('export-to-pdf', {
            marginsType: 1,
            pageSize: 'A4',
            printBackground: true,
            landscape: true
          })
        } else {
          ipcRenderer.send('export-to-pdf', {})
        }
      },
      endExportMode () {
        if (this.slideMode) {
          this.$broadcast('endExportMode')
          this.previewFullScreenMode = false
          this.$broadcast('exitFullScreen')
        } else {
          this.previewFullScreenMode = false
        }
      }
    },
    events: {
      update: function (data, index) {
        if (this.slideMode) {
          this.$broadcast('updateSlides', data, index)
        } else {
          this.$broadcast('updateMarkdown', data)
        }
      },
      transferTo: function (action, data) {
        this.$broadcast(action, data)
      },
      enterPreviewFullScreen: function () {
        this.previewFullScreenMode = true
        this.$broadcast('enterFullScreen')
      },
      exitPreviewFullScreen: function () {
        this.previewFullScreenMode = false
        this.$broadcast('exitFullScreen')
      },
      closePreview: function () {
        this.editorFullScreenMode = true
        // this.$broadcast('updateEditorValue')
      },
      openPreview: function () {
        this.editorFullScreenMode = false
        // this.$broadcast('updateEditorValue')
      },
      openTextMode: function () {
        this.slideMode = false
      },
      openSlideMode: function () {
        this.slideMode = true
      }
    }
  }
</script>

<style lang="scss">
  html, body {
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;

    .editor {
      width: 50%;

      ::-webkit-scrollbar-track {
        background-color: #f5f5f5;
      }
      ::-webkit-scrollbar {
        width: 12px;
        background-color: #f5f5f5;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #616161;
      }
    }

    .preview {
      width: 50%;
      height: 100%;
      background-color: #EEEEEE;

      ::-webkit-scrollbar {
          display: none;
      }
    }

    .full-screen {
      width: 100%;
    }

    .overflow-y {
      overflow-y: scroll;
    }
  }

  .mermaidTooltip {
    display: none;
  }
</style>
