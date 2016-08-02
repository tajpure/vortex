<template>
  <section class="step slide fade" v-show="slide.isShowed">
    <div v-html="slide.content" class="markdown-body"
    v-bind:class="[mode]">
    <div>
  </section>
</template>

<script>
  export default {
    props: ['slide'],
    data () {
      return {
        mode: 'not-full-screen'
      }
    },
    events: {
      'showSlide': function () {
        this.mode = 'full-screen'
      },
      'exitSlide': function () {
        this.mode = 'not-full-screen'
      }
    }
  }
</script>

<style lang="scss">
.slide {
  height: 100%;
  width: 100%;

  .markdown-body {
    padding-top: 50%;
  }

  .not-full-screen {
    width: 80%;
    font-size:  18px;
    padding-left: 10%;
    padding-right: 10%;
    -webkit-transform:translate3d(0, -25%, 0);
    transform:translate3d(0, -25%, 0);
  }

  .full-screen {
    width: 64%;
    font-size:  32px;
    padding-left: 18%;
    padding-right: 18%;
    -webkit-transform:translate3d(0, -50%, 0);
    transform:translate3d(0, -50%, 0);
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
