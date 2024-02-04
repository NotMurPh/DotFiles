/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "./SoopyEventListener"

/**
 * The content change event, this will be fired when the content of a gui element is changed.
 * This may occur when a textbox has a keypress, a toggle is clicked, ect
 * @class
 * @extends SoopyContentChangeEvent
 */
class SoopyContentChangeEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyContentChangeEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.CONTENT_CHANGE)
    }
}

export default SoopyContentChangeEvent