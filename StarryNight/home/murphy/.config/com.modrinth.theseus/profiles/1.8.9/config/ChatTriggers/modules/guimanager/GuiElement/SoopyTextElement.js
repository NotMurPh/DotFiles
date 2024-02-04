/// <reference types="../../CTAutocomplete" />
/// <reference lib="es2015" />

import SoopyRenderEvent from "../EventListener/SoopyRenderEvent"
import SoopyGuiElement from "./SoopyGuiElement"
import RenderLib from "../renderLibs"
import SoopyNumber from "../Classes/SoopyNumber"
import renderLibs from "../renderLibs";
if (!GlStateManager) {
    var GL11 = Java.type("org.lwjgl.opengl.GL11"); //using var so it goes to global scope
    var GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
}


let Framebuffer = Java.type("net.minecraft.client.shader.Framebuffer")
const DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats")
let Tessellator = Java.type("net.minecraft.client.renderer.Tessellator").func_178181_a()
let WorldRenderer = Tessellator.func_178180_c()
const OpenGlHelper = Java.type("net.minecraft.client.renderer.OpenGlHelper")
const EXTFramebufferObject = Java.type("org.lwjgl.opengl.EXTFramebufferObject")

/**
 * text.
 * @class
 */
class SoopyTextElement extends SoopyGuiElement {
    /**
     * Creates a {@link SoopyTextElement}
     * @constructor
     */
    constructor() {

        super()

        /**
         * The text to display.
         * @type {string}
         */
        this.text = ""

        this.textDarkThemeCache = ""

        this.image = undefined
        this.imageDirty = undefined
        this.imagew = 0
        this.imageh = 0
        this.useImageCacheThing = false//OpenGlHelper.func_148822_b() // OpenGlHelper.isFramebufferEnabled()

        this.lastWidth = 0
        this.lastHeight = 0

        this.centeredX = true
        this.centeredY = true
        this.maxScale = new SoopyNumber(1)

        let renderEvent = new SoopyRenderEvent()

        renderEvent.setHandler((mouseX, mouseY, partialTicks) => {
            if (this.location.getWidthExact() !== this.lastWidth || this.location.getHeightExact() !== this.lastHeight) {
                this.imageDirty = true

                this.lastWidth = this.location.getWidthExact()
                this.lastHeight = this.location.getHeightExact()
            }

            if (this.image === undefined || !this.useImageCacheThing || this.imageDirty) {

                let textLines = this.isDarkThemeEnabled() ? this.textDarkThemeCache.split("\n") : this.text.split("\n")
                let maxWidth = 0
                for (let line of textLines) {
                    let lineWidth = Renderer.getStringWidth(ChatLib.addColor(line))
                    if (lineWidth > maxWidth) maxWidth = lineWidth
                }

                let scale = Math.min(this.maxScale.get(), this.location.getWidthExact() / (maxWidth), this.location.getHeightExact() / (10 * textLines.length))

                let renderY = this.useImageCacheThing ? 0 : this.location.getYExact()

                if (this.centeredY) {
                    renderY += this.location.getHeightExact() / 2 - 5 * (textLines.length - 1) * scale
                    renderY -= 9 * scale / 2
                }
                let scizzor
                if (this.useImageCacheThing) {
                    scizzor = renderLibs.scizzoring ? renderLibs.getCurrScizzor() : undefined
                    renderLibs.stopScizzor()

                    this.imagew = maxWidth * scale * Renderer.screen.getScale()
                    this.imageh = (textLines.length) * 10 * scale * Renderer.screen.getScale()
                    // console.log(this.text, this.imagew, this.imageh)
                    if (!this.image) this.image = new Framebuffer(this.imagew, this.imageh, false)
                    if (this.image.field_147621_c !== this.imagew || this.image.field_147618_d !== this.imageh) this.image.func_147613_a(this.imagew, this.imageh)
                    this.image.func_147610_a(true) //bindFramebuffer


                    GlStateManager.func_179128_n(GL11.GL_PROJECTION);//matrixMode
                    GlStateManager.func_179096_D();//loadIdentity
                    GlStateManager.func_179130_a(0, this.imagew, this.imageh, 0, 1000, 3000);//ortho
                    GlStateManager.func_179128_n(GL11.GL_MODELVIEW);//matrixMode
                }

                for (let index in textLines) {
                    let line = textLines[index]
                    let renderX = this.useImageCacheThing ? 0 : this.location.getXExact()
                    if (this.centeredX) {
                        renderX += (this.location.getWidthExact() / 2) - ((Renderer.getStringWidth(ChatLib.addColor(line)))) * scale / 2
                    }
                    RenderLib.drawString(line, renderX, renderY + index * 10 * scale, scale)
                }

                if (this.useImageCacheThing) {
                    this.image.func_147609_e()//unbindFramebuffer
                    //     GL30.glBindFramebuffer(GL30.GL_FRAMEBUFFER, 0);
                    if (scizzor) renderLibs.scizzorFast(...scizzor)
                    Client.getMinecraft().func_147110_a().func_147610_a(true); //Client.getMinecraft().getFramebuffer().bindFramebuffer();

                    GlStateManager.func_179128_n(GL11.GL_PROJECTION);//matrixMode
                    GlStateManager.func_179096_D();//loadIdentity
                    GlStateManager.func_179130_a(0, Renderer.screen.getWidth(), Renderer.screen.getHeight(), 0, 1000, 3000);//ortho
                    GlStateManager.func_179128_n(GL11.GL_MODELVIEW);//matrixMode
                }
                this.imageDirty = false
            }

            if (this.useImageCacheThing) {
                GlStateManager.func_179147_l();//enableBlend
                GlStateManager.func_179120_a(GL11.GL_ONE, GL11.GL_ONE_MINUS_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ONE_MINUS_SRC_ALPHA); //tryBlendFuncSeparate
                GlStateManager.func_179131_c(1, 1, 1, 1); // color 

                this.image.func_147612_c()//bindFramebufferTexture

                drawTexturedRect(Math.round(this.location.getXExact()), Math.round(this.location.getYExact()), this.imagew, this.imageh, 0, 1, 1, 0, GL11.GL_NEAREST)
                // drawTexturedRect(0,0, Renderer.screen.getWidth(), Renderer.screen.getHeight(), 0, 1, 1, 0, GL11.GL_LINEAR)
                // drawTexturedRect(Math.round(this.location.getXExact()), Math.round(this.location.getYExact()),Renderer.screen.getWidth(), Renderer.screen.getHeight(), 0, 1, 1, 0, GL11.GL_NEAREST)

                GlStateManager.func_179120_a(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA, 1, 0);//tryBlendFuncSeparate

                // Renderer.drawRect(Renderer.color(255, 0, 0, 50), this.location.getXExact(), this.location.getYExact(), this.location.getXExact()+this.imagew/Renderer.screen.getScale(), this.location.getYExact()+this.imageh/Renderer.screen.getScale())
            }
        })

        this.events.push(renderEvent)
    }

    /**
     * Set the text
     * @param {string} text - The text to display.
     * @returns {SoopyTextElement} this for method chaining
     */
    setText(text) {
        if (text !== this.text) {
            this.text = text
            this.textDarkThemeCache = RenderLib.darkThemifyText(text)

            this.imageDirty = true
        }
        return this
    }

    /**
     * set the max text scale
     * @param {number} maxScale - The max scale to use.
     * @returns {SoopyTextElement} this for method chaining
     */
    setMaxTextScale(maxScale, animationTime) {
        this.maxScale.set(maxScale, animationTime)
        return this
    }

}

export default SoopyTextElement

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

    Tessellator.func_78381_a(); //draw

    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MIN_FILTER, GL11.GL_NEAREST);
    GL11.glTexParameteri(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_MAG_FILTER, GL11.GL_NEAREST);
}