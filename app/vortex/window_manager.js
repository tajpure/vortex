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
        const title = curWindow.window.getTitle()
        curWindow.window.setTitle(util.addStarOnTitle(title))
        curWindow.needToSave = true
      })
    })

    ipcMain.on('content-saved', (e, winId) => {
      self.findWindow(winId, (curWindow) => {
        const title = curWindow.window.getTitle()
        curWindow.window.setTitle(util.removeStarOnTitle(title))
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

    ipcMain.on('save-file', (e, winId, fileName, data) => {
      self.findWindow(winId, (curWindow) => {
        curWindow.state.lastItem = fileName
      })
      fs.writeFile(fileName, data, (err) => {
        if (err) {
          console.error(err)
          dialog.showErrorBox('File Save Error', err.message)
        }
      })
    })
  }

  newWindow (fileName) {
    const self = this
    const window = VortexWindow(fileName)
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
