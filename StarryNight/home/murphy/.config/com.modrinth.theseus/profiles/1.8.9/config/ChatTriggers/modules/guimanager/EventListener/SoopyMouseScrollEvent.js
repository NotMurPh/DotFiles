/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "./SoopyEventListener"

/**
 * The render background event, this will run whenever the background of the gui / gui element is rendered
 * @class
 * @extends SoopyMouseScrollEvent
 */
class SoopyMouseScrollEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyMouseScrollEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.MOUSE_SCROLL)
    }

    
    /**
     * Triggers the event handler with the given arguments
     * 
     * @param {Array.<any>} args The list of arguments to pass to the event handler
     */
    _trigger(caller, args){
        let boundingBox = caller.getBoundingBox()
        
        if(boundingBox){
            let [mouseX, mouseY] = args

            if(mouseX > boundingBox[0] && mouseX < boundingBox[2]
            && mouseY > boundingBox[1] && mouseY < boundingBox[3]){
                super._trigger(caller, args)
            }
        }
    }
}

export default SoopyMouseScrollEvent