<template>
  <div class="slide-index" v-bind:class="[theme]">
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
        totalPage: 0,
        theme: ''
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
    },
    events: {
      updateTopBarTheme (theme) {
        this.theme = theme
      }
    }
  }
</script>

<style>
.slide-index {
  position: absolute;
  background-color: rgba(255, 255, 255, 0);
  right: 10px;
  top: 10px;
  font-size: 20px;
  z-index: 999;
}
</style>
