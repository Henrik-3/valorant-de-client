const {app, BrowserWindow, Tray} = require("electron")
const path = require("path")
const load = require("./content/load.js")
const api = require("./content/api.js")

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: "./content/VALORANT_D_TRANSPARENT.png",
    })
    win.loadFile("./content/index.html")
    win.setResizable(false)
    win.setMenuBarVisibility(false)
}

app.whenReady().then(() => {
    createWindow()
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length == 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    app.quit()
})
