/*jshint esversion: 6 */
const { app, BrowserWindow, screen, ipcMain } = require('electron');
const { httpsGet } = require("./fetch/megabusApi");

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
  setInterval(() => {
    var schedule;
    new Promise((resolve, reject) => {
      resolve(httpsGet("ca.megabus.com", "/journey-planner/api/schedule/280/145"));
  
    }).then((data) => {
      schedule = data;
      console.log("updated");
      windows[0].webContents.send("update", "schedule", JSON.stringify(schedule)); 
    }).catch(() => {
      console.log("ERROR: Connection Error");
    });
  }, 10000);
  
});