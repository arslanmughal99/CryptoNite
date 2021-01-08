import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

// Core modules
import ipcHandler from './core/ipc/ipcHandler';
import trayHandler from './core/trayModule/tray';

let win: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
app.requestSingleInstanceLock();

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

function createWindow(): BrowserWindow {

  // Create the browser window.
  win = new BrowserWindow({
    width: 380,
    height: 600,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      devTools: serve ? false : true,
      enableRemoteModule: true,
      allowRunningInsecureContent: (serve) ? true : false,
    },
  });

  win.setAlwaysOnTop(true, 'floating')

  // Removing the menu
  win.setMenu(null);

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }


  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });

  return win;
}

try {
  app.on('ready', _ => {
    createWindow();
    // Core backend handler
    trayHandler(win, serve);
    ipcHandler();
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {

}
