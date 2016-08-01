<template>
  <section class="step slide fade" v-show="slide.isShowed">
    <div v-html="slide.content" class="markdown-body">
    <div>
  </section>
</template>

<script>
  export default {
    props: ['slide']
  }
</script>

<style lang="scss">
.slide {
  height: 100%;
  width: 100%;

  .markdown-body {
    width: 80%;
    padding-top: 24%;
    padding-left: 10%;
    padding-right: 10%;
    font-size: 24px;
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
}
</style>
