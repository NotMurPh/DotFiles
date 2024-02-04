/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyNumber from "./SoopyNumber"

/**
 * A position, this will have a x and y
 * @class
 */
class SoopyPosition {

    /**
     * Creates a {@link SoopyPosition}
     * @constructor
     * @arg {Number} x The x position
     * @arg {Number} y The y position
     */
    constructor(x, y) {
        /**
         * The x position
         * @type {SoopyNumber}
         */
        this.x = new SoopyNumber(x)

        /**
         * True if the x is a percentage instead of raw pixel value
         */
        this.xIsRelative = true
        /**
         * The y position
         * @type {SoopyNumber}
         */
        this.y = new SoopyNumber(y)

        /**
         * True if the y is a percentage instead of raw pixel value
         */
        this.yIsRelative = true

        this.shouldNegativeWrapV=true

        this.xCache = undefined
        this.yCache = undefined
        this.shouldCache = false
    }

    /**
     * Allows setting the animation easing mode
     * @param {String} mode The animation mode
     */
     setAnimMode(mode){
        this.x.setAnimMode(mode)
        this.y.setAnimMode(mode)
        return this
    }
    /**
     *Negaive whrap: when exact position negative, it will wrap to the other side 
     */
    shouldNegativeWrap(val){
        this.shouldNegativeWrapV = val
        return this
    }

    /**
     * Takes a soopy position number (usually in 0-1 percentage) and turns it into the screen coordinate
     * @param {Number} pos The position
     * @param {Boolean} isX True if the value is x, false if its y
     * @return {Number} The screen coordinate
     */
    static positionToExact(pos, isX, referance){

        let min = 0
        let max = isX?Renderer.screen.getWidth():Renderer.screen.getHeight()

        if(referance){
            min = referance[0]
            max = referance[1]
        }
        return min+(pos*(max-min))
    }

    /**
     * Takes a screen coordinate and turns it into a soopy position number (0-1)
     * @param {Number} pos The position
     * @param {Boolean} isX True if the value is x, false if its y
     * @return {Number} The soopy position number
     */
    static exactToPosition = function(pos, isX, referance){
        return null
    }

    getXAsExact(ref, useRef=true){
        if(this.shouldCache){
            if(this.xCache) return this.xCache
            this.xCache = this._getXAsExact(ref, useRef)
            return this.xCache
        }
        return this._getXAsExact(ref, useRef)
    }
    _getXAsExact(ref, useRef=true){
        if(this.xIsRelative) return SoopyPosition.positionToExact(this.x.get(),true, ref)

        if(this.x.get()<0 && this.shouldNegativeWrapV){
            if(!useRef) return SoopyPosition.positionToExact(1,true, ref)+this.x.get()

            return SoopyPosition.positionToExact(1,true, ref)+(ref[0]+this.x.get())
        }

        if(!useRef) return this.x.get()

        return ref[0]+this.x.get()
    }
    getYAsExact(ref, useRef=true){
        if(this.shouldCache){
            if(this.yCache) return this.yCache
            this.yCache = this._getYAsExact(ref, useRef)
            return this.yCache
        }
        return this._getYAsExact(ref, useRef)
    }
    _getYAsExact(ref, useRef=true){
        if(this.yIsRelative) return SoopyPosition.positionToExact(this.y.get(),false, ref)

        if(this.y.get()<0 && this.shouldNegativeWrapV){
            if(!useRef) return SoopyPosition.positionToExact(1,false, ref)+this.y.get()

            return SoopyPosition.positionToExact(1,false, ref)+(ref[0]+this.y.get())
        }

        if(!useRef) return this.y.get()

        return ref[0]+this.y.get()
    }

    /**
     * Sets the x and y's relative status
     * 
     * You can use negative numbers (in location) to referance 1-number
     * eg -3 would be 3px less than the max
     * 
     * @param {Boolean} x Wether the x position is a percentage or not
     * @param {Boolean} y Wether the y position is a percentage or not
     * @return {SoopyPosition} This for method chaining
     */
    setRelative(x, y){
        this.xIsRelative = x
        this.yIsRelative = y
        return this
    }

    /**
     * Clears the location cache, should be run every frame
     */
    clearCache(){
        this.xCache = undefined
        this.yCache = undefined
    }

    /**
     * enables caching
     * @returns {SoopyLocation} this for method chaining
     */
    enableCache(){
        this.shouldCache = true
        return this
    }

    /**
     * disables caching
     * @returns {SoopyLocation} this for method chaining
     */
    disableCache(){
        this.shouldCache = false
        return this
    }
}

export default SoopyPosition