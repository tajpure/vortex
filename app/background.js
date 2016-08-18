const electron = require('electron')
const app = electron.app
const ipcMain = electron.ipcMain
const dialog = electron.dialog
const fs = require('fs')
const VortexMenu = require('./vortex/menu.js')
const WindowManager = require('./vortex/window_manager.js')
const WindowStat = require('./vortex/window_state.js')


function openFile (fileName) {
  let newWindow = WindowManager.newWindow(fileName)
  newWindow.webContents.on('did-finish-load', () => {
    fs.readFile(fileName, 'utf-8', (err, data) => {
      if (err) {
        console.error(err)
        dialog.showErrorBox('File Read Error', err.message)
      } else {
        newWindow.webContents.send('open-file', data)
      }
    })
  })
}

app.on('ready', () => {
  const state = WindowStat('Untitled', {
    height: 600,
    width: 1200,
    x: 180,
    y: 380
  })
  if (state.lastItem && state.lastItem !== 'Untitled') {
    const fileName = state.lastItem
    openFile(fileName)
  } else {
    WindowManager.newWindow('Untitled')
  }

  VortexMenu({
    newWindow: () => {
      WindowManager.newWindow('Untitled')
    },
    openFile: (fileNames, focusedWindow) => {
      if (!fileNames || !focusedWindow) return
      const fileName = fileNames[0]
      openFile(fileName)
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
