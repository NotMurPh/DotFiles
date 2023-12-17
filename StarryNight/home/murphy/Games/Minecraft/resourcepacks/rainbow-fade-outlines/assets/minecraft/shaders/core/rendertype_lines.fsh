#version 150
// Shader written by Enchanted_Games (https://enchanted.games)
// Please don't steal this code and use it without asking me first
// Any functions not made by me will include a credit line at the top of them

#moj_import <fog.glsl>
#moj_import <colour_fade_config.glsl>
#moj_import <colour_fade_tools.glsl>

in vec4 vertexColor;
in float vertexDistance;
uniform vec4 ColorModulator;
uniform float GameTime;
// float GameTime = 0;
uniform vec2 ScreenSize;
out vec4 fragColor;

vec4 gradient = vec4(0);

float animBlockSelection = fract(((vertexDistance * int(BLOCK_ANIMATE_WITH_DISTANCE)) + GameTime * BLOCK_ANIM_SPEED) / BLOCK_COLOUR_PERIOD);
float animHitbox = fract(((vertexDistance * int(HITBOX_ANIMATE_WITH_DISTANCE)) + GameTime * HITBOX_ANIM_SPEED) / HITBOX_COLOUR_PERIOD);

void main() {
    vec4 color = vertexColor;

    if( roughlyEquals(color.rgb, vec3(0)) && 0.39 < color.a && color.a < 0.41 ){
        // block outline selection
        bool smoothMix = BLOCK_SMOOTH_MIX;
        float gradientAnim = animBlockSelection;
        
        for(int i = 0; i < BLOCK_COLOURS.length(); i++){
            float i_f = float(i);
            float len_f = float(BLOCK_COLOURS.length());

            float _step = i_f/len_f;
            float _step2 = (i_f+1.)/len_f;

            if(i == 0){
                if(smoothMix){
                    gradient = mix(BLOCK_COLOURS[BLOCK_COLOURS.length()-1], BLOCK_COLOURS[i], smoothstep(_step, _step2, gradientAnim));
                } else{
                    gradient = mix(BLOCK_COLOURS[BLOCK_COLOURS.length()-1], BLOCK_COLOURS[i], step(_step, gradientAnim));
                }
            }else{
                if(smoothMix){
                    gradient = mix(gradient, BLOCK_COLOURS[i], smoothstep(_step, _step2, gradientAnim));
                } else{
                    gradient = mix(gradient, BLOCK_COLOURS[i], step(_step, gradientAnim));
                }
            }
        }

        color = gradient;
    }
    else if(CHANGE_HITBOXES && roughlyEquals(color.rgb, vec3(1)) && color.a > 0.95){
        // hitboxes (any white line)
        bool smoothMix = HITBOX_SMOOTH_MIX;
        float gradientAnim = animHitbox;
        
        for(int i = 0; i < HITBOX_COLOURS.length(); i++){
            float i_f = float(i);
            float len_f = float(HITBOX_COLOURS.length());

            float _step = i_f/len_f;
            float _step2 = (i_f+1.)/len_f;

            if(i == 0){
                if(smoothMix){
                    gradient = mix(HITBOX_COLOURS[HITBOX_COLOURS.length()-1], HITBOX_COLOURS[i], smoothstep(_step, _step2, gradientAnim));
                } else{
                    gradient = mix(HITBOX_COLOURS[HITBOX_COLOURS.length()-1], HITBOX_COLOURS[i], step(_step, gradientAnim));
                }
            }else{
                if(smoothMix){
                    gradient = mix(gradient, HITBOX_COLOURS[i], smoothstep(_step, _step2, gradientAnim));
                } else{
                    gradient = mix(gradient, HITBOX_COLOURS[i], step(_step, gradientAnim));
                }
            }
        }

        color = gradient;
    }
    else{
        color *= vertexColor;
    }

    fragColor = color;
}