/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyGuiElement from "./SoopyGuiElement"
import SoopyNumber from "./../Classes/SoopyNumber"

import RenderLib from "../renderLibs"

/**
 * A box.
 * @class
 */
class SoopyBoxElement extends SoopyGuiElement {
    /**
     * Creates a {@link SoopyBoxElement}
     * @constructor
     */
    constructor() {

        super()

        this.color = [new SoopyNumber(0), new SoopyNumber(0), new SoopyNumber(0)]
        this.colorOffset = [new SoopyNumber(0), new SoopyNumber(0), new SoopyNumber(0)]
        this.setColor(253, 255, 227)

        let renderEvent = new SoopyRenderEvent()

        this.actuallyDrawBox = true

        renderEvent.setHandler((mouseX, mouseY, partialTicks) => {
            if (this.actuallyDrawBox) {
                let theColor = [this.color[0].get() + this.colorOffset[0].get(), this.color[1].get() + this.colorOffset[1].get(), this.color[2].get() + this.colorOffset[2].get()]
                if (this.isDarkThemeEnabled()) {
                    theColor = theColor.map(a => 255 - a * 0.9)
                }

                RenderLib.drawBox(theColor, this.location.getXExact(), this.location.getYExact(), this.location.getWidthExact(), this.location.getHeightExact(), 3)
            }
        })

        this.events.push(renderEvent)

        this.innerObject = new SoopyGuiElement()

        this.innerObject.location.location.setRelative(false, false)
        this.innerObject.location.size.setRelative(false, false)
        this.innerObject.setLocation(3, 3, -6, -6)

        this.addChild(this.innerObject)

        this.setInnerObject(this.innerObject)
    }

    renderBox(enabled) {
        this.actuallyDrawBox = enabled
        return this
    }

    /**
     * Set wether is it possible to scroll
     * @param {Boolean} possible
     */
    setScrollable(possible) {
        this.innerObject.scrollable = possible
        return this;
    }

    /**
     * Allows setting the rgb of the box
     * @param {Number} r The red value of the box (0-255)
     * @param {Number} g The green value of the box (0-255)
     * @param {Number} b The blue value of the box (0-255)
     * @param {Number} anim The animation time in ms for this change
     * @returns {SoopyBoxElement} this for method chaining
     */
    setColor(r, g, b, anim) {
        this.color[0].set(r, anim)
        this.color[1].set(g, anim)
        this.color[2].set(b, anim)
        return this
    }

    /**
     * Allows setting the rgb offset of the box
     * NOTE: dont expect this to be avalible all the time,
     * if there is a class extending this, it may use this var already
     * 
     * @param {Number} r The red value of the box (0-255)
     * @param {Number} g The green value of the box (0-255)
     * @param {Number} b The blue value of the box (0-255)
     * @param {Number} anim The animation time in ms for this change
     * @returns {SoopyBoxElement} this for method chaining
     */
    setColorOffset(r, g, b, anim) {
        this.colorOffset[0].set(r, anim)
        this.colorOffset[1].set(g, anim)
        this.colorOffset[2].set(b, anim)
        return this
    }
}

export default SoopyBoxElement