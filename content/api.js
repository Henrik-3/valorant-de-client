const express = require("express")
const app = express()
const axios = require("axios")
const exec = require("child_process").execFile
const LocalRiotClientAPI = require("./LocalRiotClient.js")
var localRiotClientAPI = LocalRiotClientAPI.initFromLockFile()

app.get("/ingame/v1/join/:id", async (req, res) => {
    var id = req.params.id

    var credentials_data
    var credentials_success
    await localRiotClientAPI.getCredentials().then(response => {
        credentials_success = true
        credentials_data = response.data
    }).catch(error => {
        credentials_success = false
        res.send(400)
    })

    if(credentials_success == true) {
        var server_region
        await localRiotClientAPI.getServerRegion().then(response => {
            server_region = response.data.affinities.live
        }).catch(error => {
            res.send(400)
        })

        var party_data
        await axios.get(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/players/${credentials_data.subject}`, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            party_data = response.data
        }).catch(error => {
            console.log(error)
            res.send(400)
        })

        var open_success
        await axios.post(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/players/${credentials_data.subject}/joinparty/${id}`, {Accessibility: "OPEN"}, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            open_success = true
        }).catch(error => {
            if(error.response.status == 404) {
                res.send(404)
                open_success = false
            } else {
                open_success = false
                res.send(400)
            }
        })

        if(open_success == true) {
            var json = {
                party_id: party_data.CurrentPartyID
            }
            res.status(200).send(json)
        } 
    }
})

app.get("/ingame/v1/create", async (req, res) => {
    var credentials_data
    var credentials_success
    await localRiotClientAPI.getCredentials().then(response => {
        credentials_success = true
        credentials_data = response.data
    }).catch(error => {
        credentials_success = false
        res.send(400)
    })

    if(credentials_success == true) {
        var server_region
        await localRiotClientAPI.getServerRegion().then(response => {
            server_region = response.data.affinities.live
        }).catch(error => {
            res.send(400)
        })

        var party_data
        await axios.get(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/players/${credentials_data.subject}`, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            party_data = response.data
        }).catch(error => {
            console.log(error)
            res.send(400)
        })

        var open_success
        await axios.post(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/parties/${party_data.CurrentPartyID}/accessibility`, {Accessibility: "OPEN"}, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            open_success = true
        }).catch(error => {
            open_success = false
            res.send(400)
        })

        if(open_success == true) {
            var json = {
                party_id: party_data.CurrentPartyID
            }
            res.status(200).send(json)
        } 
    }
})

app.get("/client/v1/status", async (req, res) => {
    var status
    if(localRiotClientAPI != "No File Found" || localRiotClientAPI != 503) {
        await localRiotClientAPI.getHelp().then(response => {
            //console.log(response.data.presences)
            status = response.status
        }).catch(error => {
            if(error.response.status != undefined) {
                status = error.response.status
            } else {
                status = 500
            }
        })
    } else {
        status = 500
    }
    if(status == 200 || status == 401) {
        res.send(200)
    } else {
        res.send(400)
    }
})

app.post("/client/v1/launch", async (req, res) => {
    var status
    exec(`C:/Riot Games/Riot Client/RiotClientServices.exe`, ["--launch-product=valorant", "--launch-patchline=live", "--insecure", "--app-port=12345"], function(err, data) {  
        console.log(err, data)
        if(err) {
            status = 400
        } else {
            status = 200
        }
    })
    res.send(status)
})

app.post("/client/v1/launch/join", async (req, res) => {
    
})

app.listen(42069, () => {console.log("API Online")})