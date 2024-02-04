/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

if (!GlStateManager) {
    var GL11 = Java.type("org.lwjgl.opengl.GL11"); //using var so it goes to global scope
    var GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
}
if (!MCTessellator) {
    var MCTessellator = Java.type("net.minecraft.client.renderer.Tessellator").func_178181_a()
}
if (!WorldRenderer) {
    var WorldRenderer = MCTessellator.func_178180_c()
}
if (!DefaultVertexFormats) {
    var DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats")
}
if (!OpenGlHelper) {
    var OpenGlHelper = Java.type("net.minecraft.client.renderer.OpenGlHelper")
}

let Framebuffer = Java.type("net.minecraft.client.shader.Framebuffer")
import Enum from "../Enum"
import SoopyEventListener from "../EventListener/SoopyEventListener"
import SoopyPosition from "../Classes/SoopyPosition"
import SoopyLocation from "../Classes/SoopyLocation"
import renderLibs from "../renderLibs"
import SoopyMouseScrollEvent from "../EventListener/SoopyMouseScrollEvent"
import SoopyRenderUpdateEvent from "../EventListener/SoopyRenderUpdateEvent";
import SoopyRenderEvent from "../EventListener/SoopyRenderEvent";
import SoopyNumber from "../Classes/SoopyNumber";
import SoopyMouseClickEvent from "../EventListener/SoopyMouseClickEvent";
import SoopyMouseReleaseEvent from "../EventListener/SoopyMouseReleaseEvent";

/**
 * The event listener class, you can create an event and set a handler for it
 * @class
 * @abstract
 */
class SoopyGuiElement {

