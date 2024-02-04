/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

if (!GlStateManager) {
    var GL11 = Java.type("org.lwjgl.opengl.GL11"); //using var so it goes to global scope
    var GlStateManager = Java.type("net.minecraft.client.renderer.GlStateManager");
}

const DefaultVertexFormats = Java.type("net.minecraft.client.renderer.vertex.DefaultVertexFormats")

let imageRegex = /!\[.*?\]\((.*?)\)/g
let urlRegex = /\[(.*?)\]\(.*?\)/g
let basicUrlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm

let imagesCache = {}

let Tessellator = Java.type("net.minecraft.client.renderer.Tessellator").func_178181_a()
let WorldRenderer = Tessellator.func_178180_c()

function getImageFromCache(url, waitForLoad = false, noDownload) {
    let urlId = url.replace(/[^A-z0-9]/g, "")

    if (noDownload) return imagesCache[url]

    if (imagesCache[url] === undefined) {
        imagesCache[url] = "LOADING"
        if (!waitForLoad) {
            new Thread(() => {
                try {
                    imagesCache[url] = new Image(getBufferedImage(url))
                } catch (e) {
                    imagesCache[url] = new Image(getBufferedImage(url.replace("https://", "http://")))
                }
            }).start()
            return undefined
        } else {
            try {
                imagesCache[url] = new Image(getBufferedImage(url))
            } catch (e) {
                imagesCache[url] = new Image(getBufferedImage(url.replace("https://", "http://")))
            }
            return imagesCache[url]
        }
    }
    if (imagesCache[url] === "LOADING") {
        return undefined
    }
    return imagesCache[url]
}

let URL = Java.type("java.net.URL")
let ImageIO = Java.type("javax.imageio.ImageIO")
function getBufferedImage(url) { //bypassess chattriggers image cache
    return ImageIO.read(new URL(url).openConnection().inputStream)
}

/**
 * A bunch of random functions to draw stuff
 * @class RenderLibs
 */
class RenderLibs {
    /**
     * @constructor
     */
    constructor() {
        this.lastSizzorX = 0
        this.lastSizzorY = 0
        this.lastSizzorW = 0
        this.lastSizzorH = 0
        this.scizzoring = false
        this.sizzorOverride = {
            disabled: false
        }
    }

    /**
     * Loads an image, will download it if needed
     * @param {String} url 
     * @returns {Image} the image
     */
    getImage(url, waitForLoad = false) {
        return getImageFromCache(url, waitForLoad)
    }

    /**
     * Loads an image, will NOT download it if needed
     * @param {String} url 
     * @returns {Image} the image
     */
    getImageNoDownload(url) {
        return getImageFromCache(url, false, true)
    }

    /**
     * Draws a string at a location with a scale (rendering from top left)
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     */
    drawString = function (text, x, y, scale) {
        Renderer.scale(scale, scale)
        Renderer.drawString(text || "undefined", x / scale, y / scale)
    }

