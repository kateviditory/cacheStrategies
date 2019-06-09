const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module to create menu
const Menu= electron.Menu

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window with maximum size.
  mainWindow = new BrowserWindow({show: false})
  mainWindow.maximize()
  mainWindow.show()

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
 mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
    
  var menu = Menu.buildFromTemplate([
      {
          label: 'Программа',
          submenu: [
              { label:'Перезагрузить', role:'reload'},
              { type: 'separator'},
              { label:'Выход', role:'close'}
          ]
      },
      {
          label: 'Разделы',
          submenu: [
              { label:'Главная страница', click() {
                mainWindow.loadURL(url.format({
                  pathname: path.join(__dirname, 'index.html'),
                  protocol: 'file:',
                  slashes: true
                }))
              }},
              { type: 'separator'},
              { label:'Базовые стратегии', click() {
                mainWindow.loadURL(url.format({
                  pathname: path.join(__dirname, 'mainStrategies/index.html'),
                  protocol: 'file:',
                  slashes: true
                }))
              }},
              { type: 'separator'},
              { label:'Стратегия ARC', click() {
                mainWindow.loadURL(url.format({
                  pathname: path.join(__dirname, 'arc/index.html'),
                  protocol: 'file:',
                  slashes: true
                }))
              }},
              { type: 'separator'},
              { label:'Стратегия CAR', click(){
                mainWindow.loadURL(url.format({
                  pathname: path.join(__dirname, 'car/index.html'),
                  protocol: 'file:',
                  slashes: true
                }))
              }}
          ]
      },
      {
          label: 'Вид',
          submenu: [
              { label:'Уменьшить', role: 'zoomout'},
              { label:'Увеличить', role: 'zoomin'}
          ]
      },
      {
          label: 'Справка',
          submenu: [
              { label:'О программе',
                click() {
                    var manual = new BrowserWindow({ width: 800, height: 600 });
                    manual.loadURL(url.format({
                        pathname: path.join(__dirname, 'manual.html'),
                        protocol: 'file:',
                        slashes: true
                    }))
                    manual.setMenu(null)
                }
              },
              { label:'Сайт Electron',
                click () { require('electron').shell.openExternal('https://electronjs.org') }
              },
              { label:'Документация Electron', 
                click () { require('electron').shell.openExternal('https://github.com/electron/electron/tree/v2.0.0/docs#readme') }
              }
          ]
      }
  ])
  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
