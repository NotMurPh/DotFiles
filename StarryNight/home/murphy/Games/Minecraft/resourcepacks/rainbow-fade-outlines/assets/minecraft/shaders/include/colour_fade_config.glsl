#version 150
// Shader written by Enchanted_Games (https://enchanted.games)
// Please don't steal this code and use it without asking me first
// Any functions not made by me will include a credit line at the top of them

//    -- CONFIG STARTS HERE --
//         !! WARNING !!
//     Do not copy config from
//     an older version of this
//   pack, it will probably crash!

// -- Block Outline Selection Config --
// Colours (array of colour values)
// Every colour in the list should have a comma at the end except the last one
// You can use this generator to convert colours from hexadecimal 
// https://enchanted.games/generator/colourconverter
vec4 BLOCK_COLOURS[] = vec4[](
    vec4(1.0, 0.4863, 0.4667, 1.0),
    vec4(1.0, 0.9725, 0.4667, 1.0),
    vec4(0.5098, 1.0, 0.4627, 1.0),
    vec4(0.4667, 0.9725, 1.0, 1.0),
    vec4(0.5137, 0.4667, 1.0, 1.0),
    vec4(1.0, 0.4627, 0.8941, 1.0)
);

// Change animation speed (any number)
//  - Negative values make the animation go away from the player
int BLOCK_ANIM_SPEED = -2000;

// Colour Period (any positive whole number)
// = Changes how long it takes for the animation to move on to the next colour
// = This has a different effect depending on how many colours have been specified
//   - Bigger numbers keeps a colour on-screen longer
int BLOCK_COLOUR_PERIOD = 7;

// Should colours be smoothly interpolated together? (true or false)
// = when false, colours will have no fade between them and will instantly change to the next colour
// = when true, colours will be smoothly mixed together
bool BLOCK_SMOOTH_MIX = true;

// Should the animation change depending on the cameras distance? (true or false)
// = when false, there will only ever be one colour showing
// = when true, there can be multiple colours showing at once
bool BLOCK_ANIMATE_WITH_DISTANCE = true;


// -- Hitbox Config --
// look above for explanations of each config option
vec4 HITBOX_COLOURS[] = vec4[](
    vec4(1.0, 0.2196, 0.1922, 1.0),
    vec4(1.0, 0.9608, 0.1922, 1.0),
    vec4(0.2588, 1.0, 0.1922, 1.0),
    vec4(0.2, 0.9608, 1.0, 1.0),
    vec4(0.251, 0.1843, 1.0, 1.0),
    vec4(1.0, 0.1882, 0.8392, 1.0)
);

int HITBOX_ANIM_SPEED = 1700;

int HITBOX_COLOUR_PERIOD = 10;

bool HITBOX_SMOOTH_MIX = true;

bool HITBOX_ANIMATE_WITH_DISTANCE = true;

// Should the entity hitboxes be changed? (true or false)
bool CHANGE_HITBOXES = true;

// -- General Config --

// Line thickness (any decimal or whole number)
// = Effects the width of the block outline AND hitboxes (even if hitbox colours are disabled).
// = Only affects lines that are from 0 to about 10 blocks away from the camera
//   - larger numbers make the line thicker
//   - smaller numbers make the line thinner
float LINE_WIDTH_MULTIPLIER = 1.0;

//    -- CONFIG ENDS HERE --

// v3 patch notes:
// Completely rewrote the shader
// Support for more than two colours
// Fixed some colours becoming too bright and distorted

// v3.1 patch notes:
// Added ANIMATE_WITH_DISTANCE options
// Added SMOOTH_MIX options
