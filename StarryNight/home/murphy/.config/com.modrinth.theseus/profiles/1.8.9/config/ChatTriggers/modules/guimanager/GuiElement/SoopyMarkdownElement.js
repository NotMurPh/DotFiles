/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyGuiElement from "./SoopyGuiElement"

import renderLibs from "../renderLibs"

/**
 * A box.
 * @class
 */
class SoopyMarkdownElement extends SoopyGuiElement {
    /**
     * Creates a {@link SoopyMarkdownElement}
     * @constructor
     */
    constructor() {

        super()

        /**
         * The text to display.
         * @type {string}
         */
        this.text = ""

        this.textDarkThemeCache = ""

        let renderEvent = new SoopyRenderEvent()

        renderEvent.setHandler((mouseX, mouseY, partialTicks) => {
            let { height, imageClickData } = renderLibs.renderTextBlockWithMarkup(this.isDarkThemeEnabled() ? this.textDarkThemeCache : this.text, this.location.getXExact(), this.location.getYExact() + 2, this.location.getWidthExact())

            height += 2

            let newHeight = height / this.parent.location.getHeightExact()
            this.location.size.y.set(newHeight)
        })

        this.events.push(renderEvent)
    }

    /**
     * Set the text
     * @param {string} text - The text to display.
     * @returns {SoopyMarkdownElement} this for method chaining
     */
    setText(text) {
        this.text = text
        this.textDarkThemeCache = renderLibs.darkThemifyText(text)
        return this
    }

    /**
     * This will RENDER the text off screen and get the height returned
     * 
     * DONT USE OFTEN AS THIS WILL RENDER THE TEXT = POTENTIAL LAG
     */
    getHeight() {
        let { height } = renderLibs.renderTextBlockWithMarkup(this.text, 0, 0, this.location.getWidthExact(), false)

        height += 2

        let newHeight = height / this.parent.location.getHeightExact()
        this.location.size.y.set(newHeight)
        return newHeight
    }
}

export default SoopyMarkdownElement