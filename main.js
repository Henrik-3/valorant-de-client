const {app, BrowserWindow, Tray} = require("electron")
const path = require("path")
const load = require("./content/backend/load.js")
const api = require("./content/backend/api.js")
const util = require("util")
const exec = require('child_process').exec;
const exectasklist = util.promisify(require('child_process').exec)

app.whenReady().then(async () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: "./content/backend/VALORANT_D_TRANSPARENT.png",
        webPreferences: {
            nodeIntegration: true
        }
    })
    win.setResizable(false)
    win.setMenuBarVisibility(false)
    
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

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length == 0) {
            createWindow()
        }
    })
})

app.on("window-all-closed", () => {
    app.quit()
})

app.on("quit", () => {
    app.quit()
})
