'use stricts'
const electron = require('electron')
const ipcMain = electron.ipcMain
const dialog = electron.dialog
const fs = require('fs')
const util = require('./util.js')
const VortexWindow = require('./window.js')

class WindowManager {

  constructor () {
    this.windowArray = []
    this.addEventListener()
  }

  findWindow (winId, callback) {
    for (let i in this.windowArray) {
      let curWindow = this.windowArray[i]
      if (curWindow && curWindow.window.id === winId) {
        callback(curWindow)
      }
    }
  }

  addEventListener () {
    const self = this
    ipcMain.on('content-changed', (e, winId) => {
      self.findWindow(winId, (curWindow) => {
        curWindow.title = util.addStarOnTitle(curWindow.title)
        curWindow.window.webContents.send('set-file-name', curWindow.title)
        curWindow.needToSave = true
      })
    })

    ipcMain.on('content-saved', (e, winId) => {
      self.findWindow(winId, (curWindow) => {
        curWindow.title = util.removeStarOnTitle(curWindow.title)
        curWindow.window.webContents.send('set-file-name', curWindow.title)
        curWindow.needToSave = false
      })
    })

    ipcMain.on('update-slide-mode', (e, winId, isSlideMode) => {
      self.findWindow(winId, (curWindow) => {
        curWindow.state.isSlideMode = isSlideMode
      })
    })

    ipcMain.on('update-visibility', (e, winId, visibility) => {
      self.findWindow(winId, (curWindow) => {
        curWindow.state.visibility = visibility
      })
    })

    ipcMain.on('set-full-screen', (e, winId, isFullScreen) => {
      self.findWindow(winId, (curWindow) => {
        curWindow.window.setFullScreen(isFullScreen)
      })
    })

    ipcMain.on('show-preview', (e, winId) => {
      self.findWindow(winId, (curWindow) => {
        const sizeArray = curWindow.window.getSize()
        if (!curWindow.state.visibility) {  // when preview opened, not double
          curWindow.window.setSize(sizeArray[0] * 2, sizeArray[1], true)
        }
      })
    })

    ipcMain.on('close-preview', (e, winId) => {
      self.findWindow(winId, (curWindow) => {
        const sizeArray = curWindow.window.getSize()
        curWindow.window.setSize(parseInt(sizeArray[0] / 2, 10), sizeArray[1], true)
      })
    })

    ipcMain.on('save-file', (e, winId, filename, data) => {
      self.findWindow(winId, (curWindow) => {
        curWindow.state.lastItem = filename
        curWindow.title = util.filenameToTitle(filename)
        curWindow.window.webContents.send('set-file-name', curWindow.title)
      })
      fs.writeFile(filename, data, (err) => {
        if (err) {
          console.error(err)
          dialog.showErrorBox('File Save Error', err.message)
        }
      })
    })
  }

  newWindow (filename) {
    const self = this
    const window = VortexWindow(filename)
    window.window.on('closed', () => {
      self.removeWindow()
    })
    this.windowArray.push(window)
    return window.window
  }

  removeWindow () {
    for (let i in this.windowArray) {
      let curWindow = this.windowArray[i]
      if (curWindow && curWindow.window === null) {
        this.windowArray.splice(i, 1)
        break
      }
    }
  }

}

module.exports = new WindowManager()
