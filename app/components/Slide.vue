<template>
  <section class="step slide" v-show="slide.current">
    <div v-html="slide.content" class="markdown-body"
    v-bind:class="{ 'fade': !exportMode, 'not-full-screen': !isFullScreen, 'full-screen': isFullScreen}">
    <div>
  </section>
</template>

<script>
  export default {
    props: ['slide'],
    data () {
      return {
        isFullScreen: false,
        exportMode: false
      }
    },
    events: {
      enterFullScreen: function () {
        this.isFullScreen = true
      },
      exitFullScreen: function () {
        this.isFullScreen = false
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
    display: table-cell;
    vertical-align: middle;
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
