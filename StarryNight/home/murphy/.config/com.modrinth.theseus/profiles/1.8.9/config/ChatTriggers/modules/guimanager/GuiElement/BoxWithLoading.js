import SoopyRenderEvent from "../EventListener/SoopyRenderEvent";

const { default: SoopyBoxElement } = require("./SoopyBoxElement");

let startTime = Date.now()

let loadingImage = undefined
new Thread(() => {
    try {
        let buffImage = javax.imageio.ImageIO.read(new java.io.File(com.chattriggers.ctjs.CTJS.INSTANCE.configLocation.toURI().normalize().getRawPath().substr(1).replace(/\%20/, " ") + "ChatTriggers/modules/guimanager/Resources/loading-icon.jpg"))
        loadingImage = new Image(buffImage)
    } catch (e) {
        //javax.imageio.IIOException: Can't read input file! for some people idk why
    }
}).start()

class BoxWithLoading extends SoopyBoxElement {
    constructor() {
        super();

        let renderEvent = new SoopyRenderEvent()


        renderEvent.setHandler(() => {
            if (!loadingImage) return
            let rotation = (Date.now() - startTime) / 2

            let size = Math.min(this.location.getWidthExact(), this.location.getHeightExact())

            Renderer.translate(this.location.getXExact() + this.location.getWidthExact() / 2, this.location.getYExact() + this.location.getHeightExact() / 2)
            Renderer.rotate(rotation)
            loadingImage.draw(-size / 2, -size / 2, size, size)
        })

        this.events.push(renderEvent)
    }
}

export default BoxWithLoading