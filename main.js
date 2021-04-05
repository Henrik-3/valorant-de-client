const {app, BrowserWindow, Tray} = require("electron")
const path = require("path")
const load = require("./content/backend/load.js")
const api = require("./content/backend/api.js")
const util = require("util")
const exectasklist = util.promisify(require('child_process').exec)
const { autoUpdater } = require('electron-updater');
autoUpdater.autoDownload = true

app.disableHardwareAcceleration()
app.on("ready", async () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: "./content/backend/VALORANT_D_TRANSPARENT.png",
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    })
    splash = new BrowserWindow({width: 256, height: 256, transparent: true, frame: false, alwaysOnTop: true});
    splash.loadURL(`./content/ui/splash.html`);

    autoUpdater.on("update-available", () => {

    })
    autoUpdater.on("update-not-available", () => {
        splash.destroy()
        win.show()
    })
    win.setMenuBarVisibility(false)
    //win.loadFile("./content/ui/functional.html")
    await exectasklist("tasklist", (error, stdout, stderr) => {
        if(error) return
        var tasks = stdout.toString().split("\n")
        var bset = false
        for(let i = 0; tasks.length > i; i++) {
            if(tasks[i].includes("VALORANT-Win64-Shipping")) {
                bset = true
            }
        }
        bset == false ? win.loadFile("./content/ui/error.html") : win.loadFile("./content/ui/functional.html")
    })
    autoUpdater.checkForUpdatesAndNotify();
})

app.on("window-all-closed", () => {
    app.quit()
})

app.on("quit", () => {
    app.quit()
})

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update_available');
  });
autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});