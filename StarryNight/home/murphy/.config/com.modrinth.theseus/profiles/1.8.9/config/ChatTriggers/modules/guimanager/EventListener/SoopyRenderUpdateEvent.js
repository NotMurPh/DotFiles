/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "../EventListener/SoopyEventListener"
import renderLibs from "../renderLibs"

/**
 * The render background event, this will run whenever the background of the gui / gui element is rendered
 * @class
 * @extends SoopyRenderUpdateEvent
 */
class SoopyRenderUpdateEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyRenderUpdateEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.RENDER_UPDATE)
    }

    
    /**
     * Triggers the event handler with the given arguments
     * 
     * @param {Array.<any>} args The list of arguments to pass to the event handler
     */
    _trigger(caller, args){
        super._trigger(caller, args)
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
        return !!caller.getBoundingBox()
    }
}

export default SoopyRenderUpdateEvent