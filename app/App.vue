<template>
  <div class="row">
    <div class="col editor">
      <editor></editor>
    </div>
    <div class="col preview">
      <preview></preview>
    </div>
  </div>
</template>

<script>
  import Editor from './components/Editor'
  import Preview from './components/Preview'

  export default {
    components: {
      Editor,
      Preview
    },
    events: {
      'transferTo': function (action, data) {
        this.$broadcast(action, data)
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
    src: url(../static/font/MaterialIcons-Regular.eot);
    src: local('Material Icons'),
         local('MaterialIcons-Regular'),
         url(../static/font/MaterialIcons-Regular.woff2) format('woff2'),
         url(../static/font/MaterialIcons-Regular.woff) format('woff'),
         url(../static/font/MaterialIcons-Regular.ttf) format('truetype');
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

    .col {
      width: 50%;
    }
    .editor {
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
      height: 100%;
      overflow: hidden;
      background-color: #E0E0E0;
    }
  }
</style>
