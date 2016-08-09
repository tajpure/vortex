import { BrowserWindow, shell } from 'electron'
import path from 'path'
import Util from './util.js'

module.exports = (fileName) => {
  const title = Util.fileNameToTitle(fileName)

  let curWindow = new BrowserWindow({
    title: title,
    icon: path.join(__dirname, '../../build/resources/icon.png')
  })

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

  return curWindow
}
