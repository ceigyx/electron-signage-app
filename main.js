/*jshint esversion: 6 */
const { app, BrowserWindow, screen, ipcMain } = require('electron');


var windows = [];

function createWindow () {
  var win;
   win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.loadFile("index.html");
  windows.push(win);
//   console.log(windows);
}

app.whenReady().then(createWindow);


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("window", (event, ...arg) => {
    if (arg[0] === "new") {
        createWindow();
    } else if (arg[0] === "close") {
        var index = arg[1];
        windows[index].close(() => {
        });
        windows.splice(index, 1);
    }
});
