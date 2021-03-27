
const LocalRiotClientAPI = require("./LocalRiotClient.js")
const localRiotClientAPI = LocalRiotClientAPI.initFromLockFile()
const config = require("../config/config.json")
const client = require("discord-rich-presence")(config.clientid)

async function presencef() {
    if(localRiotClientAPI != "No File Found") {
        var presence
        await localRiotClientAPI.getPresence().then(response => {
            //console.log(response.data.presences)
            presence = response.data.presences
        }).catch(error => {
            console.log(error)
            return error
        })
        return presence
    } else {
        return 503
    }
}

async function puuid() {
    if(localRiotClientAPI != "No File Found") {
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
if(localRiotClientAPI != "No File Found") {
    async function fetchpuuid() {
        cpuuid = await puuid()
    }
    fetchpuuid()
    client.updatePresence({
        state: "Client Startup",
        largeImageKey: "logo-val",
        startTimestamp: startTime,
        instance: true
    })
}

var maps = {
    '/Game/Maps/Triad/Triad': "Haven",
    '/Game/Maps/Duality/Duality': "Bind",
    '/Game/Maps/Bonsai/Bonsai': "Split",
    '/Game/Maps/Port/Port': "Icebox",
    "/Game/Maps/Ascent/Ascent": "Ascent"
}
var mode = {
    "": "Custom Games",
    "unrated": "Ungewertet",
    "spikerush": "Spike Rush",
    "ggteam": "Escalation",
    "competitive": "Gewertet"
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
            var possible_party_size
            jsondata.queueId == "" ? possible_party_size = 10 : possible_party_size = 5
            var is_idle
            jsondata.isIdle == false ? is_idle = `In Lobby (${mode[jsondata.queueId]})` : is_idle = "AFK"
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
            client.updatePresence({
                state: `${maps[jsondata.matchMap]} ${jsondata.partyOwnerMatchScoreAllyTeam} - ${jsondata.partyOwnerMatchScoreEnemyTeam}`,
                details: states[jsondata.sessionLoopState],
                startTimestamp: startTime,
                largeImageKey: maps[jsondata.matchMap].toLowerCase(),
                largeImageText: maps[jsondata.matchMap],
                instance: true
            })
        }
    }
}, 20000)


