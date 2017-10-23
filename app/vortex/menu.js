'use stricts'
const electron = require('electron')
const Menu = electron.Menu
const dialog = electron.dialog
const util = require('./util.js')

module.exports = (options) => {
  let isFullScreen = false
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          click (item, focusedWindow) {
            options.newWindow()
          }
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click (item, focusedWindow) {
            dialog.showOpenDialog({
              title: 'Open File',
              filters: [
                { name: 'Text', extensions: ['txt', 'md'] },
                { name: 'All Files', extensions: ['*'] }
              ],
              properties: ['openFile', 'multiSelections']
            },
            (fileNames) => {
              if (!fileNames) return
              options.openFile(fileNames, focusedWindow)
            })
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click (item, focusedWindow) {
            const fileName = focusedWindow.fileName
            if (!fileName) {
              dialog.showSaveDialog({
                title: 'Save File',
                filters: [{ name: 'Markdown', extensions: ['md'] }],
                defaultPath: 'Untitled.md'
              },
              (fileName) => {
                if (!fileName) return
                options.saveFile(fileName, focusedWindow)
              })
            } else {
              options.saveFile(fileName, focusedWindow)
            }
          }
        },
        {
          label: 'Save as...',
          accelerator: 'CmdOrCtrl+Shift+S',
          click (item, focusedWindow) {
            dialog.showSaveDialog({
              title: 'Save File As...',
              filters: [{ name: 'All Files', extensions: ['*'] }],
              defaultPath: 'Untitled'
            },
            (fileName) => {
              if (!fileName) return
              options.saveFile(fileName, focusedWindow)
              const title = util.fileNameToTitle(fileName)
              focusedWindow.setTitle(title)
            })
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Export as pdf',
          accelerator: 'CmdOrCtrl+E',
          click (item, focusedWindow) {
            dialog.showSaveDialog({
              title: 'Export As PDF',
              filters: [{ name: 'PDF', extensions: ['pdf'] }],
              defaultPath: 'Untitled.pdf'
            },
            (fileName) => {
              if (!fileName) return
              options.exportPDF(fileName, focusedWindow)
            })
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+W',
          click (item, focusedWindow) {
            options.exit(focusedWindow)
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload()
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click (item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'F11',
          click (item, focusedWindow) {
            if (focusedWindow) {
              isFullScreen = !isFullScreen
              focusedWindow.setFullScreen(isFullScreen)
            }
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('http://github.com/tajpure/vortex') }
        }
      ]
    }
  ]
  if (process.platform === 'darwin') {
    const name = require('electron').app.getName()
    template.unshift({
      label: name
    })
    template[3].submenu = [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: 'F11',
        click (item, focusedWindow) {
          if (focusedWindow) {
            isFullScreen = !isFullScreen
            focusedWindow.setFullScreen(isFullScreen)
          }
        }
      }
    ]
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
