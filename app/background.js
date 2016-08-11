import { app, ipcMain } from 'electron'
import fs from 'fs'
import VortexMenu from './vortex/menu.js'
import VortexWindow from './vortex/window.js'

app.on('ready', () => {
  VortexWindow('Untitled')

  ipcMain.on('save-file', (event, fileName, data) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) console.error(err)
    })
  })

  VortexMenu({
    newWindow: () => {
      VortexWindow('Untitled')
    },
    openFile: (fileNames, window) => {
      if (fileNames === undefined) return
      const fileName = fileNames[0]
      let newWindow = VortexWindow(fileName)
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
    exportPDF: (fileName, focusedWindow) => {
      if (!fileName) return
      ipcMain.once('export-to-pdf', (event, options) => {
        focusedWindow.webContents.printToPDF(options, (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          fs.writeFile(fileName, data, (err) => {
            if (err) console.error(err)
          })
        })
        focusedWindow.webContents.send('end-export-mode')
      })
      focusedWindow.webContents.send('start-export-mode')
    },
    exit: (focusedWindow) => {
      focusedWindow.close()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
