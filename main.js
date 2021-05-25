const {app, BrowserWindow, Tray} = require("electron")
const path = require("path")
const load = require("./content/backend/load.js")
const api = require("./content/backend/api.js")
const util = require("util")
const exec = require('child_process').exec
const { autoUpdater } = require('electron-updater');
autoUpdater.autoDownload = true
app.disableHardwareAcceleration()

app.on("ready", async () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: "./content/backend/VALORANT_D_TRANSPARENT.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        show: false
    })
    win.setMenuBarVisibility(false)
    /*win.loadFile("./content/ui/functional.html")
    ws.on("connect", async (connection) => {
        connection.send("[5, \"OnJsonApiEvent\"]")
        console.log("connected")
        connection.on("error", async (error) => {
            console.log(error)
        })
        connection.on("message", async (msg) => {
            console.log(msg)
        })
    })
    ws.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });
    var kek = Buffer.from(`LOGIN-TOKEN`, 'utf8').toString('base64');
    ws.connect("wss://127.0.0.1:12345", "wamp", {Authorization: "Basic " + kek}) */
    const splash = new BrowserWindow({width: 200, height: 200, frame: false, alwaysOnTop: true, show: true, transparent: true, webPreferences: {nodeIntegration: true},});
    splash.loadFile(`./content/ui/splash.html`);

    autoUpdater.on("update-available", async () => {
        autoUpdater.on("update-downloaded", async () => {
            autoUpdater.quitAndInstall();
        })
    })
    autoUpdater.on("update-not-available", async () => {
            splash.destroy()
            win.show()
            exec("tasklist", (error, stdout, stderr) => {
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
            setInterval(async () => {
                exec("tasklist", (error, stdout, stderr) => {
                    if(error) return
                    var tasks = stdout.toString().split("\n")
                    var bset = false
                    for(let i = 0; tasks.length > i; i++) {
                        if(tasks[i].includes("VALORANT-Win64-Shipping")) {
                            bset = true
                        }
                    }
                    console.log(bset)
                    if(bset == false) {
                        app.exit()
                    }
                })
            }, 10000)
    })

    autoUpdater.on("error", async (error) => {
        console.log(error)
        splash.destroy()
        win.show()
    })
    autoUpdater.checkForUpdatesAndNotify();
})

app.on("window-all-closed", () => {
    app.quit()
})

app.on("quit", () => {
    app.quit()
})