    /**
     * Draws a string at a location with a scale (rendering from top left)
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     */
    drawStringShadow = function (text, x, y, scale) {
        Renderer.scale(scale, scale)
        Renderer.drawStringWithShadow(text || "undefined", x / scale, y / scale)
    }
    /**
     * Draws a string at a location with a scale (rendering from top middle)
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     */
    drawStringCentered = function (text, x, y, scale) {
        this.drawString(text, x - ((Renderer.getStringWidth(ChatLib.removeFormatting(text)) / 2) * scale), y, scale)
    }
    /**
     * Draws a string at a location with a scale (rendering from top middle)
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     */
    drawStringCenteredShadow = function (text, x, y, scale) {
        this.drawStringShadow(text, x - ((Renderer.getStringWidth(ChatLib.removeFormatting(text)) / 2) * scale), y, scale)
    }
    /**
     * Draws a string at a location with a scale (rendering from middle left)
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     */
    drawStringCenteredVertically = function (text, x, y, scale) {
        this.drawString(text, x, y - ((8 * scale) / 2), scale)
    }
    /**
     * Draws a string at a location with a scale (rendering from middle middle)
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     */
    drawStringCenteredFull = function (text, x, y, scale) {
        this.drawStringCentered(text, x, y - ((8 * scale) / 2), scale)
    }
    /**
     * Draws a string at a location with a scale that will get smaller if the string goes over the max width (rendering from top left)
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     * @param {Number} maxWidth The maximum width of the string 
     */
    drawStringResiseWidth = function (text, x, y, scale, maxWidth) {
        let scale2 = Math.max(1, Renderer.getStringWidth(ChatLib.removeFormatting(text)) / (maxWidth / scale))
        this.drawString(text, x, y, scale / scale2)
    }
    /**
     * Draws a string at a location with a scale that will get smaller if the string goes over the max width (rendering from top left)
     * But if it shrinks the text it will move it down to be at the bottom of the 'box' where it usually renders
     * @param {String} text The string to draw
     * @param {Number} x The x location of the string
     * @param {Number} y The y location of the string
     * @param {Number} scale The scale of the string (1 = default, 2=double, ect) 
     * @param {Number} maxWidth The maximum width of the string 
     */
    drawStringResiseWidthBottom = function (text, x, y, scale, maxWidth) {
        let scale2 = Math.max(1, Renderer.getStringWidth(ChatLib.removeFormatting(text)) / (maxWidth / scale))
        let yoff = 0

        yoff = ((8 / (scale2) - 8) * -1 * scale) / 2

        this.drawString(text, x, y + yoff, scale / scale2)
    }
    /**
     * Returns the current scizzor location
     * @return {[Number, Number, Number, Number]} the current scizzor location [x,y,w,h]
     */
    getCurrScizzor = function () {
        return [this.lastSizzorX, this.lastSizzorY, this.lastSizzorW, this.lastSizzorH]
    }
    /**
     * Sets the current scizzor location
     * @param {Number} x The left location of the scizzor
     * @param {Number} y The top location of the scizzor 
     * @param {Number} width The width of the scizzor
     * @param {Number} height The height of the scizzor
     */
    scizzorFast = function (x, y, width, height) {
        if (this.sizzorOverride.disabled) return
        this.lastSizzorX = x
        this.lastSizzorY = y
        this.lastSizzorW = width
        this.lastSizzorH = height
        let guiScale = Renderer.screen.getScale()
        let screenHeight = Renderer.screen.getHeight()
        GL11.glEnable(GL11.GL_SCISSOR_TEST);
        try {
            GL11.glScissor(x * guiScale, screenHeight * guiScale - (y * guiScale) - (height * guiScale), width * guiScale, height * guiScale)
        } catch (e) {
            this.lastSizzorW = 0
            this.lastSizzorH = 0
            GL11.glScissor(0, 0, 0, 0)
            GL11.glDisable(GL11.GL_SCISSOR_TEST);
            return;
        }
        this.scizzoring = true
    }
    /**
     * Sets the current scizzor location
     * This will stack with a rectangle intersection, call RenderLibs.stopScizzor() to clear the location
     * @param {Number} x The left location of the scizzor
     * @param {Number} y The top location of the scizzor 
     * @param {Number} width The width of the scizzor
     * @param {Number} height The height of the scizzor
     */
    scizzor = function (x, y, width, height) {
        if (this.sizzorOverride.disabled) return
        if (this.scizzoring) {
            if (this.lastSizzorW === 0 || this.lastSizzorH === 0) return;
            let intersect = global.soopyRenderLibsThingo.getIntersectingRectangle({ x1: this.lastSizzorX, y1: this.lastSizzorY, x2: this.lastSizzorX + this.lastSizzorW, y2: this.lastSizzorY + this.lastSizzorH }, { x1: x, y1: y, x2: x + width, y2: y + height })
            if (intersect === false) {
                this.lastSizzorW = 0
                this.lastSizzorH = 0
                GL11.glScissor(0, 0, 0, 0)
                GL11.glDisable(GL11.GL_SCISSOR_TEST);
                return;
            } else {
                x = intersect.x1
                y = intersect.y1
                width = Math.min(width, this.lastSizzorW, intersect.x2 - intersect.x1)
                height = Math.min(height, this.lastSizzorH, intersect.y2 - intersect.y1)
            }
        }
        this.lastSizzorX = x
        this.lastSizzorY = y
        this.lastSizzorW = width
        this.lastSizzorH = height
        let guiScale = Renderer.screen.getScale()
        let screenHeight = Renderer.screen.getHeight()
        GL11.glEnable(GL11.GL_SCISSOR_TEST);
        try {
            GL11.glScissor(x * guiScale, screenHeight * guiScale - (y * guiScale) - (height * guiScale), width * guiScale, height * guiScale)
        } catch (e) {
            this.lastSizzorW = 0
            this.lastSizzorH = 0
            GL11.glScissor(0, 0, 0, 0)
            GL11.glDisable(GL11.GL_SCISSOR_TEST);
            return;
        }
        this.scizzoring = true
    }
    /**
     * Clears the current scizzor
     */
    stopScizzor = function () {
        GL11.glDisable(GL11.GL_SCISSOR_TEST);
        this.scizzoring = false
    }

