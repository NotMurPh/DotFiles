import { SoopyRenderEvent } from "../index";
import SoopyNumber from "../Classes/SoopyNumber";
import SoopyGlobalMouseClickEvent from "../EventListener/SoopyGlobalMouseClickEvent";
import SoopyMouseClickEvent from "../EventListener/SoopyMouseClickEvent";
import BoxWithText from "./BoxWithText";
import ButtonWithArrow from "./ButtonWithArrow";
import SoopyBoxElement from "./SoopyBoxElement";
import SoopyContentChangeEvent from "../EventListener/SoopyContentChangeEvent";
import Enum from "../Enum";
import TextBox from "./TextBox";
import SoopyGuiElement from "./SoopyGuiElement";
import SoopyRenderUpdateEvent from "../EventListener/SoopyRenderUpdateEvent";
import SoopyOpenGuiEvent from "../EventListener/SoopyOpenGuiEvent";

class Dropdown extends BoxWithText {
    constructor() {
        super()

        this.text.location.size.x.set(0.7)
        this.text.location.location.x.set(0.05)

        this.colorPrefix = "&0"

        this.points = [new SoopyNumber(0), new SoopyNumber(0.5), new SoopyNumber(1), new SoopyNumber(0.5)]

        this.addEvent(new SoopyRenderEvent().setHandler(() => {

            let thisX = this.location.getXExact()
            let thisY = this.location.getYExact()
            let thisW = this.location.getWidthExact()
            let thisH = this.location.getHeightExact()


            Renderer.drawLine(Renderer.color(0, 0, 0), thisX + thisW * 0.95 - this.points[0].get() * thisW * 0.1 - thisW * 0.05, thisY + thisH * 2 / 5, thisX + thisW * 0.95 - this.points[1].get() * thisW * 0.1 - thisW * 0.05, thisY + thisH * 3 / 5, 1)
            Renderer.drawLine(Renderer.color(0, 0, 0), thisX + thisW * 0.95 - this.points[2].get() * thisW * 0.1 - thisW * 0.05, thisY + thisH * 2 / 5, thisX + thisW * 0.95 - this.points[3].get() * thisW * 0.1 - thisW * 0.05, thisY + thisH * 3 / 5, 1)
        }))

        this.addEvent(new SoopyMouseClickEvent().setHandler(() => {
            if (this.isOpen) { this.close() } else { this.open() }
            // console.log("click")
        }))

        this.addEvent(new SoopyGlobalMouseClickEvent().setHandler(() => {
            if (this.hovered) return
            if (this.mainElement.hovered) return
            this.close()
            // console.log("global")
        }))

        this.mainElement = new SoopyBoxElement()
        this.mainElement.location.size.setRelative(true, false)

        this.itemsElement = new SoopyGuiElement().setScrollable(true).setLocation(0, 0, 1, 0)
        this.itemsElement.location.size.setRelative(true, false)
        this.mainElement.addChild(this.itemsElement)

        this.searchElement = new TextBox().setLocation(0, 0, 1, 0).setPlaceholder("Search...")
        this.searchElement.location.location.setRelative(true, false)
        this.searchElement.location.size.setRelative(true, false)
        this.mainElement.addChild(this.searchElement)

        this.search = ""

        this.searchElement.text.addEvent(new SoopyContentChangeEvent().setHandler((search) => {
            this.search = search

            this.itemsElement._scrollAmount = 0
            this.itemsElement.location.scroll.y.set(0, 250)

            this.regenOptions()
        }))

        this.mainElement.addEvent(new SoopyRenderUpdateEvent().setHandler(() => {
            if (this.mainElement.parent && this.mainElement.location.size.y.get() === 0) this.mainElement.parent.removeChild(this.mainElement)
        }))
        this.addEvent(new SoopyOpenGuiEvent().setHandler(() => {
            this.close()
        }))

        this.options = {}
        this.selectedOption = undefined

        this.isOpen = false
    }

    open() {
        this.points[0].set(0.5, 250)
        this.points[1].set(0, 250)
        this.points[2].set(0.5, 250)
        this.points[3].set(1, 250)
        this.isOpen = true

        this.main.element.addChild(this.mainElement)

        let x = this.location.getXExact()
        let y = this.location.getYExact() + this.location.getHeightExact()
        let width = this.location.getWidthExact()
        let height = (this.location.getHeightExact() + 4) * Math.min(6, Object.keys(this.options).length)

        let animateUp = false
        if (y + height > Renderer.screen.getHeight()) {
            y = this.location.getYExact() - height
            animateUp = true
        }

        this.mainElement.setLocation(x / Renderer.screen.getWidth(), y / Renderer.screen.getHeight(), width / Renderer.screen.getWidth(), 1)
        this.mainElement.location.size.y.set(height, 250)
        if (animateUp) {
            this.mainElement.location.location.y.set((y + height) / Renderer.screen.getHeight(), 0)
            this.mainElement.location.location.y.set(y / Renderer.screen.getHeight(), 250)
        }

        this.itemsElement.location.size.y.set((this.location.getHeightExact() + 4) * Math.min(5, Object.keys(this.options).length), 0)

        this.searchElement.visible = false
        if (Object.keys(this.options).length > 5) {
            this.searchElement.visible = true
        }
        this.searchElement.location.location.y.set((this.location.getHeightExact() + 4) * Math.min(5, Object.keys(this.options).length), 0)
        this.searchElement.location.size.y.set(this.location.getHeightExact(), 0)

        this.searchElement.setText("")
        this.search = ""

        this.itemsElement._scrollAmount = 0
        this.itemsElement.location.scroll.y.set(0, 250)

        this.regenOptions()
    }

    setColorPrefix(pre) {
        this.colorPrefix = pre

        this.text.setText(this.colorPrefix + this.options[this.selectedOption])
        return this
    }

    close() {
        this.points[0].set(0, 250)
        this.points[1].set(0.5, 250)
        this.points[2].set(1, 250)
        this.points[3].set(0.5, 250)
        this.isOpen = false

        this.mainElement.location.size.y.set(0, 250)
    }

    setOptions(options) {
        this.options = options
        this.regenOptions()
        return this
    }

    /**
     * Regens the options in the dropdown list
     */
    regenOptions() {
        this.itemsElement.clearChildren()
        let y = 0
        let height = this.location.getHeightExact()
        Object.keys(this.options).forEach(key => {
            if (!this.options[key].toLowerCase().includes(this.search.toLowerCase())) return

            let optionElement = new ButtonWithArrow().setText("§0" + this.options[key]).setLocation(0, y, 1, height)
            optionElement.location.location.setRelative(true, false)
            optionElement.location.size.setRelative(true, false)

            optionElement.addEvent(new SoopyMouseClickEvent().setHandler(() => {
                let prevKey = this.selectedOption

                this.setSelectedOption(key)
                this.close()

                this.triggerEvent(Enum.EVENT.CONTENT_CHANGE, [key, prevKey, () => {
                    this.setSelectedOption(prevKey)
                }])
            }))

            this.itemsElement.addChild(optionElement)

            y += height
        })
    }

    setSelectedOption(option) {
        this.selectedOption = option
        this.text.setText(this.colorPrefix + this.options[option])
        return this
    }

    getSelectedOption() {
        return this.selectedOption
    }
}

export default Dropdown