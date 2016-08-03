<template>
  <ul class='menu'>
    <li v-on:click='switchMode' class='yellow'>
      <i class='material-icons' v-show='isSlideMode'>computer</i>
      <i class='material-icons' v-show='!isSlideMode'>mode_edit</i>
    </li>
    <li v-on:click='switchPreview' class='purple'>
      <i class='material-icons' v-show='!visibility'>visibility_off</i>
      <i class='material-icons' v-show='visibility'>visibility</i>
    </li>
    <li v-on:click='enterPreviewFullScreen' class='blue'>
      <i class='material-icons'>slideshow</i>
    </li>
  </ul>
</template>

<script>
  export default {
    data () {
      return {
        visibility: true,
        isSlideMode: true
      }
    },
    methods: {
      enterPreviewFullScreen () {
        this.visibility = true
        this.$dispatch('openPreview')
        this.$dispatch('enterPreviewFullScreen')
      },
      switchPreview () {
        if (this.visibility) {
          this.visibility = false
          this.$dispatch('closePreview')
        } else {
          this.visibility = true
          this.$dispatch('openPreview')
        }
      },
      switchMode () {
        if (this.isSlideMode) {
          this.isSlideMode = false
          this.$dispatch('openTextMode')
        } else {
          this.isSlideMode = true
          this.$dispatch('openSlideMode')
        }
      }
    }
  }
</script>

<style lang="scss">
.menu {
  background-color: white;
  list-style: none;
  padding: 3px;
  margin: 0;
  height: 24px;
  border-bottom: 1px solid #E0E0E0;

  li {
    margin-right: 8px;
    display: inline;
    color: #616161;
    cursor: pointer;
  }

  .green {
    color: #8BC34A;
  }

  .red {
    color: #F44336;
  }

  .yellow {
    color: #FFEB3B;
  }

  .pink {
    color: #E91E63;
  }

  .purple {
    color: #9C27B0;
  }

  .blue {
    color: #2196F3;
  }
}
</style>
