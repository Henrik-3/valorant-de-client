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
    await createLobby().then(data2 => data2.json()).then(data3 => {
        data_data = data3
    })
    console.log(data_data)
    if(data_data != undefined) {
        created = true
        document.getElementById("createlobby").innerHTML = "Lobby erstellt"
        document.getElementById("createlobby").style.cssText = "color:#fff;background-color:#696969"
        document.getElementById("partyid").innerHTML = data_data.party_id
    } else {
        document.getElementById("createlobby").innerHTML = "Fehler bei der Lobby Erstellung, stelle sicher dass du VALORANT offen hast"
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