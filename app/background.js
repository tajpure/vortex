import { app, BrowserWindow } from 'electron'
import path from 'path'

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  })

  const mainURL = process.env.HOT
    ? `http://localhost:${process.env.PORT}/main.html`
    : 'file://' + path.join(__dirname, 'main.html')

  mainWindow.maximize()
  mainWindow.loadURL(mainURL)

  if (process.env.NODE_ENV !== 'production') {
    mainWindow.openDevTools()
  }

  mainWindow.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    require('electron').shell.openExternal(url)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
