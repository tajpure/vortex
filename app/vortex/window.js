import { BrowserWindow, shell } from 'electron'
import path from 'path'
import Util from './util.js'
import windowStat from './window_state.js'

module.exports = (fileName) => {
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

  curWindow.on('close', (event) => {
    if (!state.isSaved) {
      event.preventDefault()
      state.saveState(curWindow)
      curWindow.close()
    }
  })

  curWindow.on('closed', () => {
    curWindow = null
  })

  return curWindow
}