    /**
     * Creates a {@link SoopyGuiElement}
     * @constructor
     */
    constructor() {
        /**
         * The list of all the events linked to this gui element
         * @type {Array.<SoopyEventListener>}
         */
        this.events = []

        /**
         * The parent element
         * @type {SoopyGuiElement}
         */
        this.parent = undefined

        /**
         * The children of this element
         * @type {Array.<SoopyGuiElement>} an array of the children
         */
        this.children = []

        /**
         * The location of the gui element
         * @type {SoopyLocation}
         */
        this.location = new SoopyLocation(new SoopyPosition(0, 0), new SoopyPosition(1, 1), undefined).enableCache()

        /**
         * Wether the gui element is hovered
         * @type {boolean}
         */
        this.hovered = false

        /**
         * Wether is is possible to scroll the gui element
         */
        this.scrollable = false

        /**
         * Lore to render when hovered
         * @type {Array<String> | undefined} //undefined to not show
         */
        this.lore = undefined

        this._framebuffer = undefined

        this.framebufferEnabledOnElement = false

        this.frameBufferDirty = false

        /**
         * Wether to render this element
         * disabling will disable all events.
         */
        this.visable = true

        this.main = undefined

        this.innerObjectPaddingThing = undefined


        this.events.push(new SoopyEventListener(Enum.EVENT.RESET_FRAME_CACHES).setHandler(() => {
            this.boundingBoxCached = undefined
            this.location.clearCache()
        }))

        this._scrollAmount = 0
        this._lastScrolled = 0
        this._scrollbarHoldY = undefined
        this._tempScrollbarWidth = new SoopyNumber(0)

        this.events.push(new SoopyMouseScrollEvent().setHandler((mouseX, mouseY, scroll) => {
            if (this.scrollable && this.hovered) {
                this._scrollAmount += scroll * 30
                let maxScroll = 0
                for (let child of this.children) {
                    if (maxScroll < (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()) {
                        maxScroll = (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()
                    }
                }
                maxScroll -= this.location.getHeightExact() - 2
                this._scrollAmount = Math.min(Math.max(-maxScroll, this._scrollAmount), 0)
                this.location.scroll.y.set(this._scrollAmount, 100)
                this._lastScrolled = Date.now()
            }
        }))

        this.events.push(new SoopyMouseClickEvent().setHandler((mouseX, mouseY, button) => {

            if (mouseX <= this.location.getXExact() + this.location.getWidthExact() - 8 || mouseX >= this.location.getXExact() + this.location.getWidthExact() || mouseY <= this.location.getYExact() || mouseY >= this.location.getYExact() + this.location.getHeightExact()) return

            let maxScroll = 0
            for (let child of this.children) {
                if (maxScroll < (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()) {
                    maxScroll = (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()
                }
            }
            if (maxScroll < this.location.getHeightExact()) return
            let scrollBarHeight = this.location.getHeightExact() / maxScroll * this.location.getHeightExact()

            let scrollBarY = -this.location.scroll.getYAsExact(undefined, false) / (maxScroll) * this.location.getHeightExact()

            if (mouseY >= this.location.getYExact() + scrollBarY && mouseY <= this.location.getYExact() + scrollBarY + scrollBarHeight) {
                this._scrollbarHoldY = mouseY - (this.location.getYExact() + scrollBarY) + 1
            }
        }))

        this.events.push(new SoopyMouseReleaseEvent().setHandler((mouseX, mouseY, button) => {
            if (this._scrollbarHoldY) {
                let maxScroll = 0
                for (let child of this.children) {
                    if (maxScroll < (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()) {
                        maxScroll = (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()
                    }
                }
                if (maxScroll < this.location.getHeightExact()) return

                this._scrollAmount = Math.min(Math.max(-(maxScroll - (this.location.getHeightExact() - 2)), (-(mouseY - this.location.getYExact() - (this._scrollbarHoldY - 1))) * maxScroll / this.location.getHeightExact()), 0)
                this.location.scroll.y.set(this._scrollAmount, 0)

                this._scrollbarHoldY = undefined
            }
        }))

        this.events.push(new SoopyRenderEvent().setHandler((mouseX, mouseY) => {
            //rendering scrollbar stuff
            if (this.scrollable && (this._tempScrollbarWidth.isAnimating() || Date.now() - this._lastScrolled < 3000 || (mouseX > this.location.getXExact() + this.location.getWidthExact() - 32 && mouseX < this.location.getXExact() + this.location.getWidthExact() && mouseY > this.location.getYExact() && mouseY < this.location.getYExact() + this.location.getHeightExact()))) {
                let maxScroll = 0
                for (let child of this.children) {
                    if (maxScroll < (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()) {
                        maxScroll = (child.location.getYExact() + child.location.getHeightExact() - this.location.scroll.getYAsExact(undefined, false)) - this.location.getYExact()
                    }
                }
                if (maxScroll < this.location.getHeightExact()) return
                let scrollBarHeight = this.location.getHeightExact() / maxScroll * this.location.getHeightExact()

                if (this._scrollbarHoldY) {
                    this._scrollAmount = Math.min(Math.max(-(maxScroll - (this.location.getHeightExact() - 2)), (-(mouseY - this.location.getYExact() - (this._scrollbarHoldY - 1))) * maxScroll / this.location.getHeightExact()), 0)
                    this.location.scroll.y.set(this._scrollAmount, 0)
                }

                let scrollBarY = -this.location.scroll.getYAsExact(undefined, false) / (maxScroll) * this.location.getHeightExact()
                let mouseHover = (mouseX > this.location.getXExact() + this.location.getWidthExact() - 32 && mouseX < this.location.getXExact() + this.location.getWidthExact() && mouseY > this.location.getYExact() && mouseY < this.location.getYExact() + this.location.getHeightExact())
                if (mouseHover || this._scrollbarHoldY) {
                    this._tempScrollbarWidth.set(8, 200)
                } else {
                    if (Date.now() - this._lastScrolled < 3000) {
                        this._tempScrollbarWidth.set(4, 200)
                    }
                }
                Renderer.translate(0, 0, 10)
                Renderer.drawRect(this.isDarkThemeEnabled() ? Renderer.color(200, 200, 200) : Renderer.color(0, 0, 0), this.location.getXExact() + this.location.getWidthExact() - this._tempScrollbarWidth.get(), this.location.getYExact() + scrollBarY, this._tempScrollbarWidth.get(), scrollBarHeight)
            } else {
                this._tempScrollbarWidth.set(0, 200)
            }
        }))

        let renderEvent = new SoopyRenderUpdateEvent()

        renderEvent.setHandler((mouseX, mouseY) => {
            if ((!this.parent || this.parent.hovered) && mouseX > this.location.getXExact() && mouseX < this.location.getXExact() + this.location.getWidthExact()
                && mouseY > this.location.getYExact() && mouseY < this.location.getYExact() + this.location.getHeightExact()) {
                this.main._hoveredElement = this

                if (this.lore) {
                    //Render Lore

                    this.main._loreData = [mouseX, mouseY, this.lore]
                }
            }
        })

        this.events.push(renderEvent)
    }

    /**
     * Wether dark theme is enabled
     * @return {Boolean} Wether dark theme is enabled
     */
    isDarkThemeEnabled() {
        return this.main.isDarkThemeEnabled()
    }

    setMain(main) {
        this.main = main
        for (let child of this.children) {
            child.setMain(this.main)
        }
        return this;
    }

    /**
     * Triggers an event
     * @param {Enum.EVENT} eventType The type of the event
     * @param {Array.<Any>} data The data for the event
     */
    triggerEvent(eventType, data = [], triggerChildren = true) {
        if (!this.visable && eventType === Enum.EVENT.RENDER) return;
        if (!this.visable && eventType === Enum.EVENT.RENDER_UPDATE) return;

        let usingFrameBuffer = false
        if (eventType === Enum.EVENT.RENDER && this.shouldUpdateFrameBuffer()) {
            usingFrameBuffer = true

            // GlStateManager.func_179109_b(-this.location.getXExact(), -this.location.getYExact(), 0)

            // GlStateManager.func_179152_a(Renderer.screen.getWidth()/this.location.getWidthExact(), Renderer.screen.getHeight()/this.location.getHeightExact(), 1)

            if (!this._framebuffer) {
                // this._framebuffer = new Framebuffer(this.location.getWidthExact()*Renderer.screen.getScale(), this.location.getHeightExact()*Renderer.screen.getScale(), false)
                this._framebuffer = new Framebuffer(Renderer.screen.getWidth() * 2, Renderer.screen.getHeight() * 2, false)
            }

            // if(this._framebuffer.field_147621_c !== this.location.getWidthExact()*Renderer.screen.getScale() || this._framebuffer.field_147618_d !== this.location.getHeightExact()*Renderer.screen.getScale()) this._framebuffer.func_147613_a(this.location.getWidthExact()*Renderer.screen.getScale(), this.location.getHeightExact()*Renderer.screen.getScale())

            this._framebuffer.func_147614_f()//clear framebuffer
            this._framebuffer.func_147610_a(true)//bind framebuffer


            // GlStateManager.func_179128_n(GL11.GL_PROJECTION); //matrixMode
            // GlStateManager.func_179096_D(); //loadIdentity
            // GlStateManager.func_179130_a(0.0, this.location.getWidthExact(), this.location.getHeightExact(), 0.0, 1000.0, 3000.0); //ortho
            // GlStateManager.func_179128_n(GL11.GL_MODELVIEW); //matrixMode

            GlStateManager.func_179094_E()

            // renderLibs.sizzorOverride = {
            //     disabled: true
            // }

            // Renderer.translate(-this.location.getXExact()*Renderer.screen.getScale(),
            //  (Renderer.screen.getHeight()-this.location.getYExact()-this.location.getHeightExact())*Renderer.screen.getScale(), 0)
        }

        if ((eventType !== Enum.EVENT.RENDER || usingFrameBuffer || !this.shouldUseFrameBuffer() || !this._framebuffer)) {
            let shouldTrigger = undefined
            for (let event of this.events) {
                if (event.eventType === eventType) {
                    if (shouldTrigger === undefined) shouldTrigger = event._shouldTrigger(this, data)
                    if (shouldTrigger) event._trigger(this, data)
                }
            }

            if (shouldTrigger === undefined) shouldTrigger = true
            if (shouldTrigger && triggerChildren) {
                for (let child of this.children) {
                    child.triggerEvent(eventType, data)
                }
            }
        }

        if (usingFrameBuffer) {
            // GlStateManager.func_179109_b(-this.location.getXExact(), -this.location.getYExact(), 0); //translate
            // this._framebuffer.func_147609_e()

            // GlStateManager.func_179128_n(GL11.GL_PROJECTION);
            // GlStateManager.func_179096_D();
            // GlStateManager.func_179130_a(0.0, Renderer.screen.getWidth()*Renderer.screen.getScale(), Renderer.screen.getHeight()*Renderer.screen.getScale(),
            //         0.0, 1000.0, 3000.0);
            // GlStateManager.func_179128_n(GL11.GL_MODELVIEW);

            // GlStateManager.func_179121_F()
            GlStateManager.func_179121_F()
            Client.getMinecraft().func_147110_a().func_147610_a(true);

            if (typeof this.frameBufferDirty === "number") {
                if (Date.now() > this.frameBufferDirty) {
                    this.frameBufferDirty = false
                }
            } else {
                this.frameBufferDirty = false
            }
        }

        if (eventType === Enum.EVENT.RENDER && this.shouldUseFrameBuffer() && this._framebuffer) {
            // GlStateManager.func_179147_l();//enableBlend
            // GlStateManager.func_179120_a(GL11.GL_ONE, GL11.GL_ONE_MINUS_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ONE_MINUS_SRC_ALPHA); //tryBlendFuncSeparate
            // GlStateManager.func_179131_c(1, 1, 1, 1); // color 

            // this._framebuffer.func_147612_c()
            // renderLibs.stopScizzor()

            // drawFrameBuffer(this._framebuffer, this.location.getXExact(), this.location.getYExact(), this.location.getWidthExact(), this.location.getHeightExact())
            drawFrameBuffer(this._framebuffer, 0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight())
        }
    }

    shouldUpdateFrameBuffer() {
        // for(let child of this.children){
        //     if(child.shouldUpdateFrameBuffer()) return false
        // }
        return this.shouldUseFrameBuffer() && (!this._framebuffer || (this.frameBufferDirty === true || (
            typeof this.frameBufferDirty === "number" && Date.now() > this.frameBufferDirty
        )))
    }

    shouldUseFrameBuffer() {
        return this.framebufferEnabledOnElement
    }

    enableFrameBuffer() {
        this.framebufferEnabledOnElement = OpenGlHelper.func_148822_b() // OpenGlHelper.isFramebufferEnabled()
        return this
    }

    dirtyFrameBuffer(time) {
        if (time) this.frameBufferDirty = Date.now() + time
        else this.frameBufferDirty = true
        return this
    }

    disableFrameBuffer() {
        this.framebufferEnabledOnElement = false
        return this
    }

    /**
     * Gets the visable bounding box of the SoopyGuiElement
     * @returns {Array<Number>} array of x, y, x2, y2 if visable
     * @returns {Boolean} false if not visable
     */
    getBoundingBox() {
        if (this.boundingBoxCached) {
            if (this.boundingBoxCached === "false") return false
            return this.boundingBoxCached
        }
        let outsideRect = { x1: 0, y1: 0, x2: Renderer.screen.getWidth(), y2: Renderer.screen.getHeight() }
        if (this.parent) {
            outsideRect = this.parent.getBoundingBox()
            if (outsideRect) {
                outsideRect = { x1: outsideRect[0], y1: outsideRect[1], x2: outsideRect[2], y2: outsideRect[3] }
            } else {
                this.boundingBoxCached = "false"
                return false
            }
        }

        let thisRect = { x1: this.location.getXExact(), y2: this.location.getYExact(), x2: this.location.getXExact() + this.location.getWidthExact(), y1: this.location.getYExact() + this.location.getHeightExact() }

        let res = renderLibs.getIntersectingRectangle(outsideRect, thisRect)

        if (res) {
            this.boundingBoxCached = [res.x1, res.y1, res.x2, res.y2]
            return [res.x1, res.y1, res.x2, res.y2]
        } else {
            this.boundingBoxCached = "false"
            return false
        }
    }

    /**
     * Used to add a child element to this
     * @param {SoopyGuiElement} child The child to add
     * @returns {SoopyGuiElement} This for method chaining
     */
    addChild(child) {

        if (child.parent) {
            child.parent.removeChild(child)
        }

        let theParent = this.innerObjectPaddingThing || this
        child.setParent(theParent).setMain(this.main)
        theParent.children.push(child)
        return this
    }

    /**
     * Sets the lore of the element
     * @param {Array<String>} lore The lore to render
     * @returns {SoopyGuiElement} This for method chaining
     */
    setLore(lore) {
        if (typeof lore !== "object") return this
        this.lore = Object.values(lore)
        return this
    }

    /**
     * Used to add a child element to this
     * @param {SoopyGuiElement} child The child to add
     * @returns {SoopyGuiElement} This for method chaining
     */
    removeChild(child) {
        let theParent = this.innerObjectPaddingThing || this
        child.setParent(undefined)
        theParent.children = theParent.children.filter(c => c.parent)
        return this
    }
    /**
     * Clears all the children of this element
     */
    clearChildren() {
        let theParent = this.innerObjectPaddingThing || this
        theParent.children.forEach(child => {
            if (!child) return
            child.setParent(undefined)
        });
        theParent.children = []
        return this
    }
    /**
     * Used to add an event
     * @param {SoopyEventListener} event The event to add
     * @returns {SoopyGuiElement} This for method chaining
     */
    addEvent(event) {
        this.events.push(event)
        return this
    }

    /**
     * Set the parent element
     * @param {SoopyGuiElement} parent the parent
     */
    setParent(parent) {
        this.parent = parent
        if (parent) this.location.referanceFrame = parent.location
        return this;
    }

    /**
     * Set wether is it possible to scroll
     * @param {Boolean} possible
     * @returns {SoopyGuiElement} This for method chaining
     */
    setScrollable(possible) {
        this.scrollable = possible
        return this;
    }

    /**
     * Shortcut to set the location
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {SoopyGuiElement} This for method chaining
     */
    setLocation(x, y, width, height) {
        this.location.location.x.set(x)
        this.location.location.y.set(y)
        this.location.size.x.set(width)
        this.location.size.y.set(height)
        return this
    }

    setInnerObject(o) {
        this.innerObjectPaddingThing = o
    }
}

export default SoopyGuiElement

function drawTexturedRect(x, y, width, height, uMin, uMax, vMin, vMax, filter) {
    GlStateManager.func_179098_w(); // enableTexture2D

    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, filter);
    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, filter);

    WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181707_g); //begin,  POSITION_TEX
    WorldRenderer
        .func_181662_b(x, y + height, 0)
        .func_181673_a(uMin, vMax).func_181675_d();
    WorldRenderer
        .func_181662_b(x + width, y + height, 0)
        .func_181673_a(uMax, vMax).func_181675_d();
    WorldRenderer
        .func_181662_b(x + width, y, 0)
        .func_181673_a(uMax, vMin).func_181675_d();
    WorldRenderer
        .func_181662_b(x, y, 0)
        .func_181673_a(uMin, vMin).func_181675_d();

    MCTessellator.func_78381_a(); //draw

    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_NEAREST);
    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_NEAREST);
}
function drawFrameBuffer(framebuffer, x, y, w, h) {
    GlStateManager.func_179147_l(); //enableBlend
    GlStateManager.func_179120_a(GL11.GL_ONE, GL11.GL_ONE_MINUS_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ONE_MINUS_SRC_ALPHA); //tryBlendFuncSeparate
    GlStateManager.func_179131_c(1, 1, 1, 1); //color
    framebuffer.func_147612_c(); //bindFramebufferTexture
    // Renderer.drawRect(Renderer.color(255,0,0,100), x, y, w, h)
    drawTexturedRect(x, y, w, h, 0, 1, 1, 0, GL11.GL_NEAREST);
    GlStateManager.func_179120_a(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA, 1, 0); //tryBlendFuncSeparate
}

// function drawFrameBuffer(framebuffer, x, y, w, h){
//     GlStateManager.func_179135_a(true, true, true, false); //colormask
//     GlStateManager.func_179097_i(); //disableDepth
//     GlStateManager.func_179132_a(false); //depthMask
//     GlStateManager.func_179128_n(5889); //matrixMode
//     GlStateManager.func_179096_D(); //loadIdentity
//     // GlStateManager.func_179130_a(0.0, Renderer.screen.getWidth(), Renderer.screen.getHeight(), 0.0, 1000.0, 3000.0); //ortho
//     GlStateManager.func_179128_n(5888); //matrixMode
//     GlStateManager.func_179096_D(); //loadIdentity
//     // GlStateManager.func_179109_b(0.0, 0.0, -2000.0); //translate
//     // GlStateManager.func_179083_b(0, 0, Renderer.screen.getWidth(), Renderer.screen.getHeight()); //viewport
//     GlStateManager.func_179098_w(); //enableTexture2D
//     GlStateManager.func_179140_f(); //disableLighting
//     GlStateManager.func_179118_c(); //disableAlpha

//     // if (p_178038_3_)
//     // {
//     //     GlStateManager.disableBlend();
//     //     GlStateManager.enableColorMaterial();
//     // }

//     GlStateManager.func_179131_c(1.0, 1.0, 1.0, 1.0); //color
//     framebuffer.func_147612_c(); //bindFramebufferTexture
//     let f2 = framebuffer.field_147621_c / framebuffer.field_147622_a; //framebuffer.framebufferWidth / framebuffer.framebufferTextureWidth;
//     let f3 = framebuffer.field_147618_d / framebuffer.field_147620_b; //framebuffer.framebufferHeight / framebuffer.framebufferTextureHeight;
//     WorldRenderer.func_181668_a(7, DefaultVertexFormats.field_181709_i); //begin //POSITION_TEX_COLOR
//     WorldRenderer.func_181662_b(0.0, h, 0.0).func_181673_a(0.0, 0.0).func_181669_b(255, 255, 255, 255).func_181675_d();
//     WorldRenderer.func_181662_b(w, h, 0.0).func_181673_a(f2, 0.0).func_181669_b(255, 255, 255, 255).func_181675_d();
//     WorldRenderer.func_181662_b(w, 0.0, 0.0).func_181673_a(f2, f3).func_181669_b(255, 255, 255, 255).func_181675_d();
//     WorldRenderer.func_181662_b(0.0, 0.0, 0.0).func_181673_a(0.0, f3).func_181669_b(255, 255, 255, 255).func_181675_d();
//     MCTessellator.func_78381_a(); //draw
//     framebuffer.func_147606_d(); //unbindFramebufferTexture
//     GlStateManager.func_179132_a(true); //depthMask
//     GlStateManager.func_179135_a(true, true, true, true); //colorMask
// }