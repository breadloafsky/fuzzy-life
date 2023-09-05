#define PI 3.1415926538
precision mediump float;

uniform mediump float uTextureDims[2];
uniform sampler2D uSampler;
varying lowp vec2 vTextureCoord;





vec4 getColor0(float v){
  vec4 c = vec4(1.-(v),1,1,1);
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  c = vec4(c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y),1);
  c.rgb *= clamp((v*1.5),0.,1.);  
  return c;
}

vec4 getColor1(float v){
  vec3 a = vec3(
    -cos(1.*PI*v),
    -cos(1.*PI*v*3.),
    -cos(1.*PI* v*2.)
  )*0.5+0.5;
  return vec4(a,1);
}



highp vec4 getPixel(mediump vec2 coord, float offsetX, float offsetY){
  coord.x += offsetX;
  coord.y += offsetY;
  return texture2D(uSampler, coord);
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
  

  tex = getColor0(tex.r);

  //tex.rgb = tex.rrb;

  // if(tex.r > 0.8)
  //   tex.rb *= vec2(0.6,0.8);
  // else if(tex.r > 0.3)
  //   tex.gr *= vec2(1.4,1.);
  // else
  //   tex.br *= vec2(2.,1.);
  

  
  gl_FragColor = tex;
}