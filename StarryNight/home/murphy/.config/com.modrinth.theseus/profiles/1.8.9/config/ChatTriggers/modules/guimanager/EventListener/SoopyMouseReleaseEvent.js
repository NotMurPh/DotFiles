/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "../EventListener/SoopyEventListener"

/**
 * @class
 * @extends SoopyMouseReleaseEvent
 */
class SoopyMouseReleaseEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyMouseReleaseEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.MOUSE_RELEASE)
    }

    
    /**
     * Triggers the event handler with the given arguments
     * 
     * @param {Array.<any>} args The list of arguments to pass to the event handler
     */
    _trigger(caller, args){
        super._trigger(caller, args)
    }
}

export default SoopyMouseReleaseEvent