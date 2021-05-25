
const LocalRiotClientAPI = require("./LocalRiotClient.js")
var localRiotClientAPI = LocalRiotClientAPI.initFromLockFile()
const config = require("../../config/config.json")
const { default: axios } = require("axios")
const { response } = require("express")
const client = require("discord-rich-presence")(config.clientid)
const fs = require("fs")

async function getValoStatus() {
    var status
    await axios.get("http://127.0.0.1:42069/client/v1/status").then(response => {
        status = true
    }).catch(error => {
        status = false
    })
    return status
}

async function presencef() {
    if(await getValoStatus() != false) {
        var presence
        await localRiotClientAPI.getPresence().then(response => {
            //console.log(response.data.presences)
            presence = response.data.presences
        }).catch(error => {
            return error
        })
        return presence
    } else {
        return 503
    }
}

async function puuid() {
    if(await getValoStatus() != false) {
        var puuid 
        await localRiotClientAPI.getSession().then(response => {
            puuid = response.data.puuid
        }).catch(error => {
            console.log(error)
            return error
        })
        return puuid
    } else {
        return 503
    }
}

var startTime = new Date()
var cpuuid
async function startup() {
    client.updatePresence({
        state: "Client Startup",
        largeImageKey: "logo-val",
        startTimestamp: startTime,
        instance: true
    })
    if(await getValoStatus() != false) {
        cpuuid = await puuid()
    }
}
startup()

var maps = {
    '/Game/Maps/Triad/Triad': "Haven",
    '/Game/Maps/Duality/Duality': "Bind",
    '/Game/Maps/Bonsai/Bonsai': "Split",
    '/Game/Maps/Port/Port': "Icebox",
    "/Game/Maps/Ascent/Ascent": "Ascent",
    "/Game/Maps/Poveglia/Range": "Range",
    "/Game/Maps/Foxtrot/Foxtrot": "Breeze"
}
var mode = {
    "": "Custom Games",
    "unrated": "Ungewertet",
    "spikerush": "Spike Rush",
    "ggteam": "Escalation",
    "competitive": "Gewertet",
    "onefa": "Klonprogramm",
    "deathmatch": "Deathmatch"
}
var states = {
    "PREGAME": "Agent Selection",
    "INGAME": "Ingame"
}

var rpcycle = setInterval(async () => {
    var presence = await presencef()
    if(presence != 503) {
        var presencefilter = presence.filter(item => item.puuid == cpuuid)
        var ingamedata = Buffer(presencefilter[0].private, "base64").toString("ascii")
        var jsondata = JSON.parse(ingamedata)
        if(jsondata.sessionLoopState == "MENUS") {
            var possible_party_size = jsondata.queueId == "" ? 10 : 5
            var is_idle = jsondata.isIdle == false ? `In Lobby (${mode[jsondata.queueId]})` : "AFK"
            client.updatePresence({
                state: "Party Size",
                details: is_idle,
                startTimestamp: startTime,
                partySize: jsondata.partySize,
                partyMax: possible_party_size,
                largeImageKey: "logo-val",
                instance: true
            })
        } else {
            console.log(jsondata.matchMap)
            client.updatePresence({
                state: `${maps[jsondata.matchMap]} ${jsondata.partyOwnerMatchScoreAllyTeam} - ${jsondata.partyOwnerMatchScoreEnemyTeam}`,
                details: states[jsondata.sessionLoopState] + ` (${mode[jsondata.queueId]})`,
                startTimestamp: startTime,
                largeImageKey: maps[jsondata.matchMap].toLowerCase(),
                largeImageText: maps[jsondata.matchMap],
                instance: true
            })
        }
    }
}, 20000)