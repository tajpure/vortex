<template>
  <div class="slide-index">
    {{ slideIndex }}/{{ totalPage }}
  </div>
</template>

<script>
  export default {
    props: ['pageinfo'],
    watch: {
      'pageinfo': {
        handler: function (val, oldVal) {
          this.updateIndex()
        },
        deep: true
      }
    },
    data () {
      return {
        slideIndex: 0,
        totalPage: 0
      }
    },
    ready () {
      this.updateIndex()
    },
    methods: {
      updateIndex () {
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
  }
</script>

<style>
.slide-index {
  position: absolute;
  right: 10px;
  top: 10px;
  color: #9E9E9E;
  font-size: 20px;
}
</style>
