// Originally based on
// https://www.shadertoy.com/view/MtlyDX

#ifdef GL_ES
    #define PRECISION mediump
    precision PRECISION float;
precision PRECISION int;
#else
    #define PRECISION
#endif

uniform sampler2D u_texture0;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 v_texCoords;

vec4 scanline(vec2 coord, vec4 screen) {
    const float scale = 0.66;
    const float amt = 0.02; // intensity of effect
    const float spd = 1.0; // speed of scrolling rows transposed per second

    screen.rgb += vec3(sin((coord.y / scale - (u_time * spd * 6.28))) * amt);
    return screen;
}

vec4 channelSplit(sampler2D tex, vec2 coord) {
    const float spread = 0.008;
    vec4 frag;
    vec4 left = texture2D(tex, vec2(coord.x - spread * sin(u_time), coord.y));
    vec4 right = texture2D(tex, vec2(coord.x + spread * sin(u_time), coord.y));
    frag.r = left.r;
    frag.g = texture2D(tex, vec2(coord.x, coord.y)).g;
    frag.b = right.b;
    frag.a = left.a+right.a;
    return frag;
}

void main() {
    vec2 uv = v_texCoords;
    vec4 channelSplit = channelSplit(u_texture0, uv);
    vec2 screenSpace = uv * u_resolution.xy;
    gl_FragColor = scanline(screenSpace, channelSplit);
}