let SoopyAPI = {}

SoopyAPI.chat2Messages = []
SoopyAPI.locationString = "";
SoopyAPI.xOff = 0;
SoopyAPI.yOff = 0;

function newSideMessage(message) {
	SoopyAPI.chat2Messages.push({ "text": message, "time": 0, "height": 0 })
}


register("renderOverlay", SoopyAPI_renderOverlay);

SoopyAPI.lastTimeRender = new Date().getTime()

function SoopyAPI_renderOverlay() {
	let now = new Date().getTime()

	let timePassed = now - SoopyAPI.lastTimeRender
	let width = Renderer.screen.getWidth()
	let height = Renderer.screen.getHeight()


	let animDiv = timePassed / 1000
	SoopyAPI.lastTimeRender = now

	Renderer.drawString("", -100, -100)//Fixes skytils issue


	//format: {"text": "TestMessage","time":0,"height":0}
	SoopyAPI.chat2Messages.reverse()

	SoopyAPI.chat2Messages.forEach((message, index) => {

		let messageWidth = Renderer.getStringWidth(ChatLib.removeFormatting(message.text))

		let x = 0;
		let y = 0;
		if (SoopyAPI.locationString == "Top left") {
			x = 20
			message.height = message.height + ((index * -10) - message.height) * (animDiv * 5)
		}
		if (SoopyAPI.locationString == "Top Right") {
			x = width - 20 - messageWidth
			message.height = message.height + ((index * -10) - message.height) * (animDiv * 5)
		}
		if (SoopyAPI.locationString == "Bottom Right") {
			x = width - 20 - messageWidth
			message.height = message.height + ((index * 10) - message.height) * (animDiv * 5)
		}

		let animOnOff = 0
		if (message.time < 500) {
			animOnOff = 1 - (message.time / 500)
		}
		if (message.time > 3500) {
			animOnOff = ((message.time - 3500) / 500)
		}

		animOnOff *= 90
		animOnOff += 90

		animOnOff = animOnOff * Math.PI / 180;

		animOnOff = Math.sin(animOnOff)

		animOnOff *= -1
		animOnOff += 1

		if (SoopyAPI.locationString == "Top left") {
			x += ((animOnOff * -1) * (messageWidth + 30))
			y = 30 - (message.height)
		}
		if (SoopyAPI.locationString == "Top Right") {
			x += (animOnOff * (messageWidth + 30))
			y = 30 - (message.height)
		}
		if (SoopyAPI.locationString == "Bottom Right") {
			x += (animOnOff * (messageWidth + 30))
			y = height - 30 - (message.height)
		}

		Renderer.drawString(message.text, x + SoopyAPI.xOff, y + SoopyAPI.yOff);

		if (message.time > 4000) {
			SoopyAPI.chat2Messages.pop(message)
		}

		message.time += timePassed
	})

	SoopyAPI.chat2Messages.reverse()

}

function setLocation(locationString, xOff, yOff) {
	SoopyAPI.locationString = locationString;
	SoopyAPI.xOff = parseInt(xOff);
	SoopyAPI.yOff = parseInt(yOff);
}

import WebsiteCommunicator from "./websiteCommunicator";
import socketData from "./socketData.js";

class SoopyApisServer extends WebsiteCommunicator {
	constructor() {
		super(socketData.serverNameToId.soopyapis);
	}

	onData(data) {
		switch (data.type) {
			case "message":
				ChatLib.chat(data.message);
				break;
		}
	}
}

new Thread(() => {
	//Update data file from website

	try {
		let data = FileLib.getUrlContent("http://soopy.dev/socketserver/data.json")
		socketData = JSON.parse(data)
		FileLib.write("soopyApis", "socketData.js", "export default " + data)
	} catch (e) {
		console.error(e)
	}
}).start()

let soopyApisServer = new SoopyApisServer()

export { newSideMessage, setLocation };