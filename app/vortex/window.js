import { BrowserWindow, shell } from 'electron'
import path from 'path'
import Util from './util.js'

const iconName = path.join(__dirname, '../static', 'images', 'test')

const iconPath = (process.platform === 'win32')
  ? iconName + '.ico'
  : iconName + '.png'

module.exports = (fileName) => {
  const title = Util.fileNameToTitle(fileName)

  let curWindow = new BrowserWindow({
    title: title,
    icon: iconPath
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
