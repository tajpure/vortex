const app = require('electron').app
const ipcMain = require('electron').ipcMain
const dialog = require('electron').dialog
const fs = require('fs')
const VortexMenu = require('./vortex/menu.js')
const VortexWindow = require('./vortex/window.js')

app.on('ready', () => {
  VortexWindow('Untitled')

  ipcMain.on('save-file', (event, fileName, data) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        console.error(err)
        dialog.showErrorBox('File Save Error', err.message)
      }
    })
  })

  VortexMenu({
    newWindow: () => {
      VortexWindow('Untitled')
    },
    openFile: (fileNames, focusedWindow) => {
      if (!fileNames || !focusedWindow) return
      const fileName = fileNames[0]
      let newWindow = VortexWindow(fileName)
      newWindow.webContents.on('did-finish-load', () => {
        fs.readFile(fileName, 'utf-8', (err, data) => {
          if (err) {
            console.error(err)
            dialog.showErrorBox('File Read Error', err.message)
          }
          newWindow.webContents.send('open-file', data)
        })
      })
    },
    saveFile: (fileName, focusedWindow) => {
      if (!fileName || !focusedWindow) return
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
            if (err) {
              console.error(err)
              dialog.showErrorBox('File Export Error', err.message)
            }
          })
        })
        focusedWindow.webContents.send('end-export-mode')
      })
      focusedWindow.webContents.send('start-export-mode')
    },
    exit: (focusedWindow) => {
      if (!focusedWindow) return
      focusedWindow.close()
    }
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
