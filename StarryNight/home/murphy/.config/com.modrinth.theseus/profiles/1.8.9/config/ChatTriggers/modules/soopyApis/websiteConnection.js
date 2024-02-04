const Socket = Java.type("java.net.Socket");
const InputStreamReader = Java.type("java.io.InputStreamReader");
const BufferedReader = Java.type("java.io.BufferedReader");
const PrintWriter = Java.type("java.io.PrintWriter");
let Executors = Java.type("java.util.concurrent.Executors")

class NonPooledThread {
    constructor(fun) {
        this.fun = fun
        this.executor = Executors.newSingleThreadExecutor()
    }

    start() {
        this.executor.execute(this.fun)
    }
}

import serverData from "./socketData";

class WebsiteConnection {
    constructor() {
        this.socket = undefined;
        this.connected = false
        this.output = undefined
        this.writer = undefined
        this.reconDelay = 1000

        this.connectedFull = false

        this.handlers = {}


        this.gameRunning = true

        this.sendDataArr = []

        register("gameUnload", () => {
            this.gameRunning = false
            this.disconnect()
        })
        this.connect()

        // send data to server in seperate thread to stop game freezes
        new NonPooledThread(() => {

            while (this.gameRunning) {
                if (this.connected && this.socket) {
                    if (this.sendDataArr.length > 0) {
                        for (let line of this.sendDataArr) {
                            this.writer.println(line);
                        }
                        this.sendDataArr = []
                    } else {
                        Thread.sleep(100)
                    }
                } else {
                    Thread.sleep(1000)
                }
            }

            this.writer.println(data.replace(/\n/g, ""));
        }).start()
    }

    connect() {
        //connect to server

        if (!this.gameRunning) return;

        if (this.connected) return;

        this.connectedFull = false
        console.log("connecting to soopy socket")
        try {
            this.socket = new Socket("soopy.dev", serverData.port);
        } catch (e) {
            console.log("socket error: " + JSON.stringify(e, undefined, 2))
            console.log("reconnecting in " + this.reconDelay + "ms")
            new Thread(() => {
                Thread.sleep(this.reconDelay)
                this.reconDelay *= 1.5
                this.reconDelay = Math.round(this.reconDelay)
                this.connect()
            }).start()
            return;
        }
        this.output = this.socket.getOutputStream();
        this.writer = new PrintWriter(this.output, true)

        this.connected = true

        this.reconDelay = 1000

        new NonPooledThread(() => {
            let input = this.socket.getInputStream();
            let reader = new BufferedReader(new InputStreamReader(input));

            let shouldCont = true

            while (this.connected && this.socket !== null && shouldCont && this.gameRunning) {
                try {
                    let data = reader.readLine()
                    if (data) {
                        this.onData(JSON.parse(data))
                    }
                } catch (e) {
                    console.log("SOCKET ERROR (soopyApis/websiteConnection.js)")
                    console.error(JSON.stringify(e))
                    this.disconnect()
                    Thread.sleep(5000)
                    console.log("Attempting to reconnect to the server")
                    shouldCont = false

                    this.connect()
                }
            }
            let shouldReCon = false
            if (this.connected && shouldCont) {
                shouldReCon = true
            }
            if (shouldReCon) {
                Thread.sleep(1000)
                console.log("Attempting to reconnect to the server")
                this.connect()
            }
        }).start();


    }

    disconnect() {
        //disconnect from server

        if (this.socket) this.socket.close();
        this.socket = null;
        this.connected = false;

        console.log("disconnecting from soopy socket")
    }

    sendData(data) {
        //send data to server
        if (!this.connected) return;
        if (!this.socket) return;

        this.sendDataArr.push(data.replace(/\n/g, ""))
    }

    onData(data) {

        if (data.type === serverData.packetTypesReverse.connectionSuccess) {

            //THANKS FORK
            let serverId = java.util.UUID.randomUUID().toString().replace(/-/g, "")
            try {
                Client.getMinecraft().func_152347_ac().joinServer(Client.getMinecraft().func_110432_I().func_148256_e(), Client.getMinecraft().func_110432_I().func_148254_d(), serverId)
            } catch (e) { serverId = undefined }

            this.sendData(this.createPacket(serverData.packetTypesReverse.connectionSuccess, 0, {
                username: Player.getName(),
                uuid: Player.getUUID(),
                serverId
            }))

            Object.values(this.handlers).forEach(handler => handler._onConnect())
            this.connectedFull = true
        } else if (data.type === serverData.packetTypesReverse.data) {
            if (this.handlers[data.server]) {
                this.handlers[data.server]._onData(data.data)
            } else if (data.noHandlerMessage) {
                ChatLib.chat(data.noHandlerMessage)
            }
        } else if (data.type === serverData.packetTypesReverse.serverReboot) {
            this.disconnect()
            new Thread(() => {
                Thread.sleep(5000)
                this.connect()
            }).start()
        } else if (data.type === serverData.packetTypesReverse.ping) {
            this.sendData(this.createPacket(serverData.packetTypesReverse.ping, 0, {}))
        }
    }

    addHandler(handler) {
        this.handlers[handler.appId] = handler;
        if (this.connectedFull) {
            handler._onConnect()
        }
    }

    createDataPacket(data, server = serverData.serverNameToId.soopyapis) {
        return this.createPacket(serverData.packetTypesReverse.data, server, data)
    }

    createPacket(type, server = serverData.serverNameToId.soopyapis, data = {}) {
        return JSON.stringify({
            "type": type,
            "server": server,
            "data": data
        })
    }
}
if (!global.SoopyWebsiteConnectionThingConnection) {

    global.SoopyWebsiteConnectionThingConnection = new WebsiteConnection();

    register("gameUnload", () => {
        global.SoopyWebsiteConnectionThingConnection = undefined
    })
}

export default global.SoopyWebsiteConnectionThingConnection;