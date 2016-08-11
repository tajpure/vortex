<template>
  <div class="row">
    <div class="editor" v-show="!isPreviewFullScreen"
      v-bind:class="{ 'full-screen': isEditorFullScreen }">
      <editor></editor>
    </div>
    <div class="preview" v-show="!isEditorFullScreen"
      v-bind:class="{ 'full-screen': isPreviewFullScreen }">
      <textpreview v-show='!isSlideMode'
      v-bind:class="{ 'overflow-y': !isPreviewFullScreen}"></textpreview>
      <slidepreview v-show='isSlideMode'></slidepreview>
    </div>
  </div>
</template>

<script>
  import editor from './components/Editor'
  import slidepreview from './components/SlidePreview'
  import textpreview from './components/TextPreview'
  import {ipcRenderer} from 'electron'

  export default {
    data () {
      return {
        isSlideMode: true,
        isPreviewFullScreen: false,
        isEditorFullScreen: false
      }
    },
    components: {
      editor,
      slidepreview,
      textpreview
    },
    ready () {
      const self = this
      ipcRenderer.on('start-export-mode', (event, data) => {
        self.startExportMode()
      })
      ipcRenderer.on('end-export-mode', (event, data) => {
        self.endExportMode()
      })
    },
    methods: {
      startExportMode () {
        this.isPreviewFullScreen = true
        if (this.isSlideMode) {
          this.$broadcast('enterFullScreen')
          this.$broadcast('startExportMode')
          ipcRenderer.send('export-to-pdf', {
            marginsType: 1,
            pageSize: 'Letter',
            printBackground: true,
            landscape: true
          })
        } else {
          ipcRenderer.send('export-to-pdf', {})
        }
      },
      endExportMode () {
        if (this.isSlideMode) {
          this.$broadcast('endExportMode')
          this.isPreviewFullScreen = false
          this.$broadcast('exitFullScreen')
        } else {
          this.isPreviewFullScreen = false
        }
      }
    },
    events: {
      update: function (data) {
        if (this.isSlideMode) {
          this.$broadcast('updateSlides', data)
        } else {
          this.$broadcast('updateMarkdown', data)
        }
      },
      transferTo: function (action, data) {
        this.$broadcast(action, data)
      },
      enterPreviewFullScreen: function () {
        this.isPreviewFullScreen = true
        this.$broadcast('enterFullScreen')
      },
      exitPreviewFullScreen: function () {
        this.isPreviewFullScreen = false
        this.$broadcast('exitFullScreen')
      },
      closePreview: function () {
        this.isEditorFullScreen = true
      },
      openPreview: function () {
        this.isEditorFullScreen = false
      },
      openTextMode: function () {
        this.isSlideMode = false
      },
      openSlideMode: function () {
        this.isSlideMode = true
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

  .row {
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
</style>
