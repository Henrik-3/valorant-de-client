/*document.querySelector("#kekw").addEventListener("click", async () => {
    async function launchValorant() {
        var response = await fetch("http://127.0.0.1:42069/client/v1/launch", {
            method: "POST"
        })
        return response
    }
    var data
    await launchValorant().then(data2 => {
        data = data2
    })
    if(data.status == 200) {
        document.getElementById("launchvalorant").innerHTML = "Wird ausgeführt..."
        document.getElementById("launchvalorant").style.cssText = "color:#fff;background-color:#696969"
    }

    var checkcycle = setInterval(async () => {
        async function checkValorant() {
            var response = await fetch("http://127.0.0.1:42069/client/v1/status", {
                method: "GET"
            })
            return response
        }
        var data3
        await checkValorant().then(data2 => {
            data3 = data2
        })
        if(data3.status == 400) {
            clearInterval(checkcycle)
            document.getElementById("launchvalorant").innerHTML = "Launch"
            document.getElementById("launchvalorant").style.cssText = "color:#fff;background-color:#ff4654"
        }
    }, 10000)
})*/

document.querySelector("#discordlink").addEventListener("click", async () => {
    async function open() {
        var response = await fetch("http://127.0.0.1:42069/client/v1/link/discord", {
            method: "POST"
        })
        console.log(response)
        return response
    }
    open()
})

document.querySelector("#twitterlink").addEventListener("click", async () => {
    async function open() {
        var response = await fetch("http://127.0.0.1:42069/client/v1/link/twitter", {
            method: "POST"
        })
        return response
    }
    open()
})

document.querySelector("#twitchlink").addEventListener("click", async () => {
    async function open() {
        var response = await fetch("http://127.0.0.1:42069/client/v1/link/twitch", {
            method: "POST"
        })
        return response
    }
    open()
})

var created = false
document.querySelector("#createlobby").addEventListener("click", async () => {
    if(created == false) {
        document.getElementById("createlobby").innerHTML = "Wird erstellt..."
        async function createLobby() {
            var response = await fetch("http://127.0.0.1:42069/ingame/v1/create", {
                method: "GET"
            })
            return response
        }
        var data_data
        var raw_data = await createLobby()
        await createLobby().then(data2 => data2.json()).then(data3 => {data_data = data3})
        console.log(await createLobby())
        if(data_data != undefined && raw_data.status == 200) {
            created = true
            document.getElementById("createlobby").innerHTML = "Lobby erstellt"
            document.getElementById("createlobby").style.cssText = "color:#fff;background-color:#696969"
            if(document.getElementById("createlobbyid") != null) {
                document.getElementById("createlobbyid").innerHTML = data_data.party_id
            } else {
                var div1 = document.createElement("div")
                div1.className = "input-group no-border input-lg"
                div1.style.cssText = "margin-top:20px"
                var div2 = document.createElement("div")
                div2.className = "input-group-prepend"
                var span = document.createElement("span")
                span.className = "input-group-text"
                var i = document.createElement("i")
                i.className = "fas fa-fingerprint"
                i.style.cssText = "color:white"
                var input = document.createElement("input")
                input.type = "text"
                input.className = "form-control"
                input.placeholder = "Party ID"
                input.id = "createlobbyid"
                input.readOnly = true
                input.value = data_data.party_id
                span.append(i)
                div2.append(span)
                div1.append(div2)
                div1.append(input)
                document.getElementById("partyid").append(div1)
            }
            //document.getElementById("createpartyid").innerHTML = data_data.party_id
            setTimeout(function() {
                created = false
                document.getElementById("createlobby").innerHTML = "Erstelle Lobby"
                document.getElementById("createlobby").style.cssText = ""
            }, 5000)
        } else if(data_data != undefined && raw_data.status == 403) {
            document.getElementById("createlobby").innerHTML = "Lobby erstellt (DU BIST NICHT PARTY OWNER. STELLE SICHER DASS DIE LOBBY OFFEN IST"
            document.getElementById("createlobby").style.cssText = "color:#fff;background-color:#696969;font-size:12px"
            if(document.getElementById("createlobbyid") != null) {
                document.getElementById("createlobbyid").innerHTML = data_data.party_id
            } else {
                var div1 = document.createElement("div")
                div1.className = "input-group no-border input-lg"
                div1.style.cssText = "margin-top:20px"
                var div2 = document.createElement("div")
                div2.className = "input-group-prepend"
                var span = document.createElement("span")
                span.className = "input-group-text"
                var i = document.createElement("i")
                i.className = "fas fa-fingerprint"
                i.style.cssText = "color:white"
                var input = document.createElement("input")
                input.type = "text"
                input.className = "form-control"
                input.placeholder = "Party ID"
                input.id = "createlobbyid"
                input.readOnly = true
                input.value = data_data.party_id
                span.append(i)
                div2.append(span)
                div1.append(div2)
                div1.append(input)
                document.getElementById("partyid").append(div1)
            }
            setTimeout(function() {
                created = false
                document.getElementById("createlobby").innerHTML = "Erstelle Lobby"
                document.getElementById("createlobby").style.cssText = ""
            }, 5000)
        } else {
            document.getElementById("createlobby").innerHTML = "Fehler bei der Lobby Erstellung, stelle sicher dass du VALORANT offen hast"
            setTimeout(function() {
                document.getElementById("createlobby").innerHTML = "Erstelle Lobby"
            }, 5000)
        }
    }
})

document.querySelector("#joinlobby").addEventListener("click", async () => {
    document.getElementById("joinlobby").innerHTML = "Trete bei..."
    async function joinLobby() {
        var response = await fetch(`http://127.0.0.1:42069/ingame/v1/join/${document.getElementById("lobbyid").value}`, {
            method: "GET"
        })
        return response
    }
    var data_data
    await joinLobby().then(data2 => {
        data_data = data2.status
    })
    if(data_data == 200) {
        created = true
        document.getElementById("joinlobby").innerHTML = "Lobby beigetreten"
        document.getElementById("joinlobby").style.cssText = "color:#fff;background-color:#696969"
    } else if(data_data == 404) {
        document.getElementById("joinlobby").innerHTML = "Lobby Existiert nicht"
    } else {
        document.getElementById("joinlobby").innerHTML = "Fehler beim Lobby Beitritt, stelle sicher dass du VALORANT offen hast"
    }
})