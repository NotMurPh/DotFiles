/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyPosition from "../Classes/SoopyPosition"

/**
 * A location, this will have 2 {@link SoopyPosition}'s (One for x and y, one for width and height)
 * @class
 */
class SoopyLocation {
    /**
     * Creates a {@link SoopyLocation}
     * @constructor
     * @arg {SoopyPosition} location The location of the location
     * @arg {SoopyPosition} size The size of the location
     */
    constructor(location, size, referanceFrame) {
        /**
         * The location
         * @type {SoopyPosition}
         */
        this.location = location

        /**
         * The width and height
         * @type {SoopyPosition}
         */
        this.size = size

        this.widthCache = undefined
        this.heightCache = undefined
        this.xCache = undefined
        this.yCache = undefined

        this.scroll = new SoopyPosition(0, 0).setRelative(false, false).shouldNegativeWrap(false).setAnimMode("sin_out").enableCache()

        this.shouldCache = false

        this.referanceFrame = referanceFrame
    }

    /**
     * Gets the width, taking into account the referanceframe
     * @returns {Number} the width
     */
    getWidthExact() {
        if (this.shouldCache && this.widthCache !== undefined) return this.widthCache
        let ref = undefined
        if (this.referanceFrame) {
            ref = [0, this.referanceFrame.getWidthExact()]
        }
        this.widthCache = this.size.getXAsExact(ref, false)
        return this.widthCache
    }
    /**
     * Gets the height, taking into account the referanceframe
     * @returns {Number} the height
     */
    getHeightExact() {
        if (this.shouldCache && this.heightCache !== undefined) return this.heightCache
        let ref = undefined
        if (this.referanceFrame) {
            ref = [0, this.referanceFrame.getHeightExact()]
        }
        this.heightCache = this.size.getYAsExact(ref, false)
        return this.heightCache
    }
    /**
     * gets the x, taking into account the referanceframe
     * @returns {Number} the x
     */
    getXExact() {
        if (this.shouldCache && this.xCache !== undefined) return this.xCache
        let ref = undefined
        if (this.referanceFrame) {
            ref = [this.referanceFrame.getXExact()]
            ref[1] = ref[0] + this.referanceFrame.getWidthExact()
        }
        this.xCache = this.location.getXAsExact(ref, true)
        return this.xCache
    }
    /**
     * gets the y, taking into account the referanceframe
     * @returns {Number} the y
     */
    getYExact() {
        if (this.shouldCache && this.yCache !== undefined) return this.yCache
        let ref = undefined
        if (this.referanceFrame) {
            ref = [this.referanceFrame.getYExact() + this.referanceFrame.scroll.getYAsExact(undefined, false)]
            ref[1] = ref[0] + this.referanceFrame.getHeightExact()
        }
        this.yCache = this.location.getYAsExact(ref, true)
        return this.yCache
    }

    /**
     * Clears the location cache, should be run every frame
     */
    clearCache() {
        this.widthCache = undefined
        this.heightCache = undefined
        this.xCache = undefined
        this.yCache = undefined
        this.scroll.clearCache()
    }

    /**
     * enables caching
     * @returns {SoopyLocation} this for method chaining
     */
    enableCache() {
        this.shouldCache = true
        return this
    }

    /**
     * disables caching
     * @returns {SoopyLocation} this for method chaining
     */
    disableCache() {
        this.shouldCache = false
        return this
    }
}

export default SoopyLocation