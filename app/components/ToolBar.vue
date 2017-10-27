<template>
  <div class='header'>
    <ul class='menu'>
      <li v-on:click='switchMode' title='Mode'>
        <i class='material-icons' v-show='isSlideMode'>keyboard_voice</i>
        <i class='material-icons' v-show='!isSlideMode'>text_fields</i>
      </li>
      <li v-on:click='switchPreview' title='Preview'>
        <i class='material-icons'>crop_original</i>
      </li>
      <li v-on:click='enterPreviewFullScreen' title='Start'>
        <i class='material-icons'>slideshow</i>
      </li>
    </ul>
    <div class="filename">{{ filename }}</div>
  </div>
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
      ipcRenderer.on('set-file-name', (event, filename) => {
        if (filename) {
          this.filename = filename
        }
      })
    },
    data () {
      return {
        visibility: true,
        isSlideMode: true,
        winId: null,
        filename: 'Untitled'
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
.header {
  background-color: white;
  display: flex;
  flex-direction: row;
  -webkit-app-region: drag;
  min-width: 640px;
}

.menu {
  margin: 6px 0 0 80px;
  padding: 0;
  list-style: none;
  height: 24px;

  li {
    user-select: none;
    margin-right: 8px;
    display: inline;
    color: #616161;
    cursor: pointer;
    font-size: 2px;
  }
}

.filename {
  margin: 10px 0 0 0px;
  color: #616161;
  font-size: 12px;
  overflow: hidden;
}
</style>
