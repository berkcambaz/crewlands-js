const { app, BrowserWindow } = require("electron");

function createWindow() {
  let win = new BrowserWindow({
    show: false,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.setMenuBarVisibility(false);
  win.maximize();
  win.show();

  win.loadFile("./index.html");
}

app.on("ready", createWindow);