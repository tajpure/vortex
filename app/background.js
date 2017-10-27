'use stricts'
const electron = require('electron')
const app = electron.app
const ipcMain = electron.ipcMain
const dialog = electron.dialog
const fs = require('fs')
const VortexMenu = require('./lib/menu.js')
const WindowManager = require('./lib/window_manager.js')
const WindowStat = require('./lib/window_state.js')

function openFile (filename) {
  let newWindow = WindowManager.newWindow(filename)
  newWindow.webContents.on('did-finish-load', () => {
    fs.readFile(filename, 'utf-8', (err, data) => {
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
    const filename = state.lastItem
    openFile(filename)
  } else {
    WindowManager.newWindow('Untitled')
  }

  VortexMenu({
    newWindow: () => {
      WindowManager.newWindow('Untitled')
    },
    openFile: (filenames, focusedWindow) => {
      if (!filenames || !focusedWindow) return
      const filename = filenames[0]
      openFile(filename)
    },
    saveFile: (filename, focusedWindow) => {
      if (!filename || !focusedWindow) return
      focusedWindow.webContents.send('trigger-save-file', filename)
    },
    exportPDF: (filename, focusedWindow) => {
      if (!filename) return
      ipcMain.once('export-to-pdf', (event, options) => {
        focusedWindow.webContents.printToPDF(options, (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          fs.writeFile(filename, data, (err) => {
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
