<template>
  <section class="step slide" v-show="slide.current">
    <div v-html="slide.content" class="markdown-body"
    v-bind:class="{ 'fade': !exportMode, 'not-full-screen': !fullScreenMode, 'full-screen': fullScreenMode}">
    <div>
  </section>
</template>

<script>
  export default {
    props: ['slide'],
    data () {
      return {
        fullScreenMode: false,
        exportMode: false
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
    height: 100%;
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
    width: 80%;
    font-size: 32px;
    padding-left: 10%;
    padding-right: 10%;

    .mermaid {
      font-size: 18px;
    }
  }
}

.fade {
  -webkit-animation-name: fade;
  -webkit-animation-duration: 1.5s;
  animation-name: fade;
  animation-duration: 1.5s;
}

@-webkit-keyframes fade {
  from {opacity: .4}
  to {opacity: 1}
}

@keyframes fade {
  from {opacity: .4}
  to {opacity: 1}
}
</style>
