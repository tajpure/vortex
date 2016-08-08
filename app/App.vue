<template>
  <div class="row">
    <div class="editor" v-show="!isPreviewFullScreen"
      v-bind:class="{ 'full-screen': isEditorFullScreen }">
      <editor></editor>
    </div>
    <div class="preview" v-show="!isEditorFullScreen"
      v-bind:class="{ 'full-screen': isPreviewFullScreen }">
      <textpreview v-show='!isSlideMode'></textpreview>
      <slidepreview v-show='isSlideMode'></slidepreview>
    </div>
  </div>
</template>

<script>
  import editor from './components/Editor'
  import slidepreview from './components/SlidePreview'
  import textpreview from './components/TextPreview'

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
      const storage = require('electron-json-storage')
      storage.get('settings', function (error, data) {
        if (error) {
          throw error
        }
        this.isSlideMode = data.isSlideMode
        this.isPreviewFullScreen = data.isPreviewFullScreen
        this.isEditorFullScreen = data.isEditorFullScreen
      })
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

  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: local('Material Icons'),
         local('MaterialIcons-Regular'),
         url(../static/font/MaterialIcons-Regular.woff) format('woff');
  }

  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    width: 24px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'liga';
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
  }
</style>
