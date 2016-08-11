import { BrowserWindow, shell, dialog, ipcMain } from 'electron'
import path from 'path'
import Util from './util.js'
import windowStat from './window_state.js'

module.exports = (fileName) => {
  let contentChanged = false
  const title = Util.fileNameToTitle(fileName)

  const state = windowStat(fileName, {
    height: 600,
    width: 1200
  })

  let curWindow = new BrowserWindow({
    title: title,
    height: state.height,
    width: state.width,
    x: state.x,
    y: state.y,
    icon: path.join(__dirname, 'static/images/logo.png')
  })

  if (state.isMaximized) {
    curWindow.maximize()
  }

  const mainURL = process.env.HOT
    ? `http://localhost:${process.env.PORT}/main.html`
    : 'file://' + path.join(__dirname, 'main.html')

  curWindow.loadURL(mainURL)

  if (process.env.NODE_ENV !== 'production') {
    curWindow.openDevTools()
  }

  curWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })

  ipcMain.on('content-changed', (e) => {
    if (!curWindow) return
    const title = curWindow.getTitle()
    curWindow.setTitle(Util.addStarOnTitle(title))
    contentChanged = true
  })

  ipcMain.on('content-saved', (e, fileName) => {
    if (!curWindow) return
    const title = curWindow.getTitle()
    const curWindowFileName = Util.titleToFileName(title)
    if (fileName === curWindowFileName) {
      curWindow.setTitle(Util.removeStarOnTitle(title))
      contentChanged = false
    }
  })

  curWindow.on('close', (event) => {
    if (contentChanged) {
      event.preventDefault()
      const title = curWindow.getTitle()
      const fileName = Util.titleToFileBase(title)
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Save', 'Cancel', "Don't Save"],
        title: 'Save File',
        message: "'" + fileName + "' has changes, do you want to save them?",
        detail: 'Your changes will be lost if you close this item without saving.'
      },
      (result) => {
        switch (result) {
          case 0: {
            break
          }
          case 1: {
            break
          }
          case 2: {
            if (!state.isSaved) {
              state.saveState(curWindow)
            }
            curWindow.destroy()
            break
          }
          default: break
        }
      })
    } else {
      if (!state.isSaved) {
        event.preventDefault()
        state.saveState(curWindow)
        curWindow.destroy()
      }
    }
  })

  curWindow.on('closed', () => {
    curWindow = null
  })

  return curWindow
}
