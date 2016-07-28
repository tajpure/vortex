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
    data () {
      return {
      }
    },
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
  .row {
    display: flex;
    flex-direction: row;
    height: 100%;

    .col {
      width: 50%;
    }
    .editor {
      ::-webkit-scrollbar-track {
        background-color: #f7f7f7;
      }
      ::-webkit-scrollbar {
        width: 12px;
        background-color: #f7f7f7;
      }
      ::-webkit-scrollbar-thumb {
        background-color: #616161;
      }
    }
    .preview {
      height: 100%;
      overflow: hidden;
    }
  }
</style>
