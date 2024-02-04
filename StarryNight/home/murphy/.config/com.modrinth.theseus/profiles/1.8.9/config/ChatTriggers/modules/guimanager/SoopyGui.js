/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />
import SoopyGuiElement from './GuiElement/SoopyGuiElement';
import Enums from "./Enum"
import SoopyPosition from './Classes/SoopyPosition';
import SoopyLocation from './Classes/SoopyLocation';
import TextBox from './GuiElement/TextBox';
import SoopyContentChangeEvent from './EventListener/SoopyContentChangeEvent';
import SoopyKeyPressEvent from './EventListener/SoopyKeyPressEvent';
import Notification from './Notification';
import SoopyGlobalMouseClickEvent from './EventListener/SoopyGlobalMouseClickEvent';
import renderLibs from './renderLibs';

if (!global.guiManagerSoopyGuisList) {
    global.guiManagerSoopyGuisList = []
    global.guiManagerSoopyGuisDarkThemeEnabled = false
    global.guiManagerSoopyGuisSetDarkThemeEnabled = (enabled) => {
        if (enabled !== global.guiManagerSoopyGuisDarkThemeEnabled) {
            global.guiManagerSoopyGuisDarkThemeEnabled = enabled
            global.guiManagerSoopyGuisList.forEach(gui => {
                gui.darkThemeEnabled = enabled
            })
        }
    }
}

/**
 * The main class of the guimanager, this one stores all the data about the gui
 * @class SoopyGui represents a gui
 */
class SoopyGui {
    /** 
     * Creates a {@link SoopyGui} for use in GUI creation
     * @constructor
     */
    constructor() {
        global.guiManagerSoopyGuisList.push(this)

        /**
         * The ChatTriggers gui
         * @type {Gui}
         */
        this.ctGui = new Gui()
        /**
         * The {@link SoopyGuiElement} that represents the gui
         * @type {SoopyGuiElement}
         */
        this.element = new SoopyGuiElement().setMain(this)
        /**
         * The last opened time of the gui
         * 
         * This is in the type of EPOCH milliseconds
         * @type {Number}
         */
        this.lastOpenedTime = 0

        /**
         * Lore data, internal use only
         * 
         * undefined for no lore
         * @type {Array[Number, Number, Array<String>]} [x, y, lore]
         */
        this._loreData = undefined

        /**
         * Litterally just the screen location
         * 
         * @type {SoopyLocation}
         */
        this.location = new SoopyLocation(new SoopyPosition(0, 0), new SoopyPosition(1, 1))

        /**
         * A list of all the ct triggers so they can get disabled on gui delete
         **/
        this.eventsList = []

        /**
         * The currenatly hovered gui element, this will be the smallest thing with all other hovered elements being its parents
         */
        this.hoveredElement = undefined
        /**
         * The currently last rendered hovered element, internal use to calculate actual hovered element
         */
        this._hoveredElement = undefined


        this.eventsList.push(this.ctGui.registerDraw((mouseX, mouseY, partialTicks) => {
            this._render(mouseX, mouseY, partialTicks)
        }))

        this.eventsList.push(this.ctGui.registerClicked((mouseX, mouseY, button) => {
            this._onClick(mouseX, mouseY, button)
        }))
        this.eventsList.push(this.ctGui.registerMouseReleased((mouseX, mouseY, button) => {
            this._onRelease(mouseX, mouseY, button)
        }))
        this.eventsList.push(this.ctGui.registerScrolled((mouseX, mouseY, scroll) => {
            this._onScroll(mouseX, mouseY, scroll)
        }))
        this.eventsList.push(this.ctGui.registerKeyTyped((key, keyId) => {
            this._onKeyPress.call(this, key, keyId)
        }))

        /**
         * When True this will only update the location of elements every tick instead of every frame
         * May make motion janky
         */
        this.optimisedLocations = false

        /**
         * When True this will only update the location of elements second instead of tick/frame
         * Will basicly delete animations
         * only use if the gui has no motion
         */
        this.slowLocations = false

        /**
         * Enables some things to help with debugging a gui
         */
        this.isDebugEnabled = false

        /**
         * Wether the gui is active, used to disable triggers with .destroy()
         **/
        this.enabled = true

        /**
         * Wether dark theme is enabled
         */
        this.darkThemeEnabled = global.guiManagerSoopyGuisDarkThemeEnabled

        this.eventsList.push(register("step", () => {
            if (this.optimisedLocations && !this.slowLocations) this.element.triggerEvent(Enums.EVENT.RESET_FRAME_CACHES)
        }).setFps(10))

        this.eventsList.push(register("step", () => {
            if (this.slowLocations) this.element.triggerEvent(Enums.EVENT.RESET_FRAME_CACHES)
        }).setFps(1))
    }

