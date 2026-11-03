#version 120 

// (way more precision than a float can actually store...)
#define LOG_2 0.6931471805599453094172321214581765680755001

// start using these antialiasing values once you start (c)
#define AA 2
const int TOTAL_SAMPLES = AA * AA;

uniform vec2 c;
uniform int MAX_ITERS;
uniform vec2 windowSizePixels;
uniform vec2 camCenterWorld;
uniform float camWorldUnitsPerPixel;

// reprojection (1d) may require extra uniforms here...

// Use this to get a color from your smoothed Julia set escape times.
vec4 colorTime(float t) {
    return vec4(0.5 + 0.5 * cos(  0.1 * (t) + vec3(0.f, 0.35, 0.7)), 1.f);
}

struct EscapeTime {
    float iters;
    bool isInf;
};

// Escape time of iterating z^2 + c
EscapeTime escapeTimeSmooth(vec2 z) {
    EscapeTime eTime;
    vec2 zn = z;
    for (int n = 1; n <= MAX_ITERS; ++n) {
        if (length(zn) > 4) {
            eTime.iters =  n + 1 - ((log(log(length(zn)))) / LOG_2);
            eTime.isInf = false;
            return eTime;
        }

        zn = vec2(zn.x * zn.x - (zn.y * zn.y) + c.x, 2.0 * zn.x * zn.y + c.y);
    }

    eTime.isInf = true;
    return eTime;

}


vec2 windowToWorld(vec2 windowCoords) {
    // TODO
    vec2 worldCoords = camCenterWorld + (windowCoords - windowSizePixels * 0.5) * camWorldUnitsPerPixel;
    return worldCoords;
}

// For reprojection
vec2 worldToOldWindow(vec2 worldCoords) {
    // TODO
    return worldCoords;
}

// For SSAA
// Given (dx, dy) in [0, AA)^2, suppose the unit square [0, 1)^2 was cut up into AA equal
// partitions along each dimension. delta((dx, dy)) returns the center of the sub-square
// which is in the dy'th row and dx'th column (both 0-indexed).
vec2 delta(vec2 dxy) {
    // TODO
    return dxy;
}


void main() {
    // TODO
    // gl_FragColor = ... some vec4 rgba colour
    vec2 point = windowToWorld(gl_FragCoord.xy);
    EscapeTime esTime = escapeTimeSmooth(point);
    if (esTime.isInf) {
        gl_FragColor = vec4(0, 0, 0, 1);
    } else {
        gl_FragColor = colorTime(esTime.iters);
    }
}
