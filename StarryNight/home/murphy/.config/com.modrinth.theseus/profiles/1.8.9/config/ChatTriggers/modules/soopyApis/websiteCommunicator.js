import WebsiteConnection from './websiteConnection.js';
import socketData from "./socketData"

class WebsiteCommunicator {
    constructor(appId){
        this.appId = appId

        WebsiteConnection.addHandler(this)
        this.connected = false
    }


    _onConnect(){
        let modVersion = 'UNKNOWN'
        try{
            modVersion = JSON.parse(FileLib.read(socketData.servers[this.appId].module, "metadata.json")).version
        }catch(e){}
        
        let packet = WebsiteConnection.createPacket(socketData.packetTypesReverse.joinServer,this.appId,{
            version: modVersion
        })

        WebsiteConnection.sendData(packet)

        try{
            this.onConnect()
            
            this.connected = true
        }catch(e){
            console.log(JSON.stringify(e, undefined, 2))
            console.log("At onconnect, appId " + this.appId)
        }
    }
    _onData(data){

        try{
            this.onData(data)
        }catch(e){
            console.log(JSON.stringify(e, undefined, 2))
            console.log("At ondata, appId " + this.appId)
        }
    }
    isConnected(){
        return this.connected
    }
    sendData(data){
        let packet = WebsiteConnection.createDataPacket(data, this.appId)

        WebsiteConnection.sendData(packet)
    }

    /**
     * should be overriden
     **/
    onConnect(){

    }
    /**
     * should be overriden
     **/
    onData(data){
        
    }
}

export default WebsiteCommunicator