    /**
     * Wether dark theme is enabled
     * @return {Boolean} Wether dark theme is enabled
     */
    isDarkThemeEnabled() {
        return this.darkThemeEnabled
    }
    /**
     * Wether the gui is currently open
     * @type {Boolean}
     */
    get isOpen() {
        return this.ctGui.isOpen()
    }

    /**
     * Set a command that will open the gui when ran
     * @param {String} commandName The name of the command to run to open the gui, "/{commandName}"
     * @return {SoopyGui} Returns the gui for method chaining
     */
    setOpenCommand(commandName) {
        this.eventsList.push(register("command", () => {
            if (this.enabled) this.open()
        }).setName(commandName, true))

        return this
    }

    /**
     * Opens the gui
     * @return {SoopyGui} Returns the gui for method chaining
     */
    open() {
        this.ctGui.open()
        this.lastOpenedTime = Date.now()

        this.element.triggerEvent(Enums.EVENT.OPEN_GUI)

        return this
    }

    /**
     * Closes the gui
     * @return {SoopyGui} Returns the gui for method chaining
     */
    close() {
        if (this.isOpen) {
            Client.currentGui.close()
        }

        return this
    }

    /**
     * Deletes the gui, this will unregister all triggers
     * Will not actually delete the contents
     * but if you remove all references to it, it should get garbage collected
     */
    delete() {
        this.enabled = false

        this.close()

        this.eventsList.forEach(event => {
            event.unregister()
        })

        global.guiManagerSoopyGuisList.splice(global.guiManagerSoopyGuisList.indexOf(this), 1)

        return this
    }

