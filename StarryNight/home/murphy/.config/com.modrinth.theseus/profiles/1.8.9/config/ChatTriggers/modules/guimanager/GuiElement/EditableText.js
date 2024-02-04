import SoopyPosition from "../Classes/SoopyPosition";
import SoopyRenderEvent from "../EventListener/SoopyRenderEvent";
import renderLibs from "../renderLibs"
import SoopyGuiElement from "./SoopyGuiElement";
import SoopyMouseClickEvent from "../EventListener/SoopyMouseClickEvent";
import SoopyKeyPressEvent from "../EventListener/SoopyKeyPressEvent";
import SoopyGlobalMouseClickEvent from "../EventListener/SoopyGlobalMouseClickEvent";
import SoopyNumber from "../Classes/SoopyNumber";
import Enum from "../Enum";

class EditableText extends SoopyGuiElement {
    constructor() {
        super()

        this.text = ""
        this.prefix = ""
        this.suffix = ""
        this.placeholder = "Click to type"
        this.textXOffset = new SoopyNumber(0).setAnimMode("sin_out")
        this.textXOffsetFast = 0
        this.cursorLoc = new SoopyPosition(0, 0).setRelative(false, false).setAnimMode("sin_out")

        this.lastKeyPress = 0

        this.cursorTextLocationId = 0

        this.selected = false

        this.addEvent(new SoopyRenderEvent().setHandler((mouseX, mouseY) => { this.render.call(this, mouseX, mouseY) }))
        this.addEvent(new SoopyMouseClickEvent().setHandler((mouseX, mouseY) => { this.mouseClick.call(this, mouseX, mouseY) }))
        this.addEvent(new SoopyKeyPressEvent().setHandler((key, keyId) => { this.keyPress.call(this, key, keyId) }))
        this.addEvent(new SoopyGlobalMouseClickEvent().setHandler((mouseX, mouseY) => { this.mouseClickG.call(this, mouseX, mouseY) }))
    }

    setText(text) {
        this.text = text
        this.cursorTextLocationId = text.length
        return this
    }

    setPrefix(text) {
        this.prefix = text
        return this
    }

    setSuffix(text) {
        this.suffix = text
        return this
    }

    getText() {
        return this.text
    }

    mouseClick(mouseX, mouseY) {
        this.selected = true
        this.lastKeyPress = Date.now()


        let textScale = this.location.getHeightExact() / 15

        let textX = this.location.getXExact() - this.textXOffset.get()

        let widthSoFar = 0
        for (let i = 0; i < this.text.length; i++) {
            let charWidth = Renderer.getStringWidth(ChatLib.removeFormatting(this.getRenderText())[i]) * textScale
            if (mouseX > textX + widthSoFar && mouseX < textX + widthSoFar + charWidth) {
                this.cursorTextLocationId = i
            }
            widthSoFar += charWidth
        }
        if (mouseX > textX + widthSoFar) {
            this.cursorTextLocationId = this.text.length
        }
    }

    mouseClickG(mouseX, mouseY) {
        this.selected = false
    }

