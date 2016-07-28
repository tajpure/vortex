<template>
  <section class="step slide">
    <div v-html="slide" class="markdown-body">
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
  }
}
</style>