    /**
     * Renders the gui
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} partialTicks The partialTicks
     */
    _render(mouseX, mouseY, partialTicks) {
        try {
            this._loreData = undefined

            this._renderBackground(mouseX, mouseY, partialTicks)

            if (!this.optimisedLocations && !this.slowLocations) this.element.triggerEvent(Enums.EVENT.RESET_FRAME_CACHES)

            let oldHoveredElement = this._hoveredElement

            this.element.triggerEvent(Enums.EVENT.RENDER_UPDATE, [mouseX, mouseY, partialTicks])
            this.element.triggerEvent(Enums.EVENT.RENDER, [mouseX, mouseY, partialTicks])

            Notification.doRender()

            if (oldHoveredElement !== this._hoveredElement) {
                while (oldHoveredElement) {
                    oldHoveredElement.hovered = false

                    oldHoveredElement.triggerEvent(Enums.EVENT.HOVER_CHANGE, [false], false)

                    oldHoveredElement = oldHoveredElement.parent
                }

                let newHoveredElement = this._hoveredElement
                while (newHoveredElement) {
                    newHoveredElement.hovered = true

                    newHoveredElement.triggerEvent(Enums.EVENT.HOVER_CHANGE, [true], false)

                    newHoveredElement = newHoveredElement.parent
                }
            }

            this.hoveredElement = this._hoveredElement


            if (this._loreData) { //TODO: move into function in renderLibs
                let [x, y, lore] = this._loreData

                let maxWidth = 0

                lore.forEach((line) => {
                    let width = Renderer.getStringWidth(line);

                    if (width > maxWidth) maxWidth = width
                })

                let l1 = x + 12;
                let i2 = y - 12;
                let k = 8;

                if (lore.length > 1) {
                    k += 2 + (lore.length - 1) * 10;
                }

                if (l1 + maxWidth > Renderer.screen.getWidth()) {
                    l1 -= 28 + maxWidth;
                }

                if (i2 + k + 6 > Renderer.screen.getHeight()) {
                    i2 = Renderer.screen.getHeight() - k - 6;
                }

                let borderColor = Renderer.color(35, 1, 85);
                let backgroundColor = -267386864

                function drawRectStupid(color, x1, y1, x2, y2) {
                    Renderer.translate(0, 0, 1000)
                    Renderer.drawRect(color, x1, y1, x2 - x1, y2 - y1)
                }

                drawRectStupid(backgroundColor, l1 - 3, i2 - 4, l1 + maxWidth + 3, i2 - 3)
                drawRectStupid(backgroundColor, l1 - 3, i2 + k + 3, l1 + maxWidth + 3, i2 + k + 4)
                drawRectStupid(backgroundColor, l1 - 3, i2 - 3, l1 + maxWidth + 3, i2 + k + 3)
                drawRectStupid(backgroundColor, l1 - 4, i2 - 3, l1 - 3, i2 + k + 3)
                drawRectStupid(backgroundColor, l1 + maxWidth + 3, i2 - 3, l1 + maxWidth + 4, i2 + k + 3)

                drawRectStupid(borderColor, l1 - 3, i2 - 3 + 1, l1 - 3 + 1, i2 + k + 3 - 1)
                drawRectStupid(borderColor, l1 + maxWidth + 2, i2 - 3 + 1, l1 + maxWidth + 3, i2 + k + 3 - 1)
                drawRectStupid(borderColor, l1 - 3, i2 - 3, l1 + maxWidth + 3, i2 - 3 + 1)
                drawRectStupid(borderColor, l1 - 3, i2 + k + 2, l1 + maxWidth + 3, i2 + k + 3)

                lore.forEach((line, i) => {
                    Renderer.translate(0, 0, 1000)
                    Renderer.drawStringWithShadow(line, l1, i2)

                    if (i === 0) i2 += 2
                    i2 += 10
                })
            }
        } catch (e) {
            console.log("ERROR RENDERING SOOPY GUI")
            console.log(JSON.stringify(e, undefined, 2))

            renderLibs.stopScizzor()
        }
    }

    /**
     * mouse clicked handler
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} button The button that was clicked
     */
    _onClick(mouseX, mouseY, button) {
        this.element.triggerEvent(Enums.EVENT.MOUSE_CLICK_GLOBAL, [mouseX, mouseY, button])
        this.element.triggerEvent(Enums.EVENT.MOUSE_CLICK, [mouseX, mouseY, button])
    }

    /**
     * mouse released handler
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} button The button that was released
     */
    _onRelease(mouseX, mouseY, button) {
        this.element.triggerEvent(Enums.EVENT.MOUSE_RELEASE, [mouseX, mouseY, button])
    }

    /**
     * mouse scrolled handler
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} scroll The scroll
     */
    _onScroll(mouseX, mouseY, scroll) {
        this.element.triggerEvent(Enums.EVENT.MOUSE_SCROLL, [mouseX, mouseY, scroll])
    }

    /**
     * key press handler
     * 
     * For internal use only
     */
    _onKeyPress(key, keyId) {
        this.element.triggerEvent(Enums.EVENT.KEY_PRESS, [key, keyId])

        if (keyId === 57 && this.ctGui.isControlDown()) {
            //Open command console

            openCommandConsole(this)
        }
    }

