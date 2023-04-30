import { app, BrowserWindow, shell, ipcMain, Menu, dialog } from 'electron'
import { release } from 'node:os'
import fs from 'node:fs'
import { join } from 'node:path'
import { update } from './update'
import { ModelActions } from '../../src/actions/ModelActions'
import { ScreenActions } from '../../src/actions/ScreenActions'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.NODE_ENV = 'production'
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
const helpHtml = join(process.env.DIST, 'help.html')
const appIcon = join(process.env.PUBLIC, 'favicon.ico')
async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: appIcon,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  win.maximize()
  if (url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    //win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(mainMenuTemplate))
  // Apply electron-updater
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.on('imageUrl', (e, data) => {
  let printWindow = new BrowserWindow({
    title: "Печать",
    parent: win,
    modal: true,
    icon: appIcon,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  printWindow.setMenu(null)
  printWindow.on('page-title-updated', function(e) {
    e.preventDefault()
  });
  printWindow.loadURL(data)
  printWindow.on('close', () => {
    printWindow = null
  })
})


const mainMenuTemplate = [
  {
      label: 'Файл',
      submenu: [
          {
              label: 'Новый',
              click(){
                win.webContents.send('dispatchAction', ModelActions.newProject())
              }
          },
          {
            label: 'Открыть',
            click(){
              const file = dialog.showOpenDialogSync(win, {title: "Открыть проект", filters: [{ name: 'Файл проекта', extensions: ['json'] }], properties:['openFile']});
              var content = ""
              if(file){
                content = fs.readFileSync(file[0], {encoding: 'utf-8'});
                try {
                    content = JSON.parse(content);
                } catch (e) {
                    content = {}
                }
                win.webContents.send('dispatchAction', { type: ModelActions.SET_PROJECT, payload: content });
              }
            }
          },
          {
              label: 'Сохранить',
              click(){
                win.webContents.send('dispatchAction', ModelActions.saveProject())
              }
          },
         {
          label: 'Печать',
          click(){
            win.webContents.send('dispatchAction', ScreenActions.print({save: false}))
          }
        },
          {
              label: 'Выход',
              accelerator: process.platform === 'darwin' ? 'Command+Q': 'Ctrl+Q',
              click(item, window){
                  app.quit()
              }
          }
      ]
  },
  {
    label: 'Справка',
    click(){
      let helpWindow = new BrowserWindow({
        title: "Справка",
        width: 600,
        height: 300,
        icon: appIcon,
        parent: win,
        modal: true,
      })
      helpWindow.maximizable = false
      helpWindow.resizable = false
      helpWindow.setMenu(null)
      helpWindow.loadURL(helpHtml)
      helpWindow.on('close', () => {
        helpWindow = null
      })
    }
  }
]

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
      label: 'DevTools',
      submenu: [
          {
              label: 'Toggle DevTools',
              click(_, focusedWindow){
                  focusedWindow.webContents.toggleDevTools()
              }
          }
      ]
  })
}