const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const dialog = electron.dialog
const path = require('path')
const util = require('./util.js')
const WindowStat = require('./window_state.js')
// const locale = require('./locale.js')

module.exports = (fileName) => {
  let isSaved = true
  const title = util.fileNameToTitle(fileName)

  const state = WindowStat(fileName, {
    height: 600,
    width: 1200,
    x: 180,
    y: 380
  })

  let curWindow = new BrowserWindow({
    title: title,
    height: state.height,
    width: state.width,
    x: state.x,
    y: state.y,
    icon: path.join(__dirname, '/../assets/icon.ico'),
    autoHideMenuBar: true
  })

  if (state.isMaximized) {
    curWindow.maximize()
  }

  const mainURL = process.env.HOT
    ? `http://localhost:${process.env.PORT}/main.html`
    : 'file://' + path.join(__dirname, '../main.html')

  curWindow.loadURL(mainURL)

  // if (process.env.NODE_ENV !== 'production') {
  //   curWindow.openDevTools()
  // }

  curWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    shell.openExternal(url)
  })

  curWindow.webContents.on('did-finish-load', () => {
    curWindow.webContents.send('set-window-id', curWindow.id)
    curWindow.webContents.send('set-slide-mode', state.isSlideMode)
    curWindow.webContents.send('set-visibility', state.visibility)
  })

  curWindow.on('close', (event) => {
    if (!isSaved) {
      event.preventDefault()
      const title = curWindow.getTitle()
      const fileName = util.titleToFileBase(title)
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Save', 'Cancel', "Don't Save"],
        title: 'Save File',
        message: "'" + fileName + "' has changes, do you want to save them?",
        detail: 'Your changes will be lost if you close this window without saving.'
      },
      (result) => {
        switch (result) {
          case 0: {
            const fileName = util.titleToFileName(curWindow.getTitle())
            if (!fileName) {
              dialog.showSaveDialog({
                title: 'Save File',
                filters: [{ name: 'Markdown', extensions: ['md'] }],
                defaultPath: 'Untitled.md'
              },
              (fileName) => {
                if (!fileName) return
                curWindow.webContents.send('trigger-save-file', fileName)
                const title = util.fileNameToTitle(fileName)
                curWindow.setTitle(title)
              })
            } else {
              curWindow.webContents.send('trigger-save-file', fileName)
            }
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

  curWindow.on('closed', (event) => {
    event.preventDefault()
    curWindow = null
  })

  return {
    get window () { return curWindow },
    state: state,
    get needToSave () { return !isSaved },
    set needToSave (val) { isSaved = !val }
  }
}
