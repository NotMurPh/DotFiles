/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "./SoopyEventListener"

/**
 * The render background event, this will run whenever the background of the gui / gui element is rendered
 * @class
 * @extends SoopyGlobalMouseClickEvent
 */
class SoopyGlobalMouseClickEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyGlobalMouseClickEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.MOUSE_CLICK_GLOBAL)
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

export default SoopyGlobalMouseClickEvent