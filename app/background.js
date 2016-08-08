import { app, ipcMain } from 'electron'
import fs from 'fs'
import VortexMenu from './vortex/menu.js'
import VortexWindow from './vortex/window.js'

let mainWindow
app.on('ready', () => {
  mainWindow = VortexWindow('Untitled')

  mainWindow.maximize()

  ipcMain.on('save-file', (event, fileName, data) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) console.error(err)
    })
  })

  VortexMenu({
    newWindow: () => {
      let newWindow = VortexWindow('Untitled')
      newWindow.maximize()
      newWindow.on('closed', () => {
        newWindow = null
      })
    },
    openFile: (fileNames, window) => {
      if (fileNames === undefined) return
      const fileName = fileNames[0]
      let newWindow = VortexWindow(fileName)
      newWindow.maximize()
      newWindow.on('closed', () => {
        newWindow = null
      })
      newWindow.webContents.on('did-finish-load', () => {
        fs.readFile(fileName, 'utf-8', (err, data) => {
          if (err) console.error(err)
          newWindow.webContents.send('open-file', data)
        })
      })
    },
    saveFile: (fileName, focusedWindow) => {
      if (!fileName) return
      focusedWindow.webContents.send('trigger-save-file', fileName)
    },
    exportAs: (fileNames) => {
      console.log(fileNames)
    },
    exit: () => {
      console.log('exit')
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
