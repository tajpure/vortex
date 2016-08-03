import { app, BrowserWindow, Menu } from 'electron'
import path from 'path'
// import menu from './menu.js'

let mainWindow
app.on('ready', () => {
  const iconName = path.join(__dirname, '../static', 'images', 'test')

  const iconPath = (process.platform === 'win32')
    ? iconName + '.ico'
    : iconName + '.png'

  mainWindow = new BrowserWindow({
    title: 'Vortex',
    icon: iconPath
  })

  const mainURL = process.env.HOT
    ? `http://localhost:${process.env.PORT}/main.html`
    : 'file://' + path.join(__dirname, 'main.html')

  mainWindow.maximize()
  mainWindow.loadURL(mainURL)

  let isFullScreen = false

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          accelerator: 'CmdOrCtrl+N',
          role: 'new'
        },
        {
          type: 'separator'
        },
        {
          label: 'Open',
          accelerator: 'Shift+CmdOrCtrl+O',
          role: 'open'
        },
        {
          label: 'Open Recently',
          accelerator: 'CmdOrCtrl+X',
          role: 'open r'
        },
        {
          type: 'separator'
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          role: 'save'
        },
        {
          label: 'Save as',
          accelerator: 'CmdOrCtrl+S',
          role: 'save a'
        },
        {
          type: 'separator'
        },
        {
          label: 'Export as pdf',
          accelerator: 'CmdOrCtrl+X',
          role: 'export'
        },
        {
          type: 'separator'
        },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+W',
          role: 'exit'
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
