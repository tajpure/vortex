<template>
  <ul class='menu'>
    <li class='yellow'>
      <i class='material-icons'>flag</i>
    </li>
    <li>
      <i class='material-icons'>search</i>
    </li>
    <li class='purple'>
      <i class='material-icons'>visibility_off</i>
    </li>
    <li v-on:click='showSlide' class='blue'>
      <i class='material-icons'>slideshow</i>
    </li>
  </ul>
</template>

<script>
  export default {
    methods: {
      showSlide () {
        this.$dispatch('showSlide')
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
