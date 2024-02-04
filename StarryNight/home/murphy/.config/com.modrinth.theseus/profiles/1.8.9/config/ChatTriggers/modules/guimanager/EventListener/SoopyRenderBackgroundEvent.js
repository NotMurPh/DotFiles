/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import Enums from "../Enum"
import SoopyEventListener from "../EventListener/SoopyEventListener"

/**
 * The render background event, this will run whenever the background of the gui / gui element is rendered
 * @class
 * @extends SoopyEventListener
 */
class SoopyRenderBackgroundEvent extends SoopyEventListener{
    
    /**
     * Creates a {@link SoopyRenderBackgroundEvent}
     * @constructor
     */
    constructor(){
        super(Enums.EVENT.RENDER_BACKGROUND)
    }
}

export default SoopyRenderBackgroundEvent