    /**
     * Renders the background of the gui
     * 
     * For internal use only
     * @param {Number} mouseX The x location of the mouse
     * @param {Number} mouseY The y location of the mouse
     * @param {Number} partialTicks The partialTicks
     */
    _renderBackground(mouseX, mouseY, partialTicks) {
        Renderer.drawRect(Renderer.color(0, 0, 0, 100), 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
    }
}

export default SoopyGui


/**
 * @param {SoopyGui} gui 
 */
function openCommandConsole(gui) {
    gui._onClick(-1, -1, -1)

    let commandTextBox = new TextBox().setLocation(0.3, 1, 0.4, 0.05)
    commandTextBox.text.placeholder = "Enter command..."
    commandTextBox.location.location.y.set(0.9, 500)
    commandTextBox.text.selected = true
    gui.element.addChild(commandTextBox)

    commandTextBox.text.addEvent(new SoopyContentChangeEvent().setHandler((newVal, oldVal, resetFun) => {
        newVal = newVal.split("§7")[0]
        let commands = Object.keys(commandConsoleCommands).filter(a => a.toLowerCase().startsWith(newVal))
        let selectedCommand = commands[0] || ""
        let restOfText = selectedCommand.substr(newVal.length)
        commandTextBox.text.text = newVal
        commandTextBox.text.setSuffix("§7" + restOfText)
    }))
    commandTextBox.text.addEvent(new SoopyGlobalMouseClickEvent().setHandler(() => {
        if (!commandTextBox.text.selected) {
            commandTextBox.location.location.y.set(1, 500)
            setTimeout(() => {
                gui.element.removeChild(commandTextBox)
            }, 500)
        }
    }))
    commandTextBox.text.addEvent(new SoopyKeyPressEvent().setHandler((key, keyId) => {
        if (commandTextBox.text.selected) {
            let text = commandTextBox.text.text
            // if (commandTextBox.text.cursorTextLocationId > text.length) commandTextBox.text.cursorTextLocationId = text.length
            // console.log(keyId)
            if (keyId === 15) {//tab
                commandTextBox.setText(commandTextBox.text.text + ChatLib.removeFormatting(commandTextBox.text.suffix))

                commandTextBox.text.setSuffix("")
            }
            if (keyId === 28) { //pressed enter, run command
                let command = text
                commandTextBox.setText("")

                let args = command.split(" ")
                let commandName = args.shift()

                if (commandConsoleCommands[commandName.toLowerCase()]) {
                    commandConsoleCommands[commandName.toLowerCase()](gui, args)
                } else {
                    commandConsoleCommands["default"](gui, commandName, args)
                }
            }
        }
    }))
}

let commandConsoleCommands = {
    "enabledebug": (gui) => {
        gui.isDebugEnabled = true
        new Notification("Enabled debug mode!", [""])
    },
    "disabledebug": (gui) => {
        gui.isDebugEnabled = false
        new Notification("Disabled debug mode!", [""])
    },
    "disableoptimisation": (gui) => {
        gui.optimisedLocations = false
        gui.slowLocations = false
        new Notification("Disabled optimisations", [""])
    },
    "enableoptimisation": (gui) => {
        gui.optimisedLocations = true
        new Notification("Enabled optimisations", ["(Low setting)"])
    },
    "enableoptimisationhigh": (gui) => {
        gui.slowLocations = true
        new Notification("Enabled optimisations", ["(High setting)"])
    },
    /**
     * @param {SoopyGui} gui 
     */
    "logguisetup": (gui) => {
        function logElement(element, tabs = "") {
            console.log(tabs + element.constructor.name + " {")
            if (element.text && typeof element.text === "string") {
                console.log(tabs + "  " + "\"text\": " + JSON.stringify(element.text))
            } else {
                if (element.children.length === 0) console.log(tabs + "  ")
            }
            element.children.forEach(child => {
                logElement(child, tabs + "  ")
            })
            console.log(tabs + "}")
        }
        logElement(gui.element)
    },
    "theme": (gui) => {
        gui.darkThemeEnabled = !gui.darkThemeEnabled
        new Notification((gui.darkThemeEnabled ? "enabled" : "disabled") + " dark theme", [])
    },
    "default": (gui) => {
        //unknown command
        new Notification("Unknown command", ["Use 'help' for a list of commands!"])
    }
}