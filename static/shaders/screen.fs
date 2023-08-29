#define PI 3.1415926538
precision mediump float;

uniform mediump float uTextureDims[2];
uniform sampler2D uSampler;
varying lowp vec2 vTextureCoord;


highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
  coord.x += offsetX;
  coord.y += offsetY;
  return texture2D(uSampler, coord);
}
vec4 calculateColor(float v){

  float n = v;
  vec4  result = vec4(
      2.- abs(n * 6.0 - 3.),
      2.- abs(n * 6.0 - 2.),
      2.- abs(n * 6.0 - 1.),
      1.);
  result.rgb *= v*2.;                   // if value == 0 -> paint black
  result = clamp( result, 0., 1. );
  return result;
}

void main(void) {

  mediump vec4 tex = vec4(0,0,0,0);

  for(int i = -1; i < 1; i++){
    for(int j = -1; j < 1; j++){
      mediump float i_f = float(i) / uTextureDims[0];
      mediump float j_f = float(j) / uTextureDims[1];
      tex += getPixel(vTextureCoord ,i_f, j_f );
    }
  }
  tex.rgba /= 4.;
  //tex.rgb = tex.rrr;



  tex.r = (tex.r+tex.g)/2.;
  

  tex = calculateColor(tex.r);

  //tex.rgb = tex.rrb;

  // if(tex.r > 0.8)
  //   tex.rb *= vec2(0.6,0.8);
  // else if(tex.r > 0.3)
  //   tex.gr *= vec2(1.4,1.);
  // else
  //   tex.br *= vec2(2.,1.);
  

  
  gl_FragColor = tex;
}