/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "./SoopyEventListener"

/**
 * Key press event
 * @class
 * @extends SoopyKeyPressEvent
 */
class SoopyKeyPressEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyKeyPressEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.KEY_PRESS)
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

export default SoopyKeyPressEvent