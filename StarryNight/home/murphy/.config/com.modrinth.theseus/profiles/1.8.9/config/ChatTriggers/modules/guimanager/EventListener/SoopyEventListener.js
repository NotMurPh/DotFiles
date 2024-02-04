/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

/**
 * The event listener class, you can create an event and set a handler for it
 * @class
 * @abstract
 * @tutorial UsingEventListener
 */
class SoopyEventListener{

    /**
     * The event handler, this will be run when the event is triggered
     * @type {function}
     */
    handler = undefined

    /**
     * The type of the event, must be a {@type Enum.EVENT}
     * @type {Enum.EVENT}
     */
    eventType = undefined

    /**
     * Creates the SoopyEventListener
     * @constructor
     */
    constructor(eventType){
        this.eventType = eventType
    }

    /**
     * Sets the event handler function of the event
     * @param {Function} handlerFunction The function to be ran when the event triggers
     * @return {SoopyEventListener} Returns this for method chaining
     */
    setHandler(handlerFunction){
        this.handler = handlerFunction
        return this
    }

    /**
     * Triggers the event handler with the given arguments
     * 
     * @param {Array.<any>} args The list of arguments to pass to the event handler
     */
    _trigger(caller, args){
        this.handler(...args)
    }

    
    /**
     * Calculates wether an event should be triggered or not
     * 
     * This will also propogate to the children
     * So it should be "STATIC" and not refer to the instance
     * @param {*} caller 
     * @param {*} args 
     */
    _shouldTrigger(caller, args){
        return true
    }
}

export default SoopyEventListener