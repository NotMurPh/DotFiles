/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyBoxElement from "./SoopyBoxElement"
import SoopyNumber from "./../Classes/SoopyNumber"
import SoopyMouseClickEvent from "../EventListener/SoopyMouseClickEvent"
import Enum from "../Enum"


/**
 * A Toggle, can be toggled on or off.
 * @class
 */
class Toggle extends SoopyBoxElement{
    /**
     * Creates a {@link Toggle}
     * @constructor
     */
    constructor(){

        super()

        this.colorTrue = [0, 255, 0]
        this.colorFalse = [255, 0, 0]

        this.toggleColor = [new SoopyNumber(255), new SoopyNumber(0), new SoopyNumber(0)]

        this.onOffText = false

        this.toggleProgress = new SoopyNumber(0)//0-1

        let renderEvent = new SoopyRenderEvent()

        this.value = false
        renderEvent.setHandler(()=>{
            let theColor = Renderer.color(this.toggleColor[0].get(), this.toggleColor[1].get(), this.toggleColor[2].get())

            Renderer.drawRect(theColor, this.location.getXExact()+3+(this.location.getWidthExact()-6)*this.toggleProgress.get()/2, this.location.getYExact()+3, (this.location.getWidthExact()-6)/2, this.location.getHeightExact()-6)
        })
        this.events.push(renderEvent)

        let clickEvent = new SoopyMouseClickEvent()
        clickEvent.setHandler(()=>{
            let oldValue = this.value

            this.value = !this.value

            this.toggleProgress.set(this.value?1:0, 500)
            this.setToggleColor(...(this.value?this.colorTrue:this.colorFalse), 250)

            this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [this.value, oldValue, ()=>{
                this.setValue(oldValue, 0)
            }])
        })
        this.events.push(clickEvent)
    }

    /**
     * Allows setting the rgb of the toggle
     * @param {Number} r The red value of the toggle (0-255)
     * @param {Number} g The green value of the toggle (0-255)
     * @param {Number} b The blue value of the toggle (0-255)
     * @param {Number} anim The animation time in ms for this change
     * @returns {Toggle} this for method chaining
     */
    setToggleColor(r, g, b, anim=0){
        this.toggleColor[0].set(r, anim)
        this.toggleColor[1].set(g, anim)
        this.toggleColor[2].set(b, anim)
        return this
    }

    /**
     * Allows setting the value of the toggle
     * @param {Boolean} val The value of the toggle
     * @param {Number} anim The animation time in ms for this change
     * @returns {Toggle} this for method chaining
     **/
    setValue(val, anim=0){
        this.value = val
        this.toggleProgress.set(this.value?1:0, anim)
        this.setToggleColor(...(this.value?this.colorTrue:this.colorFalse), anim)
        return this
    }
}

export default Toggle