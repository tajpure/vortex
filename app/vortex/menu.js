import { Menu, dialog } from 'electron'
import Util from './util.js'

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
              filters: [
                { name: 'Text', extensions: ['txt', 'md'] },
                { name: 'All Files', extensions: ['*'] }
              ],
              properties: ['openFile', 'multiSelections']
            },
            (fileNames) => {
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
            const fileName = Util.titleToFileName(focusedWindow.getTitle())
            if (!fileName) {
              dialog.showSaveDialog({
                filters: [
                  { name: 'Text', extensions: ['txt', 'md'] },
                  { name: 'All Files', extensions: ['*'] }
                ],
                defaultPath: 'Untitled.md'
              },
              (fileName) => {
                options.saveFile(fileName, focusedWindow)
              })
            } else {
              options.saveFile(fileName, focusedWindow)
            }
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Export as pdf',
          accelerator: 'CmdOrCtrl+X',
          click (item, focusedWindow) {
            options.exportAs('')
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
    const name = require('electron').remote.app.getName()
    template.unshift({
      label: name,
      submenu: [
        {
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          role: 'services',
          submenu: []
        },
        {
          type: 'separator'
        },
        {
          role: 'hide'
        },
        {
          role: 'hideothers'
        },
        {
          role: 'unhide'
        },
        {
          type: 'separator'
        },
        {
          role: 'quit'
        }
      ]
    })
    template[3].submenu = [
      {
        label: 'Close',
        accelerator: 'CmdOrCtrl+W',
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      },
      {
        label: 'Zoom',
        role: 'zoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    ]
  }
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