    keyPress(key, keyId) {
        if (!this.selected) return
        // console.log(keyId)

        let prevText = this.text
        let prevCursorLocation = this.cursorTextLocationId

        switch (keyId) {
            case 14: //backspace
                if (this.cursorTextLocationId > 0) {
                    if (this.main.ctGui.isControlDown()) {
                        let preText = this.text.substring(0, this.cursorTextLocationId)
                        let postText = this.text.substring(this.cursorTextLocationId)

                        let endsSpace = preText.endsWith(" ")

                        preText = preText.split(" ")
                        preText.pop()
                        if (endsSpace) preText.pop()
                        preText = preText.join(" ") + (!(!endsSpace && preText.length !== 0) ? "" : " ")

                        this.text = preText + postText
                        this.cursorTextLocationId = preText.length
                    } else {
                        this.text = this.text.substring(0, this.cursorTextLocationId - 1) + this.text.substring(this.cursorTextLocationId)
                        this.cursorTextLocationId--
                    }
                }
                break
            case 199: //home key
                this.cursorTextLocationId = 0
                break
            case 207: //end key
                this.cursorTextLocationId = this.text.length
                break
            case 211: //delete
                if (this.cursorTextLocationId < this.text.length) {
                    this.text = this.text.substring(0, this.cursorTextLocationId) + this.text.substring(this.cursorTextLocationId + 1)
                }
                break;
            case 203: //left
                if (this.cursorTextLocationId > 0) {
                    if (this.main.ctGui.isControlDown()) {
                        do {
                            this.cursorTextLocationId--
                        } while (this.cursorTextLocationId > 0 && this.text[this.cursorTextLocationId] !== " ")
                    } else {
                        this.cursorTextLocationId--
                    }
                }
                break
            case 205: //right
                if (this.cursorTextLocationId < this.text.length) {
                    if (this.main.ctGui.isControlDown()) {
                        do {
                            this.cursorTextLocationId++
                        } while (this.cursorTextLocationId < this.text.length && this.text[this.cursorTextLocationId] !== " ")
                    } else {
                        this.cursorTextLocationId++
                    }
                }
                break
            case 42: //left shift
                break;
            case 54: //right shift
                break;
            case 29: //left control
                break;
            case 157: //right control
                break;
            case 58: //caps lock
                break;
            case 28: //enter
                break;
            case 15: //tab
                break;
            case 1: //escape i think
                this.selected = false
                break;
            case 47: //v (HAS TO BE B4 TYPING)
                if (keyId === 47 && this.main.ctGui.isControlDown()) {
                    this.text = this.text.substring(0, this.cursorTextLocationId) + Java.type("net.minecraft.client.gui.GuiScreen").func_146277_j() + this.text.substring(this.cursorTextLocationId)

                    this.cursorTextLocationId += Java.type("net.minecraft.client.gui.GuiScreen").func_146277_j().length
                    break;
                }
            default:
                this.text = this.text.substring(0, this.cursorTextLocationId) + key + this.text.substring(this.cursorTextLocationId)
                this.cursorTextLocationId++
                break
        }

        this.lastKeyPress = Date.now()

        this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [this.text, prevText, () => {
            this.text = prevText
            this.cursorTextLocationId = prevCursorLocation
        }])
    }

    render(mouseX, mouseY) {
        let textScale = this.location.getHeightExact() / 15

        let textX = this.location.getXExact()
        let textY = this.location.getYExact() + this.location.getHeightExact() / 2 - 9 * textScale / 2

        let textWidth = Renderer.getStringWidth(this.getRenderText()) * textScale
        let textWidthLeftOfCursor = Renderer.getStringWidth(this.getRenderText().substr(0, this.cursorTextLocationId + this.prefix.length)) * textScale

        if (textWidthLeftOfCursor - this.textXOffsetFast > this.location.getWidthExact() - 3 * textScale) { // off right of screen
            this.textXOffsetFast = textWidthLeftOfCursor - this.location.getWidthExact() + 3 * textScale
        }
        if (textWidthLeftOfCursor - this.textXOffsetFast < 3 * textScale) { // off left of screen
            this.textXOffsetFast = textWidthLeftOfCursor - 3 * textScale
        }
        if (this.textXOffsetFast + this.location.getWidthExact() - 3 * textScale > textWidth) {
            this.textXOffsetFast = textWidthLeftOfCursor - this.location.getWidthExact() + 3 * textScale
        }
        this.textXOffsetFast = Math.max(-3 * textScale, this.textXOffsetFast)
        this.textXOffset.set(this.textXOffsetFast, 100)

        this.cursorLoc.x.set(textWidthLeftOfCursor - this.textXOffsetFast, 100)

        if (!this.selected && this.text === "") {
            textScale = Math.min(textScale, this.location.getWidthExact() / Renderer.getStringWidth(this.placeholder + "  "))
            let textY = this.location.getYExact() + this.location.getHeightExact() / 2 - 9 * textScale / 2
            renderLibs.drawString((this.isDarkThemeEnabled() ? renderLibs.darkThemifyText("§7") : "§7") + this.placeholder, textX + 3 * textScale, textY, textScale)
        } else {
            renderLibs.drawString((this.isDarkThemeEnabled() ? renderLibs.darkThemifyText("§0") : "§0") + this.getRenderText(), textX - this.textXOffset.get(), textY, textScale)
        }

        if (!this.selected) return

        if (Math.floor((Date.now() - this.lastKeyPress) / 1000) % 2 === 0) {
            Renderer.drawRect(this.isDarkThemeEnabled() ? Renderer.color(200, 200, 200) : Renderer.color(0, 0, 0), textX + this.cursorLoc.x.get(), textY + this.cursorLoc.y.get() - 1 * textScale, 1, 10 * textScale)
        }
    }

    getRenderText() {
        return this.prefix + this.text + this.suffix
    }
}

export default EditableText