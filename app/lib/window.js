'use stricts'
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const shell = electron.shell
const dialog = electron.dialog
const path = require('path')
const util = require('./util.js')
const WindowStat = require('./window_state.js')
// const locale = require('./locale.js')

module.exports = (filename) => {
  let isSaved = true
  let title = util.filenameToTitle(filename)

  const state = WindowStat(filename, {
    height: 600,
    width: 1200,
    x: 180,
    y: 380
  })

  const getIconPath = () => {
    return process.platform === 'win32'
      ? path.join(__dirname, '/../assets/icon.ico')
      : path.join(__dirname, '/../assets/icon.png')
  }

  let curWindow = new BrowserWindow({
    title: title,
    height: state.height,
    width: state.width,
    frame: true,
    titleBarStyle: 'hidden-inset',
    x: state.x,
    y: state.y,
    icon: getIconPath(),
    autoHideMenuBar: true
  })

  curWindow.filename = util.titleToFilename(title)

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
    curWindow.webContents.send('set-file-name', title)
  })

  curWindow.on('close', (event) => {
    if (!isSaved) {
      event.preventDefault()
      const filename = util.titleToFileBase(title)
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Save', 'Cancel', "Don't Save"],
        title: 'Save File',
        message: "'" + filename + "' has changes, do you want to save them?",
        detail: 'Your changes will be lost if you close this window without saving.'
      },
      (result) => {
        switch (result) {
          case 0: {
            const filename = util.titleToFilename(title)
            if (!filename) {
              dialog.showSaveDialog({
                title: 'Save File',
                filters: [{ name: 'Markdown', extensions: ['md'] }],
                defaultPath: 'Untitled.md'
              },
              (filename) => {
                if (!filename) return
                curWindow.webContents.send('trigger-save-file', filename)
                const title = util.filenameToTitle(filename)
                curWindow.setTitle(title)
              })
            } else {
              curWindow.webContents.send('trigger-save-file', filename)
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
    get title () { return title },
    set title (value) {
      title = value
      curWindow.filename = util.titleToFilename(title)
    },
    state: state,
    get needToSave () { return !isSaved },
    set needToSave (value) { isSaved = !value }
  }
}
