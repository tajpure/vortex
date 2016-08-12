<template>
  <ul class='menu'>
    <li v-on:click='switchMode' title='Mode' class='yellow'>
      <i class='material-icons' v-show='isSlideMode'>computer</i>
      <i class='material-icons' v-show='!isSlideMode'>mode_edit</i>
    </li>
    <li v-on:click='switchPreview' title='Preview' class='purple'>
      <i class='material-icons' v-show='!visibility'>visibility_off</i>
      <i class='material-icons' v-show='visibility'>visibility</i>
    </li>
    <li v-on:click='enterPreviewFullScreen' title='Start' class='blue'>
      <i class='material-icons'>slideshow</i>
    </li>
  </ul>
</template>

<script>
  import { ipcRenderer } from 'electron'

  export default {
    watch: {
      'isSlideMode': {
        handler: function (val, oldVal) {
          ipcRenderer.send('update-slide-mode', this.winId, val)
        }
      },
      'visibility': {
        handler: function (val, oldVal) {
          ipcRenderer.send('update-visibility', this.winId, val)
        }
      }
    },
    ready () {
      const self = this
      ipcRenderer.once('set-slide-mode', (event, isSlideMode) => {
        self.isSlideMode = isSlideMode
      })
      ipcRenderer.once('set-visibility', (event, visibility) => {
        self.visibility = visibility
      })
      ipcRenderer.on('set-window-id', (event, id) => {
        this.winId = id
      })
    },
    data () {
      return {
        visibility: true,
        isSlideMode: true,
        winId: null
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
          this.$dispatch('transferTo', 'focusEditor')
          this.$dispatch('openTextMode')
        } else {
          this.isSlideMode = true
          this.$dispatch('transferTo', 'focusEditor')
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
    user-select: none;
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
