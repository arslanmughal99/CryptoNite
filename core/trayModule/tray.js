"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var tray;
/**
 * @param clickBounds clickbounds
 * @param win window bounds
 * @description calculate new bounds
**/
function handleWindowToggle(clickBounds, win) {
    var windowBounds = win.getBounds();
    var position;
    var currentDisplay = electron_1.screen.getPrimaryDisplay().size;
    if (clickBounds.y <= 100) {
        position = 'top';
    }
    else if (clickBounds.y >= (currentDisplay.height - 100)) {
        position = 'bottom';
    }
    else if (clickBounds.x <= 100) {
        position = 'left';
    }
    else if (clickBounds.x >= currentDisplay.width - 100) {
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
function handleBounds(clickBounds, win) {
    win.setBounds(clickBounds);
}
/**
 * @param win Electron BrowserWindow object
 * @description tray app handler
**/
exports.default = (function (win) {
    var menuTemplate = electron_1.Menu.buildFromTemplate([{ role: 'quit', label: 'exit' }]);
    tray = new electron_1.Tray(path.join(__dirname, '../../dist/assets/icons/tray/app.png'));
    tray.setToolTip('CryptoVault Secure Vault');
    tray.on('right-click', function (_) {
        tray.popUpContextMenu(menuTemplate);
    });
    tray.on('click', function (e, clickBounds) {
        if (win.isVisible()) {
            win.hide();
        }
        else {
            handleWindowToggle(clickBounds, win);
            win.show();
        }
    });
    win.on('blur', function (_) {
        if (win.isVisible()) {
            win.hide();
        }
    });
});
//# sourceMappingURL=tray.js.map