import { Tray, BrowserWindow, Menu, screen, Rectangle } from 'electron';
import * as path from 'path';
let tray: Tray;

/**
 * @param clickBounds clickbounds
 * @param win window bounds
 * @description calculate new bounds
**/
function handleWindowToggle(clickBounds: Rectangle, win: BrowserWindow) {
  const windowBounds = win.getBounds();
  let position: 'top' | 'bottom' | 'left' | 'right';
  const currentDisplay = screen.getPrimaryDisplay().size;
  if (clickBounds.y <= 100) {
    position = 'top';
  } else if (clickBounds.y >= (currentDisplay.height - 100)) {
    position = 'bottom';
  } else if (clickBounds.x <= 100) {

    position = 'left';
  } else if (clickBounds.x >= currentDisplay.width - 100) {
    position = 'right';
  }

  switch (position) {
    case 'top':
      handleBounds({
        x: Math.floor(clickBounds.x - (windowBounds.width / 2)),
        y: Math.floor(clickBounds.height),
        height: windowBounds.height,
        width: windowBounds.width
      }, win);
      break;
    case 'bottom':
      handleBounds({
        x: Math.floor(clickBounds.x - (windowBounds.width / 2)),
        y: Math.floor(clickBounds.y - windowBounds.height),
        height: windowBounds.height,
        width: windowBounds.width
      }, win);
      break;
    case 'left':
      handleBounds({
        x: Math.floor(clickBounds.width + clickBounds.x),
        y: Math.floor(currentDisplay.height - windowBounds.height),
        height: windowBounds.height,
        width: windowBounds.width
      }, win);
      break;
    case 'right':
      handleBounds({
        x: Math.floor(clickBounds.x - windowBounds.width),
        y: Math.floor(currentDisplay.height - windowBounds.height),
        height: windowBounds.height,
        width: windowBounds.width
      }, win);
      break;
  }

}

/**
 * @param clickBounds clickboundsRec
 * @param win windowbounds
 * @description Set new window position based on calclated bounds
**/
function handleBounds(clickBounds: Rectangle, win: BrowserWindow) {
  win.setBounds(clickBounds);
}

/**
 * @param win Electron BrowserWindow object
 * @description tray app handler
**/
export default (win: BrowserWindow, serve: Boolean) => {
  let iconSubPath: string = serve ? 'src' : 'dist';
  const menuTemplate = Menu.buildFromTemplate([{ role: 'quit', label: 'exit' }]);

  tray = new Tray(path.join(__dirname, `../../${iconSubPath}/assets/icons/tray/app.png`));
  tray.setToolTip('CryptoNite Secure Vault');

  tray.on('right-click', (_) => {
    tray.popUpContextMenu(menuTemplate);
  });

  tray.on('click', (e, clickBounds) => {
    if(win.isVisible()) {
      win.hide();
    } else {
      handleWindowToggle(clickBounds, win);
      win.show();
    }
  });

  // win.on('blur', _ => {
  //   if (win.isVisible()){
  //     win.hide();
  //   }
  // });

}
