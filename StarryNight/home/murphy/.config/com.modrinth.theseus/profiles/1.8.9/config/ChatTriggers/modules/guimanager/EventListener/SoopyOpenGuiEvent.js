/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "../EventListener/SoopyEventListener"

/**
 * The gui opened event, this will trigger whenever the gui is opened
 * usefull for resetting elements to default values
 * @class
 * @extends SoopyOpenGuiEvent
 */
class SoopyOpenGuiEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyOpenGuiEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.OPEN_GUI)
    }
}

export default SoopyOpenGuiEvent