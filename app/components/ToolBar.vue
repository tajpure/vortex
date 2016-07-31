<template>
  <ul class='menu'>
    <li>
      <i class='material-icons'>format_bold</i>
    </li>
    <li>
      <i class='material-icons'>format_italic</i>
    </li>
    <li>
      <i class='material-icons'>format_quote</i>
    </li>
    <li>
      <i class='material-icons'>strikethrough_s</i>
    </li>
    <li>
      <i class='material-icons'>format_underlined</i>
    </li>
    <li>
      <i class='material-icons'>title</i>
    </li>
    <li>
      <i class='material-icons'>insert_link</i>
    </li>
    <li>
      <i class='material-icons'>insert_photo</i>
    </li>
    <li>
      <i class='material-icons'>format_list_numbered</i>
    </li>
    <li>
      <i class='material-icons'>format_list_bulleted</i>
    </li>
    <li>
      <i class='material-icons'>functions</i>
    </li>
    <li>
      <i class='material-icons'>flag</i>
    </li>
    <li>
      <i class='material-icons'>search</i>
    </li>
    <li>
      <i class='material-icons'>visibility_off</i>
    </li>
    <li v-on:click='showSlide'>
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
  background-color: #f6f6f6;
  list-style: none;
  padding: 0;
  margin: 0;
  height: 24px;
  border-bottom: 1px solid #E0E0E0;

  li {
    margin-right: 8px;
    display: inline;
    color: #616161;
    cursor: pointer;
  }
}
</style>
