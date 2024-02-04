/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import renderLibs from './renderLibs.js';

let notificationElements = []
let dontRender = 0

register("renderOverlay", () => {
    if (dontRender === 0) {
        doRender2()
    } else {
        dontRender--
    }
})

function doRender2() {

    notificationElements.forEach((n, i) => {
        n.render(notificationElements.length - i - 1)
    })

    notificationElements.reverse()
    if (notificationElements.length > 0 && Date.now() - notificationElements[notificationElements.length - 1].initalisedTime > 7000) {
        notificationElements.pop().image?.destroy?.()
    }
    notificationElements.reverse()
}

/**
 * @class
 */
class Notification {
    constructor(title, text, image) {
        this.title = title
        this.text = text
        this.image = undefined
        this.lastRender = Date.now()

        if (image) {
            let notificationThing = this
            new Thread(() => {
                let imagetmp = new Image("guiimage_" + image.replace(/[^a-z_]/gi, ""), image)
                notificationThing.image = imagetmp
            }).start()
        }
        this.renderY = 125
        this.initalisedTime = Date.now()

        notificationElements.push(this)
    }

    render(index) {
        let deltaTime = Date.now() - this.lastRender
        this.lastRender = Date.now()
        let width = 200
        let height = 100
        let renderX = Math.sin((Date.now() - this.initalisedTime) / 10 * Math.PI / 180) * 225
        this.renderY -= (this.renderY - (125 + 125 * index)) / 500 * deltaTime

        if (Date.now() - this.initalisedTime > 900) {
            renderX = 225
            if (Date.now() - this.initalisedTime > 6100) {
                renderX = Math.sin((Date.now() - this.initalisedTime - 5200) / 10 * Math.PI / 180) * 225
            }
        }

        renderLibs.drawBox([50, 70, 90], Renderer.screen.getWidth() - renderX, Renderer.screen.getHeight() - this.renderY, width, height, 2)
        if (this.image) {
            this.image.draw(Renderer.screen.getWidth() - renderX + 2, Renderer.screen.getHeight() - this.renderY + 2, height - 4, height - 4)
            width -= height - 4
            renderX -= height - 4
        }
        renderLibs.drawStringResiseWidthBottom(this.title, (Renderer.screen.getWidth() - renderX) + 5, (Renderer.screen.getHeight() - this.renderY) + 15, 2, width - 10)
        Renderer.drawRect(Renderer.color(20, 30, 40), (Renderer.screen.getWidth() - renderX) + 2, (Renderer.screen.getHeight() - this.renderY) + 29, width - 4, 2)
        this.text.forEach((line, i) => {
            if (line) {
                renderLibs.drawStringResiseWidth(line, Renderer.screen.getWidth() - renderX + 5, Renderer.screen.getHeight() - this.renderY + 34 + 9 * i, 1, width - 10)
            }
        })
    }

    static doRender() {
        doRender2()
        dontRender = 2
    }

    static resetDontRender() {
        dontRender = 0
    }
}

// register("step",()=>{
//     new Notification("HI!!!",["There is some text in this","Its even multy-line!"], "https://cravatar.eu/helmavatar/dc8c39647b294e03ae9ed13ebd65dd29")
// }).setDelay(3)

export default Notification