    /**
     * Draws a rectangle on the screen with a border of slightly offset colors
     * @param {Array<Number>} color The colors in the format [r,g,b]
     * @param {Number} x The x coordinate of the box
     * @param {Number} y The y coordinate of the box
     * @param {Number} w The width of the box
     * @param {Number} h The height of the box
     * @param {Number} borderWidth The width of the border
     */
    drawBox = function (color, x, y, w, h, borderWidth) {
        let colorR = color[0]
        let colorG = color[1]
        let colorB = color[2]

        GlStateManager.func_179147_l()//GlStateManager.enableBlend()
        GlStateManager.func_179090_x()//GlStateManager.disableTexture2D()
        GlStateManager.func_179120_a(770, 771, 1, 0)//GlStateManager.tryBlendFuncSeparate(770, 771, 1, 0)

        //START DRAWING CENTERAL RECTANGLE
        GlStateManager.func_179124_c(colorR / 255, colorG / 255, colorB / 255) //GlStateManager.color(r, g, b)

        WorldRenderer.func_181668_a(GL11.GL_TRIANGLE_FAN, DefaultVertexFormats.field_181705_e/*POSITION*/) //WorldRenderer.begin()

        WorldRenderer.func_181662_b(x + borderWidth, y + h - borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + w - borderWidth, y + h - borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + w - borderWidth, y + borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + borderWidth, y + borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()

        Tessellator.func_78381_a()
        //END DRAWING CENTERAL RECTANGLE

        //START DRAWING TOP+LEFT RECTANGLE
        GlStateManager.func_179124_c((colorR - 20) / 255, (colorG - 20) / 255, (colorB - 20) / 255) //GlStateManager.color(r, g, b)

        WorldRenderer.func_181668_a(GL11.GL_TRIANGLE_FAN, DefaultVertexFormats.field_181705_e/*POSITION*/) //WorldRenderer.begin()

        WorldRenderer.func_181662_b(x + borderWidth, y + borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + w - borderWidth, y + borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + w - borderWidth, y, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x, y, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x, y + h - borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + borderWidth, y + h - borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()

        Tessellator.func_78381_a()
        //END DRAWING TOP+LEFT RECTANGLE

        //START DRAWING BOTTOM+RIGHT RECTANGLE
        GlStateManager.func_179124_c((colorR - 60) / 255, (colorG - 60) / 255, (colorB - 60) / 255) //GlStateManager.color(r, g, b)

        WorldRenderer.func_181668_a(GL11.GL_TRIANGLE_FAN, DefaultVertexFormats.field_181705_e/*POSITION*/) //WorldRenderer.begin()

        WorldRenderer.func_181662_b(x + w, y + h, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + w, y, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + w - borderWidth, y, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x + w - borderWidth, y + h - borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x, y + h - borderWidth, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()
        WorldRenderer.func_181662_b(x, y + h, 0).func_181675_d()//WorldRenderer.pos(x, y, z).endVertex()

        Tessellator.func_78381_a()
        //END DRAWING BOTTOM+RIGHT RECTANGLE

        GlStateManager.func_179124_c(1, 1, 1) //GlStateManager.color(r, g, b)
        GlStateManager.func_179098_w()//GlStateManager.enableTexture2D()
        GlStateManager.func_179084_k()//GlStateManager.disableBlend()

        /* OLD RENDER CODE
        Renderer.drawRect(Renderer.color(colorR, colorG, colorB),x+borderWidth,y+borderWidth,w-borderWidth*2,h-borderWidth*2)

        Renderer.drawRect(Renderer.color(colorR-20*(color[3]?-1:1), colorG-20*(color[3]?-1:1), colorB-20*(color[3]?-1:1)),x,y,borderWidth,h)
        Renderer.drawRect(Renderer.color(colorR-20*(color[3]?-1:1), colorG-20*(color[3]?-1:1), colorB-20*(color[3]?-1:1)),x,y,w,borderWidth)

        Renderer.drawRect(Renderer.color(colorR-60*(color[3]?-1:1), colorG-60*(color[3]?-1:1), colorB-60*(color[3]?-1:1)),x+w-borderWidth,y,borderWidth,h)
        Renderer.drawRect(Renderer.color(colorR-60*(color[3]?-1:1), colorG-60*(color[3]?-1:1), colorB-60*(color[3]?-1:1)),x,y+h-borderWidth,w,borderWidth)
        */
    }
    /** 
     * Draws a Block of text with markup at a location
     * @param {String} textArr The text to draw, split with `\n` also will auto newline based on the width
     * @param {Number} x The x location 
     * @param {Number} y The y location
     * @param {Number} width The max width of the text block, will auto break lines to fit
     * @return {height,imageClickData} height: the height of the rendered text, imageClickData: data about rendered images so you can click on them
     */
    renderTextBlockWithMarkup = function (textArr, x, y, width, actuallyRender = true) {
        let yOff = 0
        let isCodeBlock = false
        let codeblockType = undefined
        let imageClickData = []
        textArr.split(/\r?\n/g).forEach((line) => {
            if (line.startsWith("# ")) {
                yOff += this._renderSmallTextWithMarkup(line.substr(2), x, y + yOff, 2, width, actuallyRender)
                return;
            }
            if (line.startsWith("## ")) {
                yOff += this._renderSmallTextWithMarkup(line.substr(3), x, y + yOff, 1 + 1.5 / 2, width, actuallyRender)
                return;
            }
            if (line.startsWith("### ")) {
                yOff += this._renderSmallTextWithMarkup(line.substr(4), x, y + yOff, 1.5, width, actuallyRender)
                return;
            }
            if (line.startsWith("#### ")) {
                yOff += this._renderSmallTextWithMarkup(line.substr(5), x, y + yOff, 1.325, width, actuallyRender)
                return;
            }
            if (line.startsWith("##### ")) {
                yOff += this._renderSmallTextWithMarkup(line.substr(6), x, y + yOff, 1.25, width, actuallyRender)
                return;
            }
            if (line.startsWith("###### ")) {
                yOff += this._renderSmallTextWithMarkup(line.substr(7), x, y + yOff, 1.125, width, actuallyRender)
                return;
            }
            if (line.startsWith("```")) {
                isCodeBlock = !isCodeBlock
                if (!isCodeBlock) {
                    if (actuallyRender) Renderer.drawRect(Renderer.color(0, 0, 0, 50), x, y + yOff, width, 2)
                    yOff += 2
                } else {
                    codeblockType = line.substr(3)
                }
                yOff += 3
                return;
            } else {
                if (isCodeBlock) {
                    let lastColor = 8
                    this.splitStringAtWidth(this.addCodeBlockColoring(line.replace(/&/g, "&⭍"), codeblockType), width - 4).forEach((line2) => {
                        if (actuallyRender) Renderer.drawRect(Renderer.color(0, 0, 0, 50), x, y + yOff, width, 10)
                        if (actuallyRender) this.drawString("&" + lastColor + line2, x + 2, y + yOff + 2, 1)
                        yOff += 10

                        lastColor = ("&" + lastColor + line2).split(/[&§]/g).pop().substr(0, 1)
                    })
                    return;
                }
            }

            let first = true
            let image = undefined

            line.split("!").forEach((section) => {
                if (first) {
                    first = false
                    return;
                }

                let result = imageRegex.exec("!" + section)
                imageRegex.lastIndex = 0

                if (result !== null) {
                    image = getImageFromCache(result[1])
                }
            })

            if (!(line !== "" && line.replace(/!\[.*?\]\(.*?\)/g, "") == "")) {
                yOff += this._renderSmallTextWithMarkup(line.replace(/!\[.*?\]\(.*?\)/g, ""), x, y + yOff, 1, width, actuallyRender)
            }

            if (image !== undefined && image !== null) {
                try {

                    let imageScale = Infinity

                    imageScale = Math.min(imageScale, (width - 4) / image.getTextureWidth())
                    imageScale = Math.min(imageScale, 300 / image.getTextureHeight())

                    if (actuallyRender) image.draw(x, y + yOff, image.getTextureWidth() * imageScale, image.getTextureHeight() * imageScale)
                    imageClickData.push([x, y + yOff, image.getTextureWidth() * imageScale, image.getTextureHeight() * imageScale, image])

                    yOff += image.getTextureHeight() * imageScale

                } catch (e) {
                    //idk!
                }
            }
        })

        return { height: yOff, imageClickData: imageClickData }
    }

    addCodeBlockColoring(text, codeblockType) {
        switch (codeblockType) {
            case "diff":
                return text.split("\n").map(a => {
                    if (a.startsWith("+")) return "&2" + a
                    if (a.startsWith("-")) return "&c" + a
                    if (a.startsWith("!")) return "&9" + a
                    a
                }).join("\n")
            default:
                return text
        }
    }

    /**
     * Internal function, not ment for external use
     * @param {*} text 
     * @param {*} x 
     * @param {*} y 
     * @param {*} scale 
     * @param {*} maxWidth 
     */
    _renderSmallTextWithMarkup = function (text, x, y, scale, maxWidth, actuallyRender = true) {
        if (maxWidth < 1) return;
        let lastMarkup = { raw: "&8", isBold: false, isItalic: false }
        let lines = 0
        let nextText = text.replace(urlRegex, "⭍&9$1⭍&r").replace(basicUrlRegex, "⭍&9$&⭍&r")
        while (nextText) {
            let string = this._addMCMarkupToString(nextText, "&8", lastMarkup)

            let string1Split = string.string.split(" ")
            let string2Split = nextText.split(" ")

            let checkI = 0
            let checkStringTemp = "" //totally understandable var names go here
            let checkStringTemp2 = "" //totally understandable var names go here
            let isOverMaxWidth = false
            nextText = undefined
            while (checkI < string1Split.length) {
                if (isOverMaxWidth) {
                    nextText += " " + string2Split[checkI]
                }
                if (Renderer.getStringWidth(checkStringTemp + string1Split[checkI]) > maxWidth / scale && !isOverMaxWidth && checkI > 0) {
                    isOverMaxWidth = true
                    nextText = string2Split[checkI]
                }

                if (!isOverMaxWidth) {
                    checkStringTemp += string1Split[checkI] + " "
                    checkStringTemp2 += string2Split[checkI] + " "
                }

                checkI++
            }

            if (actuallyRender) this.drawString(checkStringTemp, x, y + 9 * lines * scale, scale)
            lastMarkup = this._addMCMarkupToString(checkStringTemp2, "&8", lastMarkup).markup
            lines++
        }
        if (lines === 0) {
            lines++
        }
        return lines * 9 * scale;
    }
    /**
     * Internal function, not ment for external use
     * @param {*} string 
     * @param {*} color 
     * @param {*} lastMarkup 
     */
    _addMCMarkupToString = function (string, color, lastMarkup) {
        let ret = { string: color }

        let isBold = false
        let isItalic = false
        if (lastMarkup) {
            isBold = lastMarkup.isBold
            isItalic = lastMarkup.isItalic
            ret.markup = lastMarkup
            ret.string += ret.markup.raw
        }

        let lastChar = ""
        let lastChar2 = ""
        let lastChar3 = ""
        let charArr = string.replace(urlRegex, "⭍&9$1⭍&r").replace(basicUrlRegex, "⭍&9$&⭍&r").split("")
        urlRegex.lastIndex = 0
        basicUrlRegex.lastIndex = 0
        charArr.push("")
        charArr.push("")
        charArr.push("")
        charArr.forEach((char) => {

            if (char !== "_" && char !== "*") {
                if (lastChar === "_" || lastChar === "*") {
                    if (lastChar2 === "_" || lastChar2 === "*") {
                        if (lastChar3 === "_" || lastChar3 === "*") {
                            isBold = !isBold
                            isItalic = !isItalic
                        } else {
                            isBold = !isBold
                        }
                    } else {
                        isItalic = !isItalic
                    }

                    ret.markup = { raw: "", isItalic: isItalic, isBold: isBold }
                    ret.markup.raw += "&r"
                    ret.markup.raw += color
                    if (isBold) {
                        ret.markup.raw += "&l"
                    }
                    if (isItalic) {
                        ret.markup.raw += "&o"
                    }
                    ret.string += ret.markup.raw
                }

                if (lastChar === "&" && lastChar2 === "⭍") {
                    ret.string += char
                    if (char === "r") {
                        ret.string += color
                    }
                    if (isBold) {
                        ret.string += "&l"
                    }
                    if (isItalic) {
                        ret.string += "&o"
                    }
                } else {
                    if (char === "&" && lastChar !== "⭍") {
                        ret.string += "&⭍"
                    } else {
                        ret.string += char
                    }
                }
            }

            lastChar3 = lastChar2
            lastChar2 = lastChar
            lastChar = char
        })

        return ret
    }
    /**
     * Takes a string and returns an array of strings split by that text width
     * @param {String} string The input string
     * @param {Number} width The max width of the string
     * @return {Array<String>} The array of strings with the maximum width
     */
    splitStringAtWidth = function (string, width) {
        let ret = []
        // let currLen = 0
        let lastStr = ""
        let first = true
        string.split(" ").forEach((str) => {
            if (Renderer.getStringWidth(lastStr + " " + str) > width) {
                ret.push(lastStr)
                // currLen = 0
                lastStr = str
            } else {
                lastStr += (first ? "" : " ") + str
                first = false
            }
            // currLen+=Renderer.getStringWidth(str)
        })
        ret.push(lastStr)
        return ret;
    }
    /**
     * Returns intersecting part of two rectangles
     * @param  {object}  r1 4 coordinates in form of {x1, y1, x2, y2} object
     * @param  {object}  r2 4 coordinates in form of {x1, y1, x2, y2} object
     * @return {boolean}    False if there's no intersecting part
     * @return {object}     4 coordinates in form of {x1, y1, x2, y2} object
     */
    getIntersectingRectangle = (r1, r2) => {
        [r1, r2] = [r1, r2].map(r => {
            return {
                x: [r.x1, r.x2].sort((a, b) => a - b),
                y: [r.y1, r.y2].sort((a, b) => a - b)
            };
        });

        const noIntersect = r2.x[0] > r1.x[1] || r2.x[1] < r1.x[0] ||
            r2.y[0] > r1.y[1] || r2.y[1] < r1.y[0];

        return noIntersect ? false : {
            x1: Math.max(r1.x[0], r2.x[0]), // _[0] is the lesser,
            y1: Math.max(r1.y[0], r2.y[0]), // _[1] is the greater
            x2: Math.min(r1.x[1], r2.x[1]),
            y2: Math.min(r1.y[1], r2.y[1])
        };
    }

    darkThemifyText(text) {
        let ret = ""
        for (let i = 0; i < text.length; i++) {
            if (text[i - 1] === "&" || text[i - 1] === "§") {
                ret += darkThemeTextReplacements[text[i]] || text[i]
            } else {
                ret += text[i]
            }
        }

        return ret
    }

}

let darkThemeTextReplacements = {
    "4": "c",
    "c": "4",
    "2": "a",
    "a": "2",
    "b": "1",
    "1": "b",
    "3": "9",
    "9": "3",
    "d": "5",
    "5": "d",
    "f": "0",
    "0": "7",
    "7": "8",
    "8": "7"
}

if (!global.soopyRenderLibsThingo) {
    global.soopyRenderLibsThingo = new RenderLibs()
}

export default global.soopyRenderLibsThingo;