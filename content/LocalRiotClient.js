const axios = require('axios').default;
const fs = require("fs");
const https = require("https");

class LocalRiotClientAPI {

    constructor(username, password, port) {

        this.username = username;
        this.password = password;
        this.port = port;

        this.authorization = Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64');
        console.log(this.authorization)

        this.axios = axios.create({
            baseURL: `https://127.0.0.1:${this.port}`,
            headers: {
                'Authorization': `Basic ${this.authorization}`,
                "user-agent": "ShooterGame/21 Windows/10.0.19042.1.768.64bit",
                "X-Riot-ClientVersion": "release-02.03-shipping-8-521855",
                "Content-Type": "application/json",
                "rchat-blocking": "true"
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false, // disable ssl verification for self signed cert used by RiotClientServices.exe,
            }),
        });

    }

    /**
     * Read the local RiotClient lockfile and return a new LocalRiotClientAPI instance
     * @param path
     * @returns {LocalRiotClientAPI}
     */
    static initFromLockFile(path = null) {
        const lockFile = this.parseLockFile(path);
        if(lockFile != "No File found") {
            return new LocalRiotClientAPI('riot', lockFile.password, lockFile.port);
        } else {
            return "No File Found"
        }
    }

    static parseLockFile(path = null) {

        /**
         * if no path is provided, try and find it:
         * C:\Users\username\AppData\Local\Riot Games\Riot Client\Config\lockfile
         */
        if(!path){
            const localAppDataPath = process.env.LOCALAPPDATA;
            path = `${localAppDataPath}\\Riot Games\\Riot Client\\Config\\lockfile`;
        }

        // read lockfile
        if(fs.existsSync(path)) {
            const lockfileContents = fs.readFileSync(path, 'utf8');

        /**
         * expected lockfile contents
         * name:pid:port:password:https
         */
            const matches = lockfileContents.match(/(.*):(.*):(.*):(.*):(.*)/);
            const name = matches[1];
            const pid = matches[2];
            const port = matches[3];
            const password = matches[4];
            const protocol = matches[5];

            return {
                'raw': lockfileContents,
                'name': name,
                'pid': pid,
                'port': port,
                'password': password,
                'protocol': protocol,
            };
        } else {
            return "No File found"
        }
    }
    
    getFriends() {
        return this.axios.get('/chat/v4/friends');
    }

    getSession() {
        return this.axios.get("/chat/v1/session")
    }

    getPresence() {
        return this.axios.get('/chat/v4/presences');
    }

    getHelp() {
        return this.axios.get('/help');
    }
}

module.exports = LocalRiotClientAPI