/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

let enumID = 0

/**
 * A list of all the enums in the program
 * @enum {String|Object.<String>}
 */
let Enum = {
    "EVENT":{
        "RENDER_BACKGROUND":enumID++,
        "RENDER":enumID++,
        "RENDER_UPDATE":enumID++,
        "MOUSE_CLICK": enumID++,
        "MOUSE_RELEASE": enumID++,
        "MOUSE_CLICK_GLOBAL": enumID++,
        "KEY_PRESS": enumID++,
        "MOUSE_SCROLL": enumID++,
        "OPEN_GUI": enumID++,
        "RESET_FRAME_CACHES": enumID++,
        "CONTENT_CHANGE": enumID++,
        "HOVER_CHANGE": enumID++
    }
}

export default Enum