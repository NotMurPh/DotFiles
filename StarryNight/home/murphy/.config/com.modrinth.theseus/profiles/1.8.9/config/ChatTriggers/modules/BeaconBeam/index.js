/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

const ResourceLocation = Java.type("net.minecraft.util.ResourceLocation")
const MathHelper = Java.type("net.minecraft.util.MathHelper")

const beaconBeam = new ResourceLocation("textures/entity/beacon_beam.png")

export default renderBeaconBeam2 = function(x, y, z, r, g, b, alpha, depthCheck, height=300){
    let bottomOffset = 0
    let topOffset = bottomOffset + height

    if(!depthCheck) GlStateManager.func_179097_i() //disableDepth
    
    Client.getMinecraft().func_110434_K().func_110577_a(beaconBeam) //getTextureManager().bindTexture()

    GL11.glTexParameterf(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_S, GL11.GL_REPEAT);
    GL11.glTexParameterf(GL11.GL_TEXTURE_2D, GL11.GL_TEXTURE_WRAP_T, GL11.GL_REPEAT);
    GlStateManager.func_179140_f() //disableLighting()
    GlStateManager.func_179089_o() //enableCull()
    GlStateManager.func_179098_w() //enableTexture2D()
    GlStateManager.func_179120_a(GL11.GL_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ONE, GL11.GL_ZERO) //tryBlendFuncSeparate()
    GlStateManager.func_179147_l() //
    GlStateManager.func_179120_a(GL11.GL_SRC_ALPHA, GL11.GL_ONE_MINUS_SRC_ALPHA, GL11.GL_ONE, GL11.GL_ZERO);
    
    let time = World.getTime() + Tessellator.getPartialTicks()

    let d1 = MathHelper.func_181162_h(-time * 0.2 - MathHelper.func_76128_c(-time * 0.1))

    let d2 = time * 0.025 * -1.5
    let d4 = 0.5 + Math.cos(d2 + 2.356194490192345) * 0.2
    let d5 = 0.5 + Math.sin(d2 + 2.356194490192345) * 0.2
    let d6 = 0.5 + Math.cos(d2 + (Math.PI / 4)) * 0.2
    let d7 = 0.5 + Math.sin(d2 + (Math.PI / 4)) * 0.2
    let d8 = 0.5 + Math.cos(d2 + 3.9269908169872414) * 0.2
    let d9 = 0.5 + Math.sin(d2 + 3.9269908169872414) * 0.2
    let d10 = 0.5 + Math.cos(d2 + 5.497787143782138) * 0.2
    let d11 = 0.5 + Math.sin(d2 + 5.497787143782138) * 0.2
    let d14 = -1 + d1
    let d15 = height * 2.5 + d14

    //tessellator.begin mimic
    Tessellator.begin(7, true)

    //.pos().tex().color().endVertex() 
    Tessellator.pos(x + d4, y + topOffset, z + d5).tex(1, d15).colorize(r, g, b, 1*alpha)
    Tessellator.pos(x + d4, y + bottomOffset, z + d5).tex(1, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d6, y + bottomOffset, z + d7).tex(0, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d6, y + topOffset, z + d7).tex(0, d15).colorize(r, g, b, 1*alpha)
    Tessellator.pos(x + d10, y + topOffset, z + d11).tex(1, d15).colorize(r, g, b, 1*alpha)
    Tessellator.pos(x + d10, y + bottomOffset, z + d11).tex(1, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d8, y + bottomOffset, z + d9).tex(0, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d8, y + topOffset, z + d9).tex(0, d15).colorize(r, g, b, 1*alpha)
    Tessellator.pos(x + d6, y + topOffset, z + d7).tex(1, d15).colorize(r, g, b, 1*alpha)
    Tessellator.pos(x + d6, y + bottomOffset, z + d7).tex(1, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d10, y + bottomOffset, z + d11).tex(0, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d10, y + topOffset, z + d11).tex(0, d15).colorize(r, g, b, 1*alpha)
    Tessellator.pos(x + d8, y + topOffset, z + d9).tex(1, d15).colorize(r, g, b, 1*alpha)
    Tessellator.pos(x + d8, y + bottomOffset, z + d9).tex(1, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d4, y + bottomOffset, z + d5).tex(0, d14).colorize(r, g, b, 1)
    Tessellator.pos(x + d4, y + topOffset, z + d5).tex(0, d15).colorize(r, g, b, 1*alpha)
    
    Tessellator.draw()

    GlStateManager.func_179129_p() //disableCull()
    let d12 = -1 + d1
    let d13 = height + d12

    Tessellator.begin(7, true)

    //.pos().tex().color().endVertex()
    Tessellator.pos(x + 0.2, y + topOffset, z + 0.2).tex(1, d13).colorize(r, g, b, 0.25*alpha)
    Tessellator.pos(x + 0.2, y + bottomOffset, z + 0.2).tex(1, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.8, y + bottomOffset, z + 0.2).tex(0, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.8, y + topOffset, z + 0.2).tex(0, d13).colorize(r, g, b, 0.25*alpha)
    Tessellator.pos(x + 0.8, y + topOffset, z + 0.8).tex(1, d13).colorize(r, g, b, 0.25*alpha)
    Tessellator.pos(x + 0.8, y + bottomOffset, z + 0.8).tex(1, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.2, y + bottomOffset, z + 0.8).tex(0, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.2, y + topOffset, z + 0.8).tex(0, d13).colorize(r, g, b, 0.25*alpha)
    Tessellator.pos(x + 0.8, y + topOffset, z + 0.2).tex(1, d13).colorize(r, g, b, 0.25*alpha)
    Tessellator.pos(x + 0.8, y + bottomOffset, z + 0.2).tex(1, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.8, y + bottomOffset, z + 0.8).tex(0, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.8, y + topOffset, z + 0.8).tex(0, d13).colorize(r, g, b, 0.25*alpha)
    Tessellator.pos(x + 0.2, y + topOffset, z + 0.8).tex(1, d13).colorize(r, g, b, 0.25*alpha)
    Tessellator.pos(x + 0.2, y + bottomOffset, z + 0.8).tex(1, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.2, y + bottomOffset, z + 0.2).tex(0, d12).colorize(r, g, b, 0.25)
    Tessellator.pos(x + 0.2, y + topOffset, z + 0.2).tex(0, d13).colorize(r, g, b, 0.25*alpha)
    
    Tessellator.draw()

    GlStateManager.func_179140_f() //disableLighting()
    GlStateManager.func_179098_w() //enableTexture2D()
    if(!depthCheck) GlStateManager.func_179126_j() //enableDepth()
    
}