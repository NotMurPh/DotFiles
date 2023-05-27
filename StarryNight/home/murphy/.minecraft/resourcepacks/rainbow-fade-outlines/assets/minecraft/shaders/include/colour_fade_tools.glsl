#version 150

float _fog_distance_(mat4 modelViewMat, vec3 pos, int shape) {
    // Mojang
    // Here for 1.18 compatability
    if (shape == 0) {
        return length((modelViewMat * vec4(pos, 1.0)).xyz);
    } else {
        float distXZ = length((modelViewMat * vec4(pos.x, 0.0, pos.z, 1.0)).xyz);
        float distY = length((modelViewMat * vec4(0.0, pos.y, 0.0, 1.0)).xyz);
        return max(distXZ, distY);
    }
}

bool roughlyEquals(vec3 colour, vec3 compare_colour) {
    // compares if 2 colours are equal to eachother within a range of error
    float ERROR_RANGE = 0.00001;

    vec3 compare_lower = compare_colour - ERROR_RANGE;
    vec3 compare_upper = compare_colour + ERROR_RANGE;

    if( (colour.r >= compare_lower.r && colour.r <= compare_upper.r)
     && (colour.g >= compare_lower.g && colour.g <= compare_upper.g)
     && (colour.b >= compare_lower.b && colour.b <= compare_upper.b) ) {
        return true;
    }else{
        return false;
    }
}