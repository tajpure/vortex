<template>
  <div class="slide-index">
    <!-- {{ slideIndex }}/{{ totalPage }} -->
  </div>
</template>

<script>
  export default {
    props: ['pageinfo'],
    data () {
      return {
        slideIndex: 0,
        totalPage: 0
      }
    },
    ready () {
      if (!this.pageinfo.index) {
        this.pageinfo.index = '0'
      }
      if (!this.pageinfo.total) {
        this.pageinfo.total = '1'
      }
      this.slideIndex = parseInt(this.pageinfo.index) + 1
      this.totalPage = this.pageinfo.total
    }
  }
</script>

<style>
.slide-index {
  float: right;
  margin-right: 10px;
  margin-top: 5px;
}
</style>
