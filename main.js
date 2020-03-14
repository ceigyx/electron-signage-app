/*jshint esversion: 8 */
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const { megabusApi } = require("./modules/megabusApi");
const { poll } = require("./modules/polling");

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
  win.loadFile("./ui/controlPanel.html");
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


//fetch & update through megabusAPI
app.on("ready", () => {



  poll(() => megabusApi.journey('15948783')
  .then(console.log,
    console.log
  ), 1000);
});

process.on('uncaughtException', (err) => {
  console.log("UNCAUGHT!!  "+err);
});