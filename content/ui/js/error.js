document.querySelector("#launchvalorant").addEventListener("click", async () => {
    async function restart() {
        var response = await fetch("http://127.0.0.1:42069/client/v1/restart", {
            method: "POST"
        })
        return response
    }
    restart()
})