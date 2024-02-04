import { SoopyRenderEvent } from "../index";
import SoopyGlobalMouseClickEvent from "../EventListener/SoopyGlobalMouseClickEvent";
import SoopyMouseClickEvent from "../EventListener/SoopyMouseClickEvent";
import SoopyBoxElement from "./SoopyBoxElement";
import SoopyRenderUpdateEvent from "../EventListener/SoopyRenderUpdateEvent";
import SoopyOpenGuiEvent from "../EventListener/SoopyOpenGuiEvent";
import SoopyGuiElement from "./SoopyGuiElement";
import renderLibs from "../renderLibs";
import Slider from "./Slider"
import SoopyContentChangeEvent from "../EventListener/SoopyContentChangeEvent";
import SoopyMouseReleaseEvent from "../EventListener/SoopyMouseReleaseEvent";
import TextBox from "./TextBox";
import Enum from "../Enum";
const BufferedImage = Java.type("java.awt.image.BufferedImage")
const Color = Java.type("java.awt.Color")

let colorImg = new Image(new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB))
let colorImgNeedsRender = false
let renderingNewImg = 0
let buffI

class ColorPicker extends SoopyBoxElement {
    constructor() {
        super()

        this.selectedColor = [0, 0, 0]
        this.selectedColorInputMode = "rgb"

        this.addEvent(new SoopyRenderEvent().setHandler(() => {

            let thisX = this.innerObject.location.getXExact()
            let thisY = this.innerObject.location.getYExact()
            let thisW = this.innerObject.location.getWidthExact()
            let thisH = this.innerObject.location.getHeightExact()

            Renderer.drawRect(Renderer.color(this.selectedColor[0], this.selectedColor[1], this.selectedColor[2]), thisX, thisY, thisW, thisH)
        }))

        this.addEvent(new SoopyMouseClickEvent().setHandler(() => {
            if (this.isOpen) { this.close() } else { this.open() }
            // console.log("click")
        }))

        this.addEvent(new SoopyGlobalMouseClickEvent().setHandler(() => {
            if (this.hovered) return
            if (this.mainElement.hovered) return
            this.close()
            // console.log("global")
        }))

        this.mainElement = new SoopyBoxElement()
        this.mainElement.location.size.setRelative(true, false)

        this.mainElement.addEvent(new SoopyRenderUpdateEvent().setHandler(() => {
            if (this.mainElement.parent && this.mainElement.location.size.y.get() === 0) this.mainElement.parent.removeChild(this.mainElement)
        }))
        this.addEvent(new SoopyOpenGuiEvent().setHandler(() => {
            this.close()
        }))
        let mouseDown = false

        let mainRenderElement = new SoopyGuiElement().setLocation(0, 0, 1, 0.6)
        this.mainElement.addChild(mainRenderElement)

        mainRenderElement.addEvent(new SoopyRenderEvent().setHandler((mx, my) => {
            colorImg.draw(mainRenderElement.location.getXExact(), mainRenderElement.location.getYExact(), mainRenderElement.location.getWidthExact(), mainRenderElement.location.getHeightExact())

            if (renderingNewImg === 2) {
                colorImg.destroy()
                colorImg = new Image(buffI)
                renderingNewImg = 0
            }
            if (colorImgNeedsRender && !renderingNewImg && this.isOpen) {
                colorImgNeedsRender = false
                renderingNewImg = 1
                new Thread(() => {
                    this.renderColorImage()
                    renderingNewImg = 2
                }).start()
            }
            if (mouseDown) {
                let h = MathLib.clampFloat((mx - mainRenderElement.location.getXExact()) / mainRenderElement.location.getWidthExact(), 0, 1)
                let l = MathLib.clampFloat((my - mainRenderElement.location.getYExact()) / mainRenderElement.location.getHeightExact(), 0, 1)
                let s = this.saturationSlider.value
                let oldColor = [...this.selectedColor]

                this.selectedColor = hslToRgb(h, s, l)

                this.hexBox.setText(rgbToHex(...this.selectedColor))

                this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [[...this.selectedColor], oldColor, () => {
                    this.setRGBColor(...oldColor)
                }])
            }

            let [h, s, l] = rgbToHsl(...this.selectedColor)
            let x = h * mainRenderElement.location.getWidthExact() + mainRenderElement.location.getXExact()
            let y = l * mainRenderElement.location.getHeightExact() + mainRenderElement.location.getYExact()

            Renderer.drawCircle(Renderer.color(255 - this.selectedColor[0], 255 - this.selectedColor[1], 255 - this.selectedColor[2]), x, y, 10, 20)
            Renderer.drawCircle(Renderer.color(...this.selectedColor), x, y, 7, 20)
        }))
        mainRenderElement.addEvent(new SoopyMouseClickEvent().setHandler((x, y) => {
            if (x < mainRenderElement.location.getXExact()) return
            if (x > mainRenderElement.location.getXExact() + mainRenderElement.location.getXExact()) return
            if (y < mainRenderElement.location.getYExact()) return
            if (y > mainRenderElement.location.getYExact() + mainRenderElement.location.getYExact()) return

            mouseDown = true
        }))
        mainRenderElement.addEvent(new SoopyMouseReleaseEvent().setHandler((x, y) => {
            if (!mouseDown) return

            let h = MathLib.clampFloat((x - mainRenderElement.location.getXExact()) / mainRenderElement.location.getWidthExact(), 0, 1)
            let l = MathLib.clampFloat((y - mainRenderElement.location.getYExact()) / mainRenderElement.location.getHeightExact(), 0, 1)
            let s = this.saturationSlider.value

            let oldColor = [...this.selectedColor]

            this.selectedColor = hslToRgb(h, s, l)
            this.hexBox.setText(rgbToHex(...this.selectedColor))
            mouseDown = false

            this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [[...this.selectedColor], oldColor, () => {
                this.setRGBColor(...oldColor)
            }])
        }))

        this.saturationSlider = new Slider().setMin(0).setMax(1).setLocation(0, 0.6, 1, 0.2)
        this.mainElement.addChild(this.saturationSlider)
        this.saturationSlider.addEvent(new SoopyContentChangeEvent().setHandler((val, oldVal) => {
            if (val !== oldVal) colorImgNeedsRender = true
        }))

        this.hexBox = new TextBox().setPrefix("§7#§0").setLocation(0.01, 0.81, 0.98, 0.18)
        this.mainElement.addChild(this.hexBox)
        this.hexBox.text.addEvent(new SoopyContentChangeEvent().setHandler((current) => {
            if (!hexToRgb(current)) {
                return
            }

            let oldColor = [...this.selectedColor]
            let { r, g, b } = hexToRgb(current)
            this.setRGBColor(r, g, b)


            this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [[r, g, b], oldColor, () => {
                this.setRGBColor(...oldColor)
            }])
        }))

        this.setRGBColor(0, 0, 0)
        this.isOpen = false
    }

    renderColorImage() {
        buffI = new BufferedImage(100, 100, BufferedImage.TYPE_INT_RGB)

        let s = this.saturationSlider.value

        let rgbArr = java.lang.reflect.Array.newInstance(java.lang.Integer.TYPE, 100 * 100);

        for (let x = 0; x < 100; x++) {
            for (let y = 0; y < 100; y++) {
                let col = hslToRgb(x / 100, s, y / 100)

                rgbArr[x + y * 100] = Renderer.color(col[0], col[1], col[2])
            }
        }

        buffI.setRGB(0, 0, 100, 100, rgbArr, 0, 100)
    }

    open() {
        this.isOpen = true

        this.main.element.addChild(this.mainElement)

        let x = this.location.getXExact()
        let y = this.location.getYExact() + this.location.getHeightExact()
        let width = 0.2
        let height = 0.4

        let animateUp = false
        if (y + height * Renderer.screen.getHeight() > Renderer.screen.getHeight()) {
            y = this.location.getYExact() - height * Renderer.screen.getHeight()
            animateUp = true
        }

        this.mainElement.setLocation(x / Renderer.screen.getWidth(), y / Renderer.screen.getHeight(), width, 1)
        this.mainElement.location.size.y.set(height * Renderer.screen.getHeight(), 250)
        if (animateUp) {
            this.mainElement.location.location.y.set((y + height * Renderer.screen.getHeight()) / Renderer.screen.getHeight(), 0)
            this.mainElement.location.location.y.set(y / Renderer.screen.getHeight(), 250)
        }

        colorImgNeedsRender = true
    }

    close() {
        this.isOpen = false

        this.mainElement.location.size.y.set(0, 250)
    }

    setRGBColor(r, g, b) {
        this.selectedColor = [r, g, b]

        let [h, s, l] = rgbToHsl(...this.selectedColor)
        let maxedSat = hslToRgb(h, 1, l)
        if (maxedSat[0] === r && maxedSat[1] === g && maxedSat[2] === b) {
            s = 1
        }
        this.saturationSlider.setValue(s)
        colorImgNeedsRender = true

        this.hexBox.setText(rgbToHex(r, g, b))

        return this
    }

    getRGBColor() {
        return this.color
    }
}

export default ColorPicker

/**
 * https://stackoverflow.com/a/9493060/16748360
 * 
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
/**
 * https://stackoverflow.com/a/9493060/16748360
 * 
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}