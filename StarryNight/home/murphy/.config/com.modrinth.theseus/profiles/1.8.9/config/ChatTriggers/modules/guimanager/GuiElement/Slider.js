/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyNumber from "./../Classes/SoopyNumber"
import SoopyMouseClickEvent from "../EventListener/SoopyMouseClickEvent"
import Enum from "../Enum"
import SoopyGuiElement from "./SoopyGuiElement"
import SoopyMouseReleaseEvent from "../EventListener/SoopyMouseReleaseEvent"


/**
 * A Slider, can be used to control a number.
 * @class
 */
class Slider extends SoopyGuiElement {
    /**
     * Creates a {@link Slider}
     * @constructor
     */
    constructor() {

        super()

        this.sliderColor = [0, 255, 0]
        this.lineColor = [253 * 0.9, 255 * 0.9, 227 * 0.9]

        this.sliderProgress = new SoopyNumber(0)
        this.sliderMin = new SoopyNumber(0)
        this.sliderMax = new SoopyNumber(1)

        let renderEvent = new SoopyRenderEvent()

        this.value = 0
        this.min = 0
        this.max = 1

        this.tempSlidingThingX = null

        renderEvent.setHandler((mx, my) => {
            let sliderMainColor = this.sliderColor
            let sliderLineColor = this.lineColor
            if (this.isDarkThemeEnabled()) {
                sliderMainColor = sliderMainColor.map(a => 255 - a * 0.9)
                sliderLineColor = sliderLineColor.map(a => 255 - a * 0.9)
            }

            let h = this.location.getHeightExact() / 5
            let x = this.location.getXExact() + h / 2
            let y = this.location.getYExact() + this.location.getHeightExact() / 2
            let w = this.location.getWidthExact() - h

            if (this.tempSlidingThingX !== null) {
                let oldValue = this.value
                this.value = MathLib.clampFloat(MathLib.map(mx - this.tempSlidingThingX, x, x + w, this.sliderMin.get(), this.sliderMax.get()), this.sliderMin.get(), this.sliderMax.get())
                this.sliderProgress.set(this.value, 0)

                this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [this.value, oldValue, () => {
                    this.setValue(oldValue, 0)
                }])
            }

            let boxX = MathLib.map(this.sliderProgress.get(), this.sliderMin.get(), this.sliderMax.get(), x, x + w)

            Renderer.drawRect(Renderer.color(...sliderLineColor), x, y - h / 2, w, h)

            Renderer.drawRect(Renderer.color(...sliderMainColor), boxX - h / 2, this.location.getYExact(), h, this.location.getHeightExact())
        })
        this.events.push(renderEvent)

        let clickEvent = new SoopyMouseClickEvent()
        clickEvent.setHandler((mx, my, button) => {
            let h = this.location.getHeightExact() / 5
            let x = this.location.getXExact() + h / 2
            let w = this.location.getWidthExact() - h

            let boxX = MathLib.map(this.sliderProgress.get(), this.sliderMin.get(), this.sliderMax.get(), x, x + w)

            if (my < this.location.getYExact() || my > this.location.getYExact() + this.location.getHeightExact()) return

            if (mx >= boxX - h / 2 && mx <= boxX + h / 2) {
                this.tempSlidingThingX = mx - boxX
            } else if (mx >= x && mx <= x + w) {
                this.tempSlidingThingX = 0
            }
        })
        this.events.push(clickEvent)

        let unclickEvent = new SoopyMouseReleaseEvent()
        unclickEvent.setHandler((mx, my, button) => {

            if (this.tempSlidingThingX === null) return

            let h = this.location.getHeightExact() / 5
            let x = this.location.getXExact() + h / 2
            let w = this.location.getWidthExact() - h

            let oldValue = this.value

            this.value = MathLib.clampFloat(MathLib.map(mx - this.tempSlidingThingX, x, x + w, this.sliderMin.get(), this.sliderMax.get()), this.sliderMin.get(), this.sliderMax.get())
            this.sliderProgress.set(this.value, 0)

            this.tempSlidingThingX = null

            this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [this.value, oldValue, () => {
                this.setValue(oldValue, 0)
            }])
        })
        this.events.push(unclickEvent)
    }

    /**
     * Allows setting the value of the slider
     * @param {Number} val The value of the slider
     * @param {Number} anim The animation time in ms for this change
     * @returns {Slider} this for method chaining
     **/
    setValue(val, anim = 0) {
        this.value = val
        this.sliderProgress.set(val, anim)
        return this
    }

    /**
     * Allows setting the min value of the slider
     * @param {Number} min The min value of the slider
     * @param {Number} anim The animation time in ms for this change
     * @returns {Slider} this for method chaining
     **/
    setMin(min, anim = 0) {
        this.min = min
        this.sliderMin.set(min, anim)
        return this
    }

    /**
     * Allows setting the max value of the slider
     * @param {Number} max The max value of the slider
     * @param {Number} anim The animation time in ms for this change
     * @returns {Slider} this for method chaining
     **/
    setMax(max, anim = 0) {
        this.max = max
        this.sliderMax.set(max, anim)
        return this
    }
}

export